// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
import AggregateError from "aggregate-error";
import cloneDeep from "lodash/cloneDeep";
import { FileText, RefreshCcw, RotateCcw, createElement } from "lucide";
import {
  FileSystemAdapter,
  type Modal,
  Notice,
  Platform,
  Plugin,
  type Setting,
  TFolder,
  addIcon,
  requireApiVersion,
  setIcon,
} from "obsidian";
import type {
  RemotelySavePluginSettings,
  SyncTriggerSourceType,
} from "./baseTypes";
import { COMMAND_URI } from "./baseTypes";
import { API_VER_ENSURE_REQURL_OK } from "./baseTypesObs";
import { messyConfigToNormal, normalConfigToMessy } from "./configPersist";
import { getClient } from "./fsGetter";
import { FakeFsLocal } from "./fsLocal";
import { DEFAULT_S3_CONFIG } from "./fsS3";
import { I18n } from "./i18n";
import type { LangTypeAndAuto, TransItemType } from "./i18n";
import type { InternalDBs } from "./localdb";
import {
  clearAllLoggerOutputRecords,
  clearExpiredSyncPlanRecords,
  getLastFailedSyncTimeByVault,
  getLastSuccessSyncTimeByVault,
  prepareDBs,
  upsertLastFailedSyncTimeByVault,
  upsertLastSuccessSyncTimeByVault,
  upsertPluginVersionByVault,
} from "./localdb";
import { changeMobileStatusBar } from "./misc";
import { RemotelySaveSettingTab } from "./settings";
import { syncer } from "./sync";
import { SyncAlgoV3Modal } from "./syncAlgoV3Notice";

const DEFAULT_SETTINGS: RemotelySavePluginSettings = {
  s3: DEFAULT_S3_CONFIG,
  serviceType: "s3", // P2-1 hardcoded (Step 31)
  currLogLevel: "info", // P2-5 hardcoded (Step 31)
  autoRunEveryMilliseconds: -1,
  initRunAfterMilliseconds: -1,
  syncOnSaveAfterMilliseconds: -1,
  agreeToUploadExtraMetadata: true, // as of 20240106, it's safe to assume every new user agrees with this
  concurrency: 5,
  syncConfigDir: false,
  syncBookmarks: false,
  syncUnderscoreItems: false,
  lang: "auto",
  skipSizeLargerThan: -1,
  enableStatusBarInfo: true,
  deleteToWhere: "system",
  agreeToUseSyncV3: false,
  conflictAction: "keep_newer",
  protectModifyPercentage: 50,
  syncDirection: "bidirectional",
  obfuscateSettingFile: true, // P2-6 hardcoded (Step 31)
  enableMobileStatusBar: false,
};

const iconNameSyncWait = `remotely-save-sync-wait`;
const iconNameSyncRunning = `remotely-save-sync-running`;
const iconNameLogs = `remotely-save-logs`;

const getIconSvg = () => {
  const iconSvgSyncWait = createElement(RotateCcw);
  iconSvgSyncWait.setAttribute("width", "100");
  iconSvgSyncWait.setAttribute("height", "100");
  const iconSvgSyncRunning = createElement(RefreshCcw);
  iconSvgSyncRunning.setAttribute("width", "100");
  iconSvgSyncRunning.setAttribute("height", "100");
  const iconSvgLogs = createElement(FileText);
  iconSvgLogs.setAttribute("width", "100");
  iconSvgLogs.setAttribute("height", "100");
  const res = {
    iconSvgSyncWait: iconSvgSyncWait.outerHTML,
    iconSvgSyncRunning: iconSvgSyncRunning.outerHTML,
    iconSvgLogs: iconSvgLogs.outerHTML,
  };

  iconSvgSyncWait.empty();
  iconSvgSyncRunning.empty();
  iconSvgLogs.empty();
  return res;
};

