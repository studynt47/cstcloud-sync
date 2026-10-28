import { Eye, EyeOff, createElement } from "lucide";
import {
  type App,
  Modal,
  Notice,
  Platform,
  PluginSettingTab,
  Setting,
  type TextComponent,
  requireApiVersion,
} from "obsidian";
import type {
  CipherMethodType,
  ConflictActionType,
  EmptyFolderCleanType,
  SUPPORTED_SERVICES_TYPE,
  SyncDirectionType,
} from "./baseTypes";

import cloneDeep from "lodash/cloneDeep";
import { API_VER_ENSURE_REQURL_OK, VALID_REQURL } from "./baseTypesObs";
import { getClient } from "./fsGetter";
import type { TransItemType } from "./i18n";
import { destroyDBs } from "./localdb";
import type RemotelySavePlugin from "./main"; // unavoidable
import { stringToFragment } from "./misc";

class SyncConfigDirModal extends Modal {
  plugin: RemotelySavePlugin;
  saveDropdownFunc: () => void;
  constructor(
    app: App,
    plugin: RemotelySavePlugin,
    saveDropdownFunc: () => void
  ) {
    super(app);
    this.plugin = plugin;
    this.saveDropdownFunc = saveDropdownFunc;
  }

  async onOpen() {
    const { contentEl } = this;

    const t = (x: TransItemType, vars?: any) => {
      return this.plugin.i18n.t(x, vars);
    };

    t("modal_syncconfig_attn")
      .split("\n")
      .forEach((val) => {
        contentEl.createEl("p", {
          text: val,
        });
      });

    new Setting(contentEl)
      .addButton((button) => {
        button.setButtonText(t("modal_syncconfig_secondconfirm"));
        button.onClick(async () => {
          this.plugin.settings.syncConfigDir = true;
          await this.plugin.saveSettings();
          this.saveDropdownFunc();
          new Notice(t("modal_syncconfig_notice"));
          this.close();
        });
      })
      .addButton((button) => {
        button.setButtonText(t("goback"));
        button.onClick(() => {
          this.close();
        });
      });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}

const getEyesElements = () => {
  const eyeEl = createElement(Eye);
  const eyeOffEl = createElement(EyeOff);
  return {
    eye: eyeEl.outerHTML,
    eyeOff: eyeOffEl.outerHTML,
  };
};

export const wrapTextWithPasswordHide = (text: TextComponent) => {
  const { eye, eyeOff } = getEyesElements();
  const hider = text.inputEl.insertAdjacentElement("afterend", createSpan())!;
  // the init type of hider is "hidden" === eyeOff === password
  hider.innerHTML = eyeOff;
  hider.addEventListener("click", (e) => {
    const isText = text.inputEl.getAttribute("type") === "text";
    hider.innerHTML = isText ? eyeOff : eye;
    text.inputEl.setAttribute("type", isText ? "password" : "text");
    text.inputEl.focus();
  });

  // the init type of text el is password
  text.inputEl.setAttribute("type", "password");
  return text;
};

export class RemotelySaveSettingTab extends PluginSettingTab {
  readonly plugin: RemotelySavePlugin;