const getStatusBarShortMsgFromSyncSource = (
  t: (x: TransItemType, vars?: any) => string,
  s: SyncTriggerSourceType | undefined
) => {
  if (s === undefined) {
    return "";
  }
  switch (s) {
    case "manual":
      return t("statusbar_sync_source_manual");
    case "dry":
      return t("statusbar_sync_source_dry");
    case "auto":
      return t("statusbar_sync_source_auto");
    case "auto_once_init":
      return t("statusbar_sync_source_auto_once_init");
    default:
      // unknown trigger source: fall back to no prefix instead of throwing,
      // otherwise a new enum member would break the whole status bar refresh.
      return "";
  }
};

const getSyncSourceLabel = (
  t: (x: TransItemType, vars?: any) => string,
  s: SyncTriggerSourceType | undefined
) => {
  if (s === undefined) {
    return "";
  }
  switch (s) {
    case "manual":
      return t("synctriggersource_manual");
    case "dry":
      return t("synctriggersource_dry");
    case "auto":
      return t("synctriggersource_auto");
    case "auto_once_init":
      return t("synctriggersource_auto_once_init");
    default:
      // unknown trigger source: fall back to empty string instead of throwing,
      // otherwise a new enum member would break the whole ribbon tooltip.
      return "";
  }
};

export default class RemotelySavePlugin extends Plugin {
  settings!: RemotelySavePluginSettings;
  db!: InternalDBs;
  isSyncing!: boolean;
  statusBarElement!: HTMLSpanElement;
  currSyncMsg?: string;
  syncRibbon?: HTMLElement;
  autoRunIntervalID?: number;
  i18n!: I18n;
  vaultRandomID!: string;
  appContainerObserver?: MutationObserver;

  async syncRun(triggerSource: SyncTriggerSourceType = "manual") {
    const fsLocal = new FakeFsLocal(
      this.app.vault,
      this.settings.syncConfigDir ?? false,
      this.settings.syncBookmarks ?? false,
      this.app.vault.configDir,
      this.manifest.id,
      this.settings.deleteToWhere ?? "system"
    );
    const fsRemote = getClient(
      this.settings,
      this.app.vault.getName(),
      async () => await this.saveSettings()
    );

    const t = (x: TransItemType, vars?: any) => {
      return this.i18n.t(x, vars);
    };

    const profileID = this.getCurrProfileID();

    const getProtectError = (
      protectModifyPercentage: number,
      realModifyDeleteCount: number,
      allFilesCount: number
    ) => {
      const percent = ((100 * realModifyDeleteCount) / allFilesCount).toFixed(
        1
      );
      const res = t("syncrun_abort_protectmodifypercentage", {
        protectModifyPercentage,
        realModifyDeleteCount,
        allFilesCount,
        percent,
      });
      return res;
    };

    const getNotice = (
      s: SyncTriggerSourceType,
      msg: string,
      timeout?: number
    ) => {
      if (s === "manual" || s === "dry") {
        new Notice(msg, timeout);
      }
    };

    const notifyFunc = async (s: SyncTriggerSourceType, step: number) => {
      switch (step) {
        case 0:
          if (s === "dry") {
            if (this.settings.currLogLevel === "info") {
              getNotice(s, t("syncrun_shortstep0"));
            } else {
              getNotice(s, t("syncrun_step0"));
            }
          }

          break;

        case 1:
          if (this.settings.currLogLevel === "info") {
            getNotice(
              s,
              t("syncrun_shortstep1", {
                serviceType: this.settings.serviceType,
              })
            );
          } else {
            getNotice(
              s,
              t("syncrun_step1", {
                serviceType: this.settings.serviceType,
              })
            );
          }
          break;

        case 2:
          if (this.settings.currLogLevel === "info") {
            // pass
          } else {
            getNotice(s, t("syncrun_step2"));
          }
          break;

        case 3:
          if (this.settings.currLogLevel === "info") {
            // pass
          } else {
            getNotice(s, t("syncrun_step3"));
          }
          break;

        case 4:
          if (this.settings.currLogLevel === "info") {
            // pass
          } else {
            getNotice(s, t("syncrun_step4"));
          }
          break;

        case 5:
          if (this.settings.currLogLevel === "info") {
            // pass
          } else {
            getNotice(s, t("syncrun_step5"));
          }
          break;

        case 6:
          if (this.settings.currLogLevel === "info") {
            // pass
          } else {
            getNotice(s, t("syncrun_step6"));
          }
          break;

        case 7:
          if (s === "dry") {
            if (this.settings.currLogLevel === "info") {
              getNotice(s, t("syncrun_shortstep2skip"));
            } else {
              getNotice(s, t("syncrun_step7skip"));
            }
          } else {
            if (this.settings.currLogLevel === "info") {
              // pass
            } else {
              getNotice(s, t("syncrun_step7"));
            }
          }
          break;

        case 8:
          if (this.settings.currLogLevel === "info") {
            getNotice(s, t("syncrun_shortstep2"));
          } else {
            getNotice(s, t("syncrun_step8"));
          }
          break;

        default:
          // unknown step: log it and skip the notice instead of throwing,
          // otherwise a new step would abort the whole sync run.
          console.error(`unknown step=${step} for showing notice`);
      }
    };

    const errNotifyFunc = async (s: SyncTriggerSourceType, error: Error) => {
      console.error(error);
      if (error instanceof AggregateError) {
        for (const e of error.errors) {
          getNotice(s, e.message, 10 * 1000);
        }
      } else {
        getNotice(s, error?.message ?? "error while sync", 10 * 1000);
      }
    };

    const ribboonFunc = async (s: SyncTriggerSourceType, step: number) => {
      if (step === 1) {
        if (this.syncRibbon !== undefined) {
          setIcon(this.syncRibbon, iconNameSyncRunning);
          this.syncRibbon.setAttribute(
            "aria-label",
            t("syncrun_syncingribbon", {
              pluginName: t("plugin_display_name"),
              triggerSource: getSyncSourceLabel(t, s),
            })
          );
        }
      } else if (step === 8) {
        // last step
        if (this.syncRibbon !== undefined) {
          setIcon(this.syncRibbon, iconNameSyncWait);
          const originLabel = t("plugin_display_name");
          this.syncRibbon.setAttribute("aria-label", originLabel);
        }
      }
    };

    const statusBarFunc = async (
      s: SyncTriggerSourceType,
      step: number,
      everythingOk: boolean
    ) => {
      if (step === 1) {
        // change status to "syncing..." on statusbar
        this.updateLastSyncMsg(s, "syncing", -1, -1);
      } else if (step === 8 && everythingOk) {
        const ts = Date.now();
        await upsertLastSuccessSyncTimeByVault(this.db, this.vaultRandomID, ts);
        this.updateLastSyncMsg(s, "not_syncing", ts, null); // hack: 'not_syncing'
      } else if (!everythingOk) {
        const ts = Date.now();
        await upsertLastFailedSyncTimeByVault(this.db, this.vaultRandomID, ts);
        this.updateLastSyncMsg(s, "not_syncing", null, ts);
      }
    };

    const markIsSyncingFunc = async (isSyncing: boolean) => {
      this.isSyncing = isSyncing;
    };

    const callbackSyncProcess = async (
      s: SyncTriggerSourceType,
      realCounter: number,
      realTotalCount: number,
      pathName: string,
      decision: string
    ) => {
      this.setCurrSyncMsg(
        t,
        s,
        realCounter,
        realTotalCount,
        pathName,
        decision,
        triggerSource
      );
    };

    if (this.isSyncing) {
      getNotice(
        triggerSource,
        t("syncrun_alreadyrunning", {
          pluginName: t("plugin_display_name"),
          syncStatus: t("syncstatus_running"),
          newTriggerSource: getSyncSourceLabel(t, triggerSource),
        })
      );

      if (this.currSyncMsg !== undefined && this.currSyncMsg !== "") {
        getNotice(triggerSource, this.currSyncMsg);
      }
      return;
    }

    const configSaver = async () => await this.saveSettings();

    await syncer(
      fsLocal,
      fsRemote,
      this.db,
      triggerSource,
      profileID,
      this.vaultRandomID,
      this.app.vault.configDir,
      this.settings,
      this.manifest.version,
      configSaver,
      getProtectError,
      markIsSyncingFunc,
      notifyFunc,
      errNotifyFunc,
      ribboonFunc,
      statusBarFunc,
      callbackSyncProcess
    );
  }