  constructor(app: App, plugin: RemotelySavePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.style.setProperty("overflow-wrap", "break-word");

    containerEl.empty();

    const t = (x: TransItemType, vars?: any) => {
      return this.plugin.i18n.t(x, vars);
    };

    containerEl.createEl("h1", { text: "cstcloud-sync" });

    //////////////////////////////////////////////////
    // below for s3
    //////////////////////////////////////////////////

    const s3Div = containerEl.createEl("div", { cls: "s3-hide" });
    s3Div.toggleClass("s3-hide", this.plugin.settings.serviceType !== "s3");
    s3Div.createEl("h2", { text: t("settings_s3") });

    const s3LongDescDiv = s3Div.createEl("div", { cls: "settings-long-desc" });

    for (const c of [
      t("settings_s3_disclaimer1"),
      t("settings_s3_disclaimer2"),
    ]) {
      s3LongDescDiv.createEl("p", {
        text: c,
        cls: "s3-disclaimer",
      });
    }

    if (!VALID_REQURL) {
      s3LongDescDiv.createEl("p", {
        text: t("settings_s3_cors"),
      });
    }

    s3LongDescDiv.createEl("p", {
      text: t("settings_s3_prod"),
    });

    const s3LinksUl = s3LongDescDiv.createEl("ul");

    s3LinksUl.createEl("li").createEl("a", {
      href: "https://docs.aws.amazon.com/general/latest/gr/s3.html",
      text: t("settings_s3_prod1"),
    });

    s3LinksUl.createEl("li").createEl("a", {
      href: "https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-your-credentials.html",
      text: t("settings_s3_prod2"),
    });

    if (!VALID_REQURL) {
      s3LinksUl.createEl("li").createEl("a", {
        href: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/enabling-cors-examples.html",
        text: t("settings_s3_prod3"),
      });
    }

    new Setting(s3Div)
      .setName(t("settings_s3_accesskeyid"))
      .setDesc(t("settings_s3_accesskeyid_desc"))
      .addText((text) => {
        wrapTextWithPasswordHide(text);
        text
          .setPlaceholder("")
          .setValue(`${this.plugin.settings.s3.s3AccessKeyID}`)
          .onChange(async (value) => {
            this.plugin.settings.s3.s3AccessKeyID = value.trim();
            await this.plugin.saveSettings();
          });
      });

    new Setting(s3Div)
      .setName(t("settings_s3_secretaccesskey"))
      .setDesc(t("settings_s3_secretaccesskey_desc"))
      .addText((text) => {
        wrapTextWithPasswordHide(text);
        text
          .setPlaceholder("")
          .setValue(`${this.plugin.settings.s3.s3SecretAccessKey}`)
          .onChange(async (value) => {
            this.plugin.settings.s3.s3SecretAccessKey = value.trim();
            await this.plugin.saveSettings();
          });
      });

    new Setting(s3Div)
      .setName(t("settings_s3_bucketname"))
      .setDesc(t("settings_s3_bucketname"))
      .addText((text) =>
        text
          .setPlaceholder("")
          .setValue(`${this.plugin.settings.s3.s3BucketName}`)
          .onChange(async (value) => {
            this.plugin.settings.s3.s3BucketName = value.trim();
            await this.plugin.saveSettings();
          })
      );

    // cstcloud-sync: forcePathStyle hardcoded to true (Step 42, P2-4)
    // No UI for forcePathStyle anymore.
    if (VALID_REQURL && !requireApiVersion(API_VER_ENSURE_REQURL_OK)) {
      new Setting(s3Div)
        .setName(t("settings_s3_bypasscorslocally"))
        .setDesc(t("settings_s3_bypasscorslocally_desc"))
        .addDropdown((dropdown) => {
          dropdown
            .addOption("disable", t("disable"))
            .addOption("enable", t("enable"));

          dropdown
            .setValue(
              `${
                this.plugin.settings.s3.bypassCorsLocally ? "enable" : "disable"
              }`
            )
            .onChange(async (value) => {
              if (value === "enable") {
                this.plugin.settings.s3.bypassCorsLocally = true;
              } else {
                this.plugin.settings.s3.bypassCorsLocally = false;
              }
              await this.plugin.saveSettings();
            });
        });
    }

    new Setting(s3Div)
      .setName(t("settings_s3_parts"))
      .setDesc(t("settings_s3_parts_desc"))
      .addDropdown((dropdown) => {
        dropdown.addOption("1", "1");
        dropdown.addOption("2", "2");
        dropdown.addOption("3", "3");
        dropdown.addOption("5", "5");
        dropdown.addOption("10", "10");
        dropdown.addOption("15", "15");
        dropdown.addOption("20", "20 (default)");

        dropdown
          .setValue(`${this.plugin.settings.s3.partsConcurrency}`)
          .onChange(async (val) => {
            const realVal = Number.parseInt(val);
            this.plugin.settings.s3.partsConcurrency = realVal;
            await this.plugin.saveSettings();
          });
      });

    new Setting(s3Div)
      .setName(t("settings_checkonnectivity"))
      .setDesc(t("settings_checkonnectivity_desc"))
      .addButton(async (button) => {
        button.setButtonText(t("settings_checkonnectivity_button"));
        button.onClick(async () => {
          new Notice(t("settings_checkonnectivity_checking"));
          const client = getClient(
            this.plugin.settings,
            this.app.vault.getName(),
            () => this.plugin.saveSettings()
          );
          const errors = { msg: "" };
          const res = await client.checkConnect((err: any) => {
            errors.msg = err;
          });
          if (res) {
            new Notice(t("settings_s3_connect_succ"));
          } else {
            new Notice(t("settings_s3_connect_fail"));
            new Notice(errors.msg);
          }
        });
      });
    const basicDiv = containerEl.createEl("div");
    basicDiv.createEl("h2", { text: t("settings_basic") });

    new Setting(basicDiv)
      .setName(t("settings_autorun"))
      .setDesc(t("settings_autorun_desc"))
      .addDropdown((dropdown) => {
        dropdown.addOption("-1", t("settings_autorun_notset"));
        dropdown.addOption(`${1000 * 60 * 1}`, t("settings_autorun_1min"));
        dropdown.addOption(`${1000 * 60 * 5}`, t("settings_autorun_5min"));
        dropdown.addOption(`${1000 * 60 * 10}`, t("settings_autorun_10min"));
        dropdown.addOption(`${1000 * 60 * 30}`, t("settings_autorun_30min"));

        dropdown
          .setValue(`${this.plugin.settings.autoRunEveryMilliseconds}`)
          .onChange(async (val: string) => {
            const realVal = Number.parseInt(val);
            this.plugin.settings.autoRunEveryMilliseconds = realVal;
            await this.plugin.saveSettings();
            if (
              (realVal === undefined || realVal === null || realVal <= 0) &&
              this.plugin.autoRunIntervalID !== undefined
            ) {
              // clear
              window.clearInterval(this.plugin.autoRunIntervalID);
              this.plugin.autoRunIntervalID = undefined;
            } else if (
              realVal !== undefined &&
              realVal !== null &&
              realVal > 0
            ) {
              const intervalID = window.setInterval(() => {
                console.info("auto run from settings.ts");
                this.plugin.syncRun("auto");
              }, realVal);
              this.plugin.autoRunIntervalID = intervalID;
              this.plugin.registerInterval(intervalID);
            }
          });
      });

    new Setting(basicDiv)
      .setName(t("settings_runoncestartup"))
      .setDesc(t("settings_runoncestartup_desc"))
      .addDropdown((dropdown) => {
        dropdown.addOption("-1", t("settings_runoncestartup_notset"));
        dropdown.addOption(
          `${1000 * 1 * 1}`,
          t("settings_runoncestartup_1sec")
        );
        dropdown.addOption(
          `${1000 * 10 * 1}`,
          t("settings_runoncestartup_10sec")
        );
        dropdown.addOption(
          `${1000 * 30 * 1}`,
          t("settings_runoncestartup_30sec")
        );
        dropdown
          .setValue(`${this.plugin.settings.initRunAfterMilliseconds}`)
          .onChange(async (val: string) => {
            const realVal = Number.parseInt(val);
            this.plugin.settings.initRunAfterMilliseconds = realVal;
            await this.plugin.saveSettings();
          });
      });

    new Setting(basicDiv)
      .setName(t("settings_skiplargefiles"))
      .setDesc(t("settings_skiplargefiles_desc"))
      .addDropdown((dropdown) => {
        dropdown.addOption("-1", t("settings_skiplargefiles_notset"));

        const mbs = [1, 5, 10, 20, 50, 100, 200, 500, 1000];
        for (const mb of mbs) {
          dropdown.addOption(`${mb * 1000 * 1000}`, `${mb} MB`);
        }
        dropdown
          .setValue(`${this.plugin.settings.skipSizeLargerThan}`)
          .onChange(async (val) => {
            this.plugin.settings.skipSizeLargerThan = Number.parseInt(val);
            await this.plugin.saveSettings();
          });
      });

    // custom status bar items is not supported on mobile
    if (!Platform.isMobileApp) {
      new Setting(basicDiv)
        .setName(t("settings_enablestatusbar_info"))
        .setDesc(t("settings_enablestatusbar_info_desc"))
        .addToggle((toggle) => {
          toggle
            .setValue(this.plugin.settings.enableStatusBarInfo ?? false)
            .onChange(async (val) => {
              this.plugin.settings.enableStatusBarInfo = val;
              await this.plugin.saveSettings();
              new Notice(t("settings_enablestatusbar_reloadrequired_notice"));
            });
        });
    }

    //////////////////////////////////////////////////
    // below for advanced settings
    //////////////////////////////////////////////////
    const advDiv = containerEl.createEl("div");
    advDiv.createEl("h2", {
      text: t("settings_adv"),
    });

    new Setting(advDiv)
      .setName(t("settings_concurrency"))
      .setDesc(t("settings_concurrency_desc"))
      .addDropdown((dropdown) => {
        dropdown.addOption("1", "1");
        dropdown.addOption("2", "2");
        dropdown.addOption("3", "3");
        dropdown.addOption("5", "5 (default)");
        dropdown.addOption("10", "10");
        dropdown.addOption("15", "15");
        dropdown.addOption("20", "20");

        dropdown
          .setValue(`${this.plugin.settings.concurrency}`)
          .onChange(async (val) => {
            const realVal = Number.parseInt(val);
            this.plugin.settings.concurrency = realVal;
            await this.plugin.saveSettings();
          });
      });

    new Setting(advDiv)
      .setName(t("settings_syncunderscore"))
      .setDesc(t("settings_syncunderscore_desc"))
      .addDropdown((dropdown) => {
        dropdown.addOption("disable", t("disable"));
        dropdown.addOption("enable", t("enable"));
        dropdown
          .setValue(
            `${this.plugin.settings.syncUnderscoreItems ? "enable" : "disable"}`
          )
          .onChange(async (val) => {
            this.plugin.settings.syncUnderscoreItems = val === "enable";
            await this.plugin.saveSettings();
          });
      });

    new Setting(advDiv)
      .setName(t("settings_configdir"))
      .setDesc(
        t("settings_configdir_desc", {
          configDir: this.app.vault.configDir,
        })
      )
      .addDropdown((dropdown) => {
        dropdown.addOption("disable", t("disable"));
        dropdown.addOption("enable", t("enable"));

        const bridge = {
          secondConfirm: false,
        };
        dropdown
          .setValue(
            `${this.plugin.settings.syncConfigDir ? "enable" : "disable"}`
          )
          .onChange(async (val) => {
            if (val === "enable" && !bridge.secondConfirm) {
              dropdown.setValue("disable");
              new SyncConfigDirModal(this.app, this.plugin, () => {
                bridge.secondConfirm = true;
                dropdown.setValue("enable");
              }).open();
            } else {
              bridge.secondConfirm = false;
              this.plugin.settings.syncConfigDir = false;
              await this.plugin.saveSettings();
            }
          });
      });

    new Setting(advDiv)
      .setName(t("settings_bookmarks"))
      .setDesc(
        t("settings_bookmarks_desc", {
          configDir: this.app.vault.configDir,
        })
      )
      .addDropdown((dropdown) => {
        dropdown.addOption("disable", t("disable"));
        dropdown.addOption("enable", t("enable"));

        dropdown
          .setValue(
            `${this.plugin.settings.syncBookmarks ? "enable" : "disable"}`
          )
          .onChange(async (val) => {
            this.plugin.settings.syncBookmarks = val === "enable";
            await this.plugin.saveSettings();
          });
      });

    new Setting(advDiv)
      .setName(t("settings_deletetowhere"))
      .setDesc(t("settings_deletetowhere_desc"))
      .addDropdown((dropdown) => {
        dropdown.addOption("system", t("settings_deletetowhere_system_trash"));
        dropdown.addOption(
          "obsidian",
          t("settings_deletetowhere_obsidian_trash")
        );
        dropdown
          .setValue(this.plugin.settings.deleteToWhere ?? "system")
          .onChange(async (val) => {
            this.plugin.settings.deleteToWhere = val as "system" | "obsidian";
            await this.plugin.saveSettings();
          });
      });

    const conflictActionSettingOrigDesc = t("settings_conflictaction_desc");
    // cstcloud-sync: smart_conflict option removed (PRO feature).
    // Fall back to keep_newer if old data has smart_conflict.
    if (
      (this.plugin.settings.conflictAction ?? "keep_newer") === "smart_conflict"
    ) {
      this.plugin.settings.conflictAction = "keep_newer";
    }
    const conflictActionSetting = new Setting(advDiv)
      .setName(t("settings_conflictaction"))
      .setDesc(stringToFragment(conflictActionSettingOrigDesc));
    conflictActionSetting.addDropdown((dropdown) => {
      dropdown
        .addOption("keep_newer", t("settings_conflictaction_keep_newer"))
        .addOption("keep_larger", t("settings_conflictaction_keep_larger"))
        .setValue(this.plugin.settings.conflictAction ?? "keep_newer")
        .onChange(async (val) => {
          // cstcloud-sync: silently coerce smart_conflict -> keep_newer
          const v = (val === "smart_conflict" ? "keep_newer" : val) as
            | "keep_newer"
            | "keep_larger";
          this.plugin.settings.conflictAction = v as ConflictActionType;
          await this.plugin.saveSettings();

          conflictActionSetting.setDesc(
            stringToFragment(t("settings_conflictaction_desc"))
          );
        });
    });

    const percentage1 = new Setting(advDiv)
      .setName(t("settings_protectmodifypercentage"))
      .setDesc(t("settings_protectmodifypercentage_desc"));

    const percentage2 = new Setting(advDiv)
      .setName(t("settings_protectmodifypercentage_customfield"))
      .setDesc(t("settings_protectmodifypercentage_customfield_desc"));
    if ((this.plugin.settings.protectModifyPercentage ?? 50) % 10 === 0) {
      percentage2.settingEl.addClass("settings-percentage-custom-hide");
    }
    let percentage2Text: TextComponent | undefined = undefined;
    percentage2.addText((text) => {
      text.inputEl.type = "number";
      percentage2Text = text;
      text
        .setPlaceholder("0 ~ 100")
        .setValue(`${this.plugin.settings.protectModifyPercentage ?? 50}`)
        .onChange(async (val) => {
          let k = Number.parseFloat(val.trim());
          if (Number.isNaN(k)) {
            // do nothing!
          } else {
            if (k < 0) {
              k = 0;
            } else if (k > 100) {
              k = 100;
            }
            this.plugin.settings.protectModifyPercentage = k;
            await this.plugin.saveSettings();
          }
        });
    });

    percentage1.addDropdown((dropdown) => {
      for (const i of Array.from({ length: 11 }, (x, i) => i * 10)) {
        let desc = `${i}`;
        if (i === 0) {
          desc = t("settings_protectmodifypercentage_000_desc");
        } else if (i === 50) {
          desc = t("settings_protectmodifypercentage_050_desc");
        } else if (i === 100) {
          desc = t("settings_protectmodifypercentage_100_desc");
        }
        dropdown.addOption(`${i}`, desc);
      }
      dropdown.addOption(
        "custom",
        t("settings_protectmodifypercentage_custom_desc")
      );

      const p = this.plugin.settings.protectModifyPercentage ?? 50;
      let initVal = "custom";
      if (p % 10 === 0) {
        initVal = `${p}`;
      } else {
        // show custom
        percentage2.settingEl.removeClass("settings-percentage-custom");
      }
      dropdown.setValue(initVal).onChange(async (val) => {
        const k = Number.parseInt(val);
        if (val === "custom" || Number.isNaN(k)) {
          // do nothing until user changes something in custom field
          percentage2.settingEl.removeClass("settings-percentage-custom-hide");
        } else {
          this.plugin.settings.protectModifyPercentage = k;
          percentage2.settingEl.addClass("settings-percentage-custom-hide");
          percentage2Text?.setValue(`${k}`);
          await this.plugin.saveSettings();
        }
      });
    });

    new Setting(advDiv)
      .setName(t("setting_syncdirection"))
      .setDesc(stringToFragment(t("setting_syncdirection_desc")))
      .addDropdown((dropdown) => {
        dropdown.addOption(
          "bidirectional",
          t("setting_syncdirection_bidirectional_desc")
        );
        dropdown.addOption(
          "incremental_push_only",
          t("setting_syncdirection_incremental_push_only_desc")
        );
        dropdown.addOption(
          "incremental_pull_only",
          t("setting_syncdirection_incremental_pull_only_desc")
        );
        dropdown.addOption(
          "incremental_push_and_delete_only",
          t("setting_syncdirection_incremental_push_and_delete_only_desc")
        );
        dropdown.addOption(
          "incremental_pull_and_delete_only",
          t("setting_syncdirection_incremental_pull_and_delete_only_desc")
        );

        dropdown
          .setValue(this.plugin.settings.syncDirection ?? "bidirectional")
          .onChange(async (val) => {
            this.plugin.settings.syncDirection = val as SyncDirectionType;
            await this.plugin.saveSettings();
          });
      });

    // cstcloud-sync: mobile status bar toggle removed (was PRO).

    //////////////////////////////////////////////////
    // below for pro
    //////////////////////////////////////////////////

    //////////////////////////////////////////////////
  }
  // end display()

  hide() {
    const { containerEl } = this;
    containerEl.empty();
    super.hide();
  }
}