  async onload() {
    console.info(`loading plugin ${this.manifest.id}`);

    const { iconSvgSyncWait, iconSvgSyncRunning, iconSvgLogs } = getIconSvg();

    addIcon(iconNameSyncWait, iconSvgSyncWait);
    addIcon(iconNameSyncRunning, iconSvgSyncRunning);
    addIcon(iconNameLogs, iconSvgLogs);

    this.currSyncMsg = "";
    this.isSyncing = false;

    await this.loadSettings();

    // MUST after loadSettings and before prepareDB
    const profileID: string = this.getCurrProfileID();

    // lang should be load early, but after settings
    this.i18n = new I18n(this.settings.lang!, async (lang: LangTypeAndAuto) => {
      this.settings.lang = lang;
      await this.saveSettings();
    });
    const t = (x: TransItemType, vars?: any) => {
      return this.i18n.t(x, vars);
    };

    // MUST before prepareDB()
    // And, it's also possible to be an empty string,
    // which means the vaultRandomID is read from db later!
    const vaultRandomIDFromOldConfigFile =
      await this.getVaultRandomIDFromOldConfigFile();

    // no need to await this
    this.tryToAddIgnoreFile();

    const vaultBasePath = this.getVaultBasePath();

    try {
      await this.prepareDBAndVaultRandomID(
        vaultBasePath,
        vaultRandomIDFromOldConfigFile,
        profileID
      );
    } catch (err: any) {
      new Notice(
        err?.message ?? "error of prepareDBAndVaultRandomID",
        10 * 1000
      );
      throw err;
    }

    // must AFTER preparing DB
    this.enableAutoClearOutputToDBHistIfSet();

    // must AFTER preparing DB
    this.enableAutoClearSyncPlanHist();

    this.syncRibbon = this.addRibbonIcon(
      iconNameSyncWait,
      t("ribbon_sync_tooltip"),
      async () => this.syncRun("manual")
    );

    this.enableMobileStatusBarIfSet();

    // Create Status Bar Item
    if (
      (!Platform.isMobile ||
        (Platform.isMobile && this.settings.enableMobileStatusBar)) &&
      this.settings.enableStatusBarInfo === true
    ) {
      const statusBarItem = this.addStatusBarItem();
      this.statusBarElement = statusBarItem.createEl("span");
      this.statusBarElement.setAttribute("data-tooltip-position", "top");

      if (!this.isSyncing) {
        this.updateLastSyncMsg(
          undefined,
          "not_syncing",
          await getLastSuccessSyncTimeByVault(this.db, this.vaultRandomID),
          await getLastFailedSyncTimeByVault(this.db, this.vaultRandomID)
        );
      }
      // update statusbar text every 30 seconds
      this.registerInterval(
        window.setInterval(async () => {
          if (!this.isSyncing) {
            this.updateLastSyncMsg(
              undefined,
              "not_syncing",
              await getLastSuccessSyncTimeByVault(this.db, this.vaultRandomID),
              await getLastFailedSyncTimeByVault(this.db, this.vaultRandomID)
            );
          }
        }, 1000 * 30)
      );
    }

    this.addCommand({
      id: "start-sync",
      name: t("command_startsync"),
      icon: iconNameSyncWait,
      callback: async () => {
        this.syncRun("manual");
      },
    });

    this.addCommand({
      id: "start-sync-dry-run",
      name: t("command_drynrun"),
      icon: iconNameSyncWait,
      callback: async () => {
        this.syncRun("dry");
      },
    });

    this.addSettingTab(new RemotelySaveSettingTab(this.app, this));


    this.enableCheckingFileStat();

    if (!this.settings.agreeToUseSyncV3) {
      const syncAlgoV3Modal = new SyncAlgoV3Modal(this.app, this);
      syncAlgoV3Modal.open();
    } else {
      this.enableAutoSyncIfSet();
      this.enableInitSyncIfSet();
    }

    // compare versions and read new versions
    const { oldVersion } = await upsertPluginVersionByVault(
      this.db,
      this.vaultRandomID,
      this.manifest.version
    );
  }

  async onunload() {
    console.info(`unloading plugin ${this.manifest.id}`);
    this.syncRibbon = undefined;
    if (this.appContainerObserver !== undefined) {
      this.appContainerObserver.disconnect();
      this.appContainerObserver = undefined;
    }
  }

  async loadSettings() {
    this.settings = Object.assign(
      {},
      cloneDeep(DEFAULT_SETTINGS),
      messyConfigToNormal(await this.loadData())
    );

    if (this.settings.s3.partsConcurrency === undefined) {
      this.settings.s3.partsConcurrency = 20;
    }
    if (this.settings.s3.forcePathStyle === undefined) {
      this.settings.s3.forcePathStyle = true;
    }

    // PR1-2/3/4 + general
    if (this.settings.syncBookmarks === undefined) {
      this.settings.syncBookmarks = false;
    }

    // === cstcloud-sync: 6 forced overrides (Step 33) ==================
    this.settings.s3.generateFolderObject = false;
    this.settings.enableStatusBarInfo = true;
    this.settings.syncOnSaveAfterMilliseconds = -1;
    this.settings.deleteToWhere = "system";
    // ignorePaths / onlyAllowPaths removed from settings schema.
    // Backward-compat: if old data.json still has them, silently drop them
    // (no UI to set, no behavior change).
    delete (this.settings as any).ignorePaths;
    delete (this.settings as any).onlyAllowPaths;
    // ================================================================

    if (requireApiVersion(API_VER_ENSURE_REQURL_OK)) {
      this.settings.s3.bypassCorsLocally = true; // deprecated as of 20240113
    }

    if (this.settings.agreeToUseSyncV3 === undefined) {
      this.settings.agreeToUseSyncV3 = false;
    }
    if (this.settings.conflictAction === undefined) {
      this.settings.conflictAction = "keep_newer";
    }
    if (this.settings.protectModifyPercentage === undefined) {
      this.settings.protectModifyPercentage = 50;
    }
    if (this.settings.syncDirection === undefined) {
      this.settings.syncDirection = "bidirectional";
    }

    if (this.settings.obfuscateSettingFile === undefined) {
      this.settings.obfuscateSettingFile = true;
    }

    if (this.settings.enableMobileStatusBar === undefined) {
      this.settings.enableMobileStatusBar = false;
    }

    await this.saveSettings();
  }

  async saveSettings() {
    if (this.settings.obfuscateSettingFile) {
      await this.saveData(normalConfigToMessy(this.settings));
    } else {
      await this.saveData(this.settings);
    }
  }

  /**
   * After 202403 the data should be of profile based.
   */
  getCurrProfileID() {
    if (this.settings.serviceType !== undefined) {
      return `${this.settings.serviceType}-default-1`;
    } else {
      throw Error("unknown serviceType in the setting!");
    }
  }

  async getVaultRandomIDFromOldConfigFile() {
    let vaultRandomID = "";
    if (this.settings.vaultRandomID !== undefined) {
      // In old version, the vault id is saved in data.json
      // But we want to store it in localForage later
      if (this.settings.vaultRandomID !== "") {
        // a real string was assigned before
        vaultRandomID = this.settings.vaultRandomID;
      }
      console.debug("vaultRandomID is no longer saved in data.json");
      delete this.settings.vaultRandomID;
      await this.saveSettings();
    }
    return vaultRandomID;
  }

  getVaultBasePath() {
    if (this.app.vault.adapter instanceof FileSystemAdapter) {
      // in desktop
      return this.app.vault.adapter.getBasePath().split("?")[0];
    } else {
      // in mobile
      return this.app.vault.adapter.getResourcePath("").split("?")[0];
    }
  }

  async prepareDBAndVaultRandomID(
    vaultBasePath: string,
    vaultRandomIDFromOldConfigFile: string,
    profileID: string
  ) {
    const { db, vaultRandomID } = await prepareDBs(
      vaultBasePath,
      vaultRandomIDFromOldConfigFile,
      profileID
    );
    this.db = db;
    this.vaultRandomID = vaultRandomID;
  }

  enableAutoSyncIfSet() {
    if (
      this.settings.autoRunEveryMilliseconds !== undefined &&
      this.settings.autoRunEveryMilliseconds !== null &&
      this.settings.autoRunEveryMilliseconds > 0
    ) {
      this.app.workspace.onLayoutReady(() => {
        const intervalID = window.setInterval(() => {
          this.syncRun("auto");
        }, this.settings.autoRunEveryMilliseconds);
        this.autoRunIntervalID = intervalID;
        this.registerInterval(intervalID);
      });
    }
  }

  enableInitSyncIfSet() {
    if (
      this.settings.initRunAfterMilliseconds !== undefined &&
      this.settings.initRunAfterMilliseconds !== null &&
      this.settings.initRunAfterMilliseconds > 0
    ) {
      this.app.workspace.onLayoutReady(() => {
        window.setTimeout(() => {
          this.syncRun("auto_once_init");
        }, this.settings.initRunAfterMilliseconds);
      });
    }
  }

  enableMobileStatusBarIfSet() {
    this.app.workspace.onLayoutReady(() => {
      if (Platform.isMobile && this.settings.enableMobileStatusBar) {
        this.appContainerObserver = changeMobileStatusBar("enable");
      }
    });
  }

  enableCheckingFileStat() {
    this.app.workspace.onLayoutReady(() => {
      const t = (x: TransItemType, vars?: any) => {
        return this.i18n.t(x, vars);
      };
      this.registerEvent(
        this.app.workspace.on("file-menu", (menu, file) => {
          if (file instanceof TFolder) {
            // folder not supported yet
            return;
          }

          menu.addItem((item) => {
            item
              .setTitle(t("menu_check_file_stat"))
              .setIcon("file-cog")
              .onClick(async () => {
                const filePath = file.path;
                const fsLocal = new FakeFsLocal(
                  this.app.vault,
                  this.settings.syncConfigDir ?? false,
                  this.settings.syncBookmarks ?? false,
                  this.app.vault.configDir,
                  this.manifest.id,
                  this.settings.deleteToWhere ?? "system"
                );
                const s = await fsLocal.stat(filePath);
                new Notice(JSON.stringify(s, null, 2), 10000);
              });
          });
        })
      );
    });
  }

  async saveAgreeToUseNewSyncAlgorithm() {
    this.settings.agreeToUseSyncV3 = true;
    await this.saveSettings();
  }

  setCurrSyncMsg(
    t: (x: TransItemType, vars?: any) => string,
    s: SyncTriggerSourceType,
    i: number,
    totalCount: number,
    pathName: string,
    decision: string,
    triggerSource: SyncTriggerSourceType
  ) {
    const L = `${totalCount}`.length;
    const iStr = `${i}`.padStart(L, "0");
    const prefix = getStatusBarShortMsgFromSyncSource(t, s);
    const shortMsg = prefix + `Syncing ${iStr}/${totalCount}`;
    const longMsg =
      prefix +
      `Syncing progress=${iStr}/${totalCount},decision=${decision},path=${pathName},source=${triggerSource}`;
    this.currSyncMsg = longMsg;

    if (this.statusBarElement !== undefined) {
      this.statusBarElement.setText(shortMsg);
      this.statusBarElement.setAttribute("aria-label", longMsg);
    }
  }

  updateLastSyncMsg(
    s: SyncTriggerSourceType | undefined,
    syncStatus: "not_syncing" | "syncing",
    lastSuccessSyncMillis: number | null | undefined,
    lastFailedSyncMillis: number | null | undefined
  ) {
    if (this.statusBarElement === undefined) return;

    // console.debug(lastSuccessSyncMillis);
    // console.debug(lastFailedSyncMillis);

    const t = (x: TransItemType, vars?: any) => {
      return this.i18n.t(x, vars);
    };

    let lastSyncMsg = t("statusbar_lastsync_never");
    let lastSyncLabelMsg = t("statusbar_lastsync_never_label");

    const inputTs = Math.max(
      lastSuccessSyncMillis ?? -999,
      lastFailedSyncMillis ?? -999
    );
    const isSuccess =
      (lastSuccessSyncMillis ?? -999) >= (lastFailedSyncMillis ?? -999);

    if (syncStatus === "syncing") {
      lastSyncMsg =
        getStatusBarShortMsgFromSyncSource(t, s!) + t("statusbar_syncing");
    } else if (inputTs > 0) {
      let prefix = "";
      if (isSuccess) {
        prefix = t("statusbar_sync_status_prefix_success");
      } else {
        prefix = t("statusbar_sync_status_prefix_failed");
      }

      const deltaTime = Date.now() - inputTs;
      // create human readable time
      const years = Math.floor(deltaTime / 31556952000);
      const months = Math.floor(deltaTime / 2629746000);
      const weeks = Math.floor(deltaTime / 604800000);
      const days = Math.floor(deltaTime / 86400000);
      const hours = Math.floor(deltaTime / 3600000);
      const minutes = Math.floor(deltaTime / 60000);
      const seconds = Math.floor(deltaTime / 1000);
      let timeText = "";
      if (years > 0) {
        timeText = t("statusbar_time_years", { time: years });
      } else if (months > 0) {
        timeText = t("statusbar_time_months", { time: months });
      } else if (weeks > 0) {
        timeText = t("statusbar_time_weeks", { time: weeks });
      } else if (days > 0) {
        timeText = t("statusbar_time_days", { time: days });
      } else if (hours > 0) {
        timeText = t("statusbar_time_hours", { time: hours });
      } else if (minutes > 0) {
        timeText = t("statusbar_time_minutes", { time: minutes });
      } else if (seconds > 30) {
        timeText = t("statusbar_time_lessminute");
      } else {
        timeText = t("statusbar_time_now");
      }
      const dateText = new Date(inputTs).toLocaleTimeString(
        navigator.language,
        {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );

      lastSyncMsg = prefix + timeText;
      lastSyncLabelMsg =
        prefix + t("statusbar_lastsync_label", { date: dateText });
    } else {
      // Neither a successful nor a failed sync has ever been recorded for
      // this vault, so keep the "never synced" texts initialized above.
    }

    this.statusBarElement.setText(lastSyncMsg);
    this.statusBarElement.setAttribute("aria-label", lastSyncLabelMsg);
  }

  /**
   * Because data.json contains sensitive information,
   * We usually want to ignore it in the version control.
   * However, if there's already a an ignore file (even empty),
   * we respect the existing configure and not add any modifications.
   * @returns
   */
  async tryToAddIgnoreFile() {
    // Obsidian's plugin folder is named after the plugin id, so use
    // manifest.id as the fallback instead of manifest.dir (which would
    // otherwise expand to ".../plugins/undefined").
    const pluginConfigDir =
      this.manifest.dir ||
      `${this.app.vault.configDir}/plugins/${this.manifest.id}`;
    const pluginConfigDirExists =
      await this.app.vault.adapter.exists(pluginConfigDir);
    if (!pluginConfigDirExists) {
      // what happened?
      return;
    }
    const ignoreFile = `${pluginConfigDir}/.gitignore`;
    const ignoreFileExists = await this.app.vault.adapter.exists(ignoreFile);

    const contentText = "data.json\n";

    try {
      if (!ignoreFileExists) {
        // not exists, directly create
        // no need to await
        this.app.vault.adapter.write(ignoreFile, contentText);
      }
    } catch (error) {
      // just skip
    }
  }

  enableAutoClearOutputToDBHistIfSet() {
    const initClearOutputToDBHistAfterMilliseconds = 1000 * 30;

    this.app.workspace.onLayoutReady(() => {
      // init run
      window.setTimeout(() => {
        clearAllLoggerOutputRecords(this.db);
      }, initClearOutputToDBHistAfterMilliseconds);
    });
  }

  enableAutoClearSyncPlanHist() {
    const initClearSyncPlanHistAfterMilliseconds = 1000 * 45;
    const autoClearSyncPlanHistAfterMilliseconds = 1000 * 60 * 5;

    this.app.workspace.onLayoutReady(() => {
      // init run
      window.setTimeout(() => {
        clearExpiredSyncPlanRecords(this.db);
      }, initClearSyncPlanHistAfterMilliseconds);

      // scheduled run
      const intervalID = window.setInterval(() => {
        clearExpiredSyncPlanRecords(this.db);
      }, autoClearSyncPlanHistAfterMilliseconds);
      this.registerInterval(intervalID);
    });
  }
}
