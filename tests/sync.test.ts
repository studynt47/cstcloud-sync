import { strict as assert } from "assert";
import {
  checkIsSkipItemOrNotByName,
  doActualSync,
  getSkipItemsByList,
  syncer,
} from "../src/sync";
import type {
  Entity,
  MixedEntity,
  RemotelySavePluginSettings,
  SyncTriggerSourceType,
} from "../src/baseTypes";
import {
  checkRemoteEncryption,
  copyEntityAndCopyKeyEncSizeEnc,
} from "../src/encryptedGuard";
import type { InternalDBs } from "../src/localdb";
import { InMemoryFs, bufferToStr, strToBuffer } from "./helpers/inMemoryFs";

/**
 * The Obsidian runtime injects a few browser-ish globals (`window.moment`,
 * `self`, ...) that the plugin sources use. The unit tests run in plain Node,
 * so we provide the minimal stubs that are needed here.
 *
 * Other test files of this repo overwrite `global.window` in their own
 * `beforeEach` hooks, therefore this function is called again in the
 * `before()` hook of every describe block that needs it.
 */
const setupBrowserShims = () => {
  if (!g.self) {
    g.self = g;
  }
  g.window = g;
  if (!g.addEventListener) {
    g.addEventListener = () => {};
  }
  if (!g.removeEventListener) {
    g.removeEventListener = () => {};
  }
  if (!g.postMessage) {
    g.postMessage = () => {};
  }
  if (!g.moment) {
    // `src/misc.ts` formats the timestamps with the `moment` object that
    // Obsidian injects into `window`. Here a minimal stub is enough.
    g.moment = (x: number) => ({
      toISOString: () => new Date(x).toISOString(),
      format: () => new Date(x).toISOString(),
    });
  }
};

const g: any = globalThis;

setupBrowserShims();

const CONFIG_DIR = ".obsidian";

/**
 * A minimal in-memory replacement of the localforage tables that the sync
 * core uses. Only the methods that `src/localdb.ts` needs are implemented.
 */
const makeFakeTable = () => {
  const store = new Map<string, any>();
  return {
    store,
    async getItem(key: string) {
      return store.has(key) ? store.get(key) : null;
    },
    async setItem(key: string, value: any) {
      store.set(key, value);
      return value;
    },
    async removeItem(key: string) {
      store.delete(key);
    },
    async removeItems(keys: string[]) {
      for (const k of keys) {
        store.delete(k);
      }
    },
    async keys() {
      return Array.from(store.keys());
    },
    async getItems() {
      const res: Record<string, any> = {};
      for (const [k, v] of store) {
        res[k] = v;
      }
      return res;
    },
    async clear() {
      store.clear();
    },
    async iterate(iteratee: (value: any, key: string, n: number) => void) {
      let n = 1;
      for (const [k, v] of store) {
        iteratee(v, k, n);
        n += 1;
      }
      return n;
    },
    async length() {
      return store.size;
    },
    async ready() {
      return true;
    },
  };
};

const makeFakeDb = (): InternalDBs => {
  const t = () => makeFakeTable() as any;
  return {
    versionTbl: t(),
    syncPlansTbl: t(),
    vaultRandomIDMappingTbl: t(),
    loggerOutputTbl: t(),
    simpleKVForMiscTbl: t(),
    prevSyncRecordsTbl: t(),
    fileContentHistoryTbl: t(),
    fileHistoryTbl: t(),
    syncMappingTbl: t(),
  } as unknown as InternalDBs;
};

const entityOf = (
  key: string,
  sizeRaw: number,
  mtimeCli?: number
): Entity => ({
  key,
  keyRaw: key,
  size: sizeRaw,
  sizeRaw,
  mtimeCli: mtimeCli ?? 1700000000000,
  ctimeCli: 1700000000000,
  mtimeSvr: mtimeCli ?? 1700000000000,
});

describe("Sync: checkIsSkipItemOrNotByName", () => {
  it("should throw when the key is undefined", () => {
    assert.throws(() => {
      (checkIsSkipItemOrNotByName as any)(
        undefined,
        false,
        false,
        false,
        CONFIG_DIR,
        [],
        []
      );
    }, /meets undefinded key/);
  });

  it("should not skip a normal file", () => {
    const res = checkIsSkipItemOrNotByName(
      "notes/a.md",
      false,
      false,
      false,
      CONFIG_DIR,
      [],
      []
    );
    assert.equal(res.finalIsIgnored, false);
    assert.equal(res.isExplictlyIgnored, false);
    assert.equal(res.enableAllowMode, false);
  });

  it("should skip the files matching the ignore list", () => {
    const res = checkIsSkipItemOrNotByName(
      "notes/draft/a.md",
      false,
      false,
      false,
      CONFIG_DIR,
      ["draft"],
      []
    );
    assert.equal(res.finalIsIgnored, true);
    assert.equal(res.isExplictlyIgnored, true);
  });

  it("should skip everything that is not in the allow list", () => {
    const res = checkIsSkipItemOrNotByName(
      "notes/a.md",
      false,
      false,
      false,
      CONFIG_DIR,
      [],
      ["^notes/"]
    );
    assert.equal(res.enableAllowMode, true);
    assert.equal(res.isExplictlyAllowed, true);
    assert.equal(res.finalIsIgnored, false);
  });

  it("should skip a file that is not in the allow list", () => {
    const res = checkIsSkipItemOrNotByName(
      "other/a.md",
      false,
      false,
      false,
      CONFIG_DIR,
      [],
      ["^notes/"]
    );
    assert.equal(res.enableAllowMode, true);
    assert.equal(res.isExplictlyAllowed, false);
    assert.equal(res.finalIsIgnored, true);
  });

  it("should ignore the empty lines of the ignore list", () => {
    const res = checkIsSkipItemOrNotByName(
      "notes/a.md",
      false,
      false,
      false,
      CONFIG_DIR,
      ["  ", ""],
      []
    );
    assert.equal(res.finalIsIgnored, false);
  });

  it("should sync the config dir when it is asked for", () => {
    const res = checkIsSkipItemOrNotByName(
      `${CONFIG_DIR}/app.json`,
      true,
      false,
      false,
      CONFIG_DIR,
      [],
      []
    );
    assert.equal(res.finalIsIgnored, false);
  });

  it("should skip the config dir when it is not asked for", () => {
    const res = checkIsSkipItemOrNotByName(
      `${CONFIG_DIR}/app.json`,
      false,
      false,
      false,
      CONFIG_DIR,
      [],
      []
    );
    assert.equal(res.finalIsIgnored, true);
    // the config-dir rule is a "final ignore", but it is not an *explicit*
    // ignore (that flag is only raised by the user provided ignore list)
    assert.equal(res.isExplictlyIgnored, false);
  });

  it("should sync the bookmarks file but skip the rest of the config dir", () => {
    const res1 = checkIsSkipItemOrNotByName(
      `${CONFIG_DIR}/bookmarks.json`,
      false,
      true,
      false,
      CONFIG_DIR,
      [],
      []
    );
    assert.equal(res1.finalIsIgnored, false);

    const res2 = checkIsSkipItemOrNotByName(
      `${CONFIG_DIR}/app.json`,
      false,
      true,
      false,
      CONFIG_DIR,
      [],
      []
    );
    assert.equal(res2.finalIsIgnored, true);
  });

  it("should skip the hidden files", () => {
    const res = checkIsSkipItemOrNotByName(
      "notes/.hidden.md",
      false,
      false,
      false,
      CONFIG_DIR,
      [],
      []
    );
    assert.equal(res.finalIsIgnored, true);
  });

  it("should skip the underscore items unless they are asked for", () => {
    const res1 = checkIsSkipItemOrNotByName(
      "notes/_private/a.md",
      false,
      false,
      false,
      CONFIG_DIR,
      [],
      []
    );
    assert.equal(res1.finalIsIgnored, true);

    const res2 = checkIsSkipItemOrNotByName(
      "notes/_private/a.md",
      false,
      false,
      true,
      CONFIG_DIR,
      [],
      []
    );
    assert.equal(res2.finalIsIgnored, false);
  });

  it("should always skip the special folders", () => {
    for (const k of [".git/", "node_modules/", "a/.git/", "thumbs.db"]) {
      const res = checkIsSkipItemOrNotByName(
        k,
        false,
        false,
        false,
        CONFIG_DIR,
        [],
        []
      );
      assert.equal(res.finalIsIgnored, true, `${k} should be skipped`);
    }
  });
});

describe("Sync: getSkipItemsByList", () => {
  it("should apply an explicit ignore to the children", () => {
    const results = checkIsSkipItemOrNotByName(
      "draft/",
      false,
      false,
      false,
      CONFIG_DIR,
      ["^draft/"],
      []
    );
    const results2 = checkIsSkipItemOrNotByName(
      "draft/a.md",
      false,
      false,
      false,
      CONFIG_DIR,
      ["^draft/"],
      []
    );
    const list = getSkipItemsByList({
      "draft/": results,
      "draft/a.md": results2,
    });
    assert.ok(list.includes("draft/"));
    assert.ok(list.includes("draft/a.md"));
  });

  it("should apply the explicit ignore of a parent to a child", () => {
    const parent = checkIsSkipItemOrNotByName(
      "secret/",
      false,
      false,
      false,
      CONFIG_DIR,
      ["^secret/"],
      []
    );
    const child = checkIsSkipItemOrNotByName(
      "secret/a.md",
      false,
      false,
      false,
      CONFIG_DIR,
      [],
      []
    );
    const list = getSkipItemsByList({
      "secret/": parent,
      "secret/a.md": child,
    });
    assert.ok(list.includes("secret/"));
    assert.ok(list.includes("secret/a.md"));
  });

  it("should allow the parents of an explicitly allowed file", () => {
    const parent = checkIsSkipItemOrNotByName(
      "notes/",
      false,
      false,
      false,
      CONFIG_DIR,
      [],
      ["^notes/a\\.md$"]
    );
    const child = checkIsSkipItemOrNotByName(
      "notes/a.md",
      false,
      false,
      false,
      CONFIG_DIR,
      [],
      ["^notes/a\\.md$"]
    );
    const list = getSkipItemsByList({
      "notes/": parent,
      "notes/a.md": child,
    });
    assert.ok(!list.includes("notes/"), "the parent should be allowed too");
    assert.ok(!list.includes("notes/a.md"));
  });
});

describe("Sync: doActualSync", () => {
  before(() => {
    setupBrowserShims();
  });

  const V = "vault1";
  const P = "profile1";

  it("should push a locally created file to the remote", async () => {
    const local = new InMemoryFs("local");
    const remote = new InMemoryFs("remote");
    await local.writeFile("a.md", strToBuffer("hello"), 1000, 1000);
    const db = makeFakeDb();

    const mappings: Record<string, MixedEntity> = {
      "a.md": {
        key: "a.md",
        local: entityOf("a.md", 5, 1000),
        decision: "local_is_created_then_push",
      },
    };

    await doActualSync(
      mappings,
      local,
      remote,
      V,
      P,
      2,
      -1,
      () => "should not be reached",
      db,
      "keep_newer",
      "manual",
      undefined
    );

    assert.equal(bufferToStr(await remote.readFile("a.md")), "hello");
    // the prev sync record must have been written
    const keys = await db.prevSyncRecordsTbl.keys();
    assert.ok(keys.includes(`${V}\t${P}\ta.md`));
  });

  it("should pull a remotely created file to the local", async () => {
    const local = new InMemoryFs("local");
    const remote = new InMemoryFs("remote");
    await remote.writeFile("b.md", strToBuffer("world"), 2000, 2000);
    const db = makeFakeDb();

    const mappings: Record<string, MixedEntity> = {
      "b.md": {
        key: "b.md",
        remote: entityOf("b.md", 5, 2000),
        decision: "remote_is_created_then_pull",
      },
    };

    await doActualSync(
      mappings,
      local,
      remote,
      V,
      P,
      2,
      -1,
      () => "should not be reached",
      db,
      "keep_newer",
      "manual",
      undefined
    );

    assert.equal(bufferToStr(await local.readFile("b.md")), "world");
  });

  it("should create a folder on the remote", async () => {
    const local = new InMemoryFs("local");
    const remote = new InMemoryFs("remote");
    await local.mkdir("folder/", 3000, 3000);
    const db = makeFakeDb();

    const mappings: Record<string, MixedEntity> = {
      "folder/": {
        key: "folder/",
        local: entityOf("folder/", 0, 3000),
        decision: "folder_to_be_created",
      },
    };

    await doActualSync(
      mappings,
      local,
      remote,
      V,
      P,
      2,
      -1,
      () => "should not be reached",
      db,
      "keep_newer",
      "manual",
      undefined
    );

    assert.ok(remote.folders.has("folder/"));
  });

  it("should delete the remote file when the local one was deleted", async () => {
    const local = new InMemoryFs("local");
    const remote = new InMemoryFs("remote");
    await remote.writeFile("c.md", strToBuffer("bye"), 4000, 4000);
    const db = makeFakeDb();

    const mappings: Record<string, MixedEntity> = {
      "c.md": {
        key: "c.md",
        remote: entityOf("c.md", 3, 4000),
        decision: "local_is_deleted_thus_also_delete_remote",
      },
    };

    await doActualSync(
      mappings,
      local,
      remote,
      V,
      P,
      2,
      -1,
      () => "should not be reached",
      db,
      "keep_newer",
      "manual",
      undefined
    );

    assert.ok(!remote.files.has("c.md"));
  });

  it("should delete the local file when the remote one was deleted", async () => {
    const local = new InMemoryFs("local");
    const remote = new InMemoryFs("remote");
    await local.writeFile("d.md", strToBuffer("gone"), 5000, 5000);
    const db = makeFakeDb();

    const mappings: Record<string, MixedEntity> = {
      "d.md": {
        key: "d.md",
        local: entityOf("d.md", 4, 5000),
        decision: "remote_is_deleted_thus_also_delete_local",
      },
    };

    await doActualSync(
      mappings,
      local,
      remote,
      V,
      P,
      2,
      -1,
      () => "should not be reached",
      db,
      "keep_newer",
      "manual",
      undefined
    );

    assert.ok(!local.files.has("d.md"));
  });

  it("should abort when the protect percentage is exceeded", async () => {
    const local = new InMemoryFs("local");
    const remote = new InMemoryFs("remote");
    const db = makeFakeDb();

    const mappings: Record<string, MixedEntity> = {
      "e.md": {
        key: "e.md",
        local: entityOf("e.md", 4, 5000),
        decision: "local_is_modified_then_push",
      },
    };

    await assert.rejects(async () => {
      await doActualSync(
        mappings,
        local,
        remote,
        V,
        P,
        2,
        10,
        (p: number, modified: number, total: number) =>
          `protected: ${p} ${modified}/${total}`,
        db,
        "keep_newer",
        "manual",
        undefined
      );
    }, /protected: 10/);
  });

  it("should throw on an unknown decision", async () => {
    const local = new InMemoryFs("local");
    const remote = new InMemoryFs("remote");
    const db = makeFakeDb();

    const mappings: Record<string, MixedEntity> = {
      "f.md": {
        key: "f.md",
        decision: "what_is_this" as any,
      },
    };

    await assert.rejects(async () => {
      await doActualSync(
        mappings,
        local,
        remote,
        V,
        P,
        2,
        -1,
        () => "should not be reached",
        db,
        "keep_newer",
        "manual",
        undefined
      );
    }, /unknown decision what_is_this/);
  });
});

describe("Sync: encryption equivalence (PRD v1.3 5.1.C)", () => {
  before(() => {
    setupBrowserShims();
  });

  it("should report keyEnc === keyRaw and sizeEnc === sizeRaw without a password", async () => {
    const remote = new InMemoryFs("remote");
    await remote.writeFile("a.md", strToBuffer("hello"), 1000, 1000);
    await remote.mkdir("folder/", 1000, 1000);

    // this is exactly what `src/sync.ts` does with the remote entity list
    const entities = (await remote.walk()).map((e) =>
      copyEntityAndCopyKeyEncSizeEnc(e)
    );

    assert.ok(entities.length >= 2);
    for (const e of entities) {
      assert.equal(e.keyEnc, e.keyRaw, "keyEnc should be equal to keyRaw");
      assert.equal(e.sizeEnc, e.sizeRaw, "sizeEnc should be equal to sizeRaw");
    }
  });

  it("should encryptEntity() behave exactly like the plain entity when there is no password", async () => {
    const input = entityOf("a.md", 42, 1000);
    const res = copyEntityAndCopyKeyEncSizeEnc(input);

    assert.equal(res.keyEnc, res.key);
    assert.equal(res.sizeEnc, res.sizeRaw);
    assert.equal(res.key, "a.md");
  });

  it("should accept an empty remote", async () => {
    const remote = new InMemoryFs("remote");

    const res = checkRemoteEncryption(await remote.walk());
    assert.equal(res.ok, true);
    assert.equal(res.reason, "empty_remote");
  });

  it("should detect a remote that is encrypted while the local has no password", async () => {
    const remote = new InMemoryFs("remote");
    // the openssl magic prefix
    await remote.writeFile("U2FsdGVkX1abcdef", strToBuffer("x"), 1000, 1000);

    const res = checkRemoteEncryption(await remote.walk());
    assert.equal(res.ok, false);
    assert.equal(res.reason, "remote_encrypted_local_no_password");
  });
});

describe("Sync: syncer (the whole engine, with mocked fs and db)", () => {
  before(() => {
    setupBrowserShims();
  });

  const V = "vault1";
  const P = "profile1";
  const CONFIG_DIR = ".obsidian";

  const baseSettings = (
    extra: Partial<RemotelySavePluginSettings> = {}
  ): RemotelySavePluginSettings =>
    ({
      s3: {
        s3Endpoint: "https://s3.cstcloud.cn",
        s3Region: "us-east-1",
        s3AccessKeyID: "",
        s3SecretAccessKey: "",
        s3BucketName: "",
      },
      serviceType: "s3",
      concurrency: 2,
      protectModifyPercentage: -1,
      conflictAction: "keep_newer",
      syncDirection: "bidirectional",
      ...extra,
    }) as RemotelySavePluginSettings;

  const runSyncer = async (
    opts: {
      local: InMemoryFs;
      remote: InMemoryFs;
      db?: InternalDBs;
      settings?: RemotelySavePluginSettings;
      triggerSource?: SyncTriggerSourceType;
    }
  ) => {
    const db = opts.db ?? makeFakeDb();
    const marks: boolean[] = [];
    const errors: Error[] = [];
    const steps: number[] = [];
    await syncer(
      opts.local,
      opts.remote,
      db,
      opts.triggerSource ?? "manual",
      P,
      V,
      CONFIG_DIR,
      opts.settings ?? baseSettings(),
      "0.0.2",
      async () => {},
      () => "protected",
      (isSyncing: boolean) => {
        marks.push(isSyncing);
      },
      async (_s: any, step: number) => {
        steps.push(step);
      },
      async (_s: any, err: Error) => {
        errors.push(err);
      },
      undefined,
      undefined,
      undefined
    );
    return { db, marks, errors, steps };
  };

  it("should push a locally created file to the remote", async () => {
    const local = new InMemoryFs("local");
    const remote = new InMemoryFs("remote");
    await local.writeFile("a.md", strToBuffer("hello"), 1000, 1000);

    const { db, errors } = await runSyncer({ local, remote });

    assert.equal(errors.length, 0, `unexpected error: ${errors[0]?.message}`);
    assert.ok(remote.files.has("a.md"));
    assert.equal(bufferToStr(await remote.readFile("a.md")), "hello");

    // PRD v1.3 §5.1.C ①: the stored "prev sync" record must still carry the
    // `keyEnc` / `sizeEnc` mirror fields
    const prevSync = (await db.prevSyncRecordsTbl.getItems())[
      `${V}\t${P}\ta.md`
    ];
    assert.ok(prevSync !== undefined && prevSync !== null);
    assert.equal(prevSync.keyEnc, prevSync.keyRaw);
    assert.equal(prevSync.sizeEnc, prevSync.sizeRaw);
  });

  it("should pull a remotely created file to the local", async () => {
    const local = new InMemoryFs("local");
    const remote = new InMemoryFs("remote");
    await remote.writeFile("b.md", strToBuffer("world"), 2000, 2000);

    const { errors } = await runSyncer({ local, remote });

    assert.equal(errors.length, 0, `unexpected error: ${errors[0]?.message}`);
    assert.ok(local.files.has("b.md"));
    assert.equal(bufferToStr(await local.readFile("b.md")), "world");
  });

  it("should not write anything when both sides are equal", async () => {
    const local = new InMemoryFs("local");
    const remote = new InMemoryFs("remote");
    await local.writeFile("c.md", strToBuffer("same"), 1000, 1000);
    await remote.writeFile("c.md", strToBuffer("same"), 1000, 1000);
    local.ops.length = 0;
    remote.ops.length = 0;

    const { errors } = await runSyncer({ local, remote });

    assert.equal(errors.length, 0, `unexpected error: ${errors[0]?.message}`);
    assert.equal(local.ops.length, 0, "the local side should not be written");
    assert.equal(remote.ops.length, 0, "the remote side should not be written");
  });

  it("should not touch anything in a dry run", async () => {
    const local = new InMemoryFs("local");
    const remote = new InMemoryFs("remote");
    await local.writeFile("d.md", strToBuffer("hello"), 1000, 1000);

    const { errors } = await runSyncer({
      local,
      remote,
      triggerSource: "dry",
    });

    assert.equal(errors.length, 0, `unexpected error: ${errors[0]?.message}`);
    assert.ok(!remote.files.has("d.md"), "a dry run must not upload anything");
  });

  it("should not pull the remote changes in push-only mode", async () => {
    const local = new InMemoryFs("local");
    const remote = new InMemoryFs("remote");
    await remote.writeFile("e.md", strToBuffer("world"), 2000, 2000);

    const { errors } = await runSyncer({
      local,
      remote,
      settings: baseSettings({ syncDirection: "incremental_push_only" }),
    });

    assert.equal(errors.length, 0, `unexpected error: ${errors[0]?.message}`);
    assert.ok(!local.files.has("e.md"), "push-only must not download anything");
  });

  it("should skip the files that are larger than the size limit", async () => {
    const local = new InMemoryFs("local");
    const remote = new InMemoryFs("remote");
    await local.writeFile("big.md", strToBuffer("0123456789"), 1000, 1000);

    const { errors } = await runSyncer({
      local,
      remote,
      settings: baseSettings({ skipSizeLargerThan: 5 }),
    });

    assert.equal(errors.length, 0, `unexpected error: ${errors[0]?.message}`);
    assert.ok(!remote.files.has("big.md"), "too large files must be skipped");
  });

  it("should mark the sync as running and then as finished", async () => {
    const local = new InMemoryFs("local");
    const remote = new InMemoryFs("remote");
    await local.writeFile("f.md", strToBuffer("hello"), 1000, 1000);

    const { marks, steps } = await runSyncer({ local, remote });

    assert.deepEqual(marks, [true, false]);
    assert.ok(steps.includes(1) && steps.includes(8));
  });

  it("should report the error and still finish when the sync fails", async () => {
    const local = new InMemoryFs("local");
    const remote = new InMemoryFs("remote");
    local.walk = async () => {
      throw Error("boom");
    };

    const { errors, marks } = await runSyncer({ local, remote });

    assert.equal(errors.length, 1);
    assert.equal(errors[0].message, "boom");
    assert.deepEqual(marks, [true, false]);
  });

  it("should record the sync plan in the db", async () => {
    const local = new InMemoryFs("local");
    const remote = new InMemoryFs("remote");
    await local.writeFile("g.md", strToBuffer("hello"), 1000, 1000);

    const { db } = await runSyncer({ local, remote });

    const planKeys = await db.syncPlansTbl.keys();
    assert.ok(planKeys.length >= 1, "the sync plan should be recorded");
  });
});

describe("Sync: syncer delta scenarios (modified / deleted / conflict)", () => {
  const V = "vault1";
  const P = "profile1";
  const CONFIG_DIR = ".obsidian";
  const T0 = 1700000000000;

  const settings = (
    extra: Partial<RemotelySavePluginSettings> = {}
  ): RemotelySavePluginSettings =>
    ({
      s3: {
        s3Endpoint: "https://s3.cstcloud.cn",
        s3Region: "us-east-1",
        s3AccessKeyID: "",
        s3SecretAccessKey: "",
        s3BucketName: "",
      },
      serviceType: "s3",
      concurrency: 2,
      protectModifyPercentage: -1,
      conflictAction: "keep_newer",
      syncDirection: "bidirectional",
      ...extra,
    }) as RemotelySavePluginSettings;

  const seedPrevSync = async (
    db: InternalDBs,
    key: string,
    size: number,
    mtime: number
  ) => {
    await db.prevSyncRecordsTbl.setItem(`${V}\t${P}\t${key}`, {
      key,
      keyRaw: key,
      size,
      sizeEnc: size,
      sizeRaw: size,
      mtimeCli: mtime,
      mtimeSvr: mtime,
    });
  };

  const run = async (
    local: InMemoryFs,
    remote: InMemoryFs,
    db: InternalDBs,
    opts: Partial<RemotelySavePluginSettings> = {}
  ) => {
    const errors: Error[] = [];
    await syncer(
      local,
      remote,
      db,
      "manual",
      P,
      V,
      CONFIG_DIR,
      settings(opts),
      "0.0.2",
      async () => {},
      () => "protected",
      () => {},
      async () => {},
      async (_s: any, err: Error) => {
        errors.push(err);
      },
      undefined,
      undefined,
      undefined
    );
    return errors;
  };

  it("should push the local modification", async () => {
    const db = makeFakeDb();
    await seedPrevSync(db, "a.md", 5, T0);
    const local = new InMemoryFs("local");
    const remote = new InMemoryFs("remote");
    await local.writeFile("a.md", strToBuffer("hello!"), T0 + 1000, T0);
    await remote.writeFile("a.md", strToBuffer("hello"), T0, T0);

    const errors = await run(local, remote, db);

    assert.equal(errors.length, 0, `unexpected error: ${errors[0]?.message}`);
    assert.equal(bufferToStr(await remote.readFile("a.md")), "hello!");
  });

  it("should pull the remote modification", async () => {
    const db = makeFakeDb();
    await seedPrevSync(db, "b.md", 5, T0);
    const local = new InMemoryFs("local");
    const remote = new InMemoryFs("remote");
    await local.writeFile("b.md", strToBuffer("hello"), T0, T0);
    await remote.writeFile("b.md", strToBuffer("hello!!"), T0 + 2000, T0);

    const errors = await run(local, remote, db);

    assert.equal(errors.length, 0, `unexpected error: ${errors[0]?.message}`);
    assert.equal(bufferToStr(await local.readFile("b.md")), "hello!!");
  });

  it("should keep the local side when it is the newer one (keep_newer)", async () => {
    const db = makeFakeDb();
    await seedPrevSync(db, "c.md", 5, T0);
    const local = new InMemoryFs("local");
    const remote = new InMemoryFs("remote");
    await local.writeFile("c.md", strToBuffer("local!"), T0 + 3000, T0);
    await remote.writeFile("c.md", strToBuffer("remote!"), T0 + 2000, T0);

    const errors = await run(local, remote, db);

    assert.equal(errors.length, 0, `unexpected error: ${errors[0]?.message}`);
    assert.equal(bufferToStr(await remote.readFile("c.md")), "local!");
  });

  it("should keep the remote side when it is the newer one (keep_newer)", async () => {
    const db = makeFakeDb();
    await seedPrevSync(db, "d.md", 5, T0);
    const local = new InMemoryFs("local");
    const remote = new InMemoryFs("remote");
    await local.writeFile("d.md", strToBuffer("local!"), T0 + 1000, T0);
    await remote.writeFile("d.md", strToBuffer("remote!"), T0 + 3000, T0);

    const errors = await run(local, remote, db);

    assert.equal(errors.length, 0, `unexpected error: ${errors[0]?.message}`);
    assert.equal(bufferToStr(await local.readFile("d.md")), "remote!");
  });

  it("should keep the bigger side when the conflict action is keep_larger", async () => {
    const db = makeFakeDb();
    await seedPrevSync(db, "e.md", 5, T0);
    const local = new InMemoryFs("local");
    const remote = new InMemoryFs("remote");
    await local.writeFile("e.md", strToBuffer("local is bigger"), T0 + 1000, T0);
    await remote.writeFile("e.md", strToBuffer("small"), T0 + 3000, T0);

    const errors = await run(local, remote, db, {
      conflictAction: "keep_larger",
    });

    assert.equal(errors.length, 0, `unexpected error: ${errors[0]?.message}`);
    assert.equal(
      bufferToStr(await remote.readFile("e.md")),
      "local is bigger"
    );
  });

  it("should delete the remote file when the local one was deleted", async () => {
    const db = makeFakeDb();
    await seedPrevSync(db, "f.md", 5, T0);
    const local = new InMemoryFs("local");
    const remote = new InMemoryFs("remote");
    // the local side must not be empty, otherwise the whole prev sync
    // history is ignored on purpose (it would be a "hard reset")
    await local.writeFile("keep.md", strToBuffer("keep"), T0, T0);
    await remote.writeFile("f.md", strToBuffer("hello"), T0, T0);
    await remote.writeFile("keep.md", strToBuffer("keep"), T0, T0);

    const errors = await run(local, remote, db);

    assert.equal(errors.length, 0, `unexpected error: ${errors[0]?.message}`);
    assert.ok(!remote.files.has("f.md"), "the remote file should be deleted");
    assert.ok(remote.files.has("keep.md"));
  });

  it("should delete the local file when the remote one was deleted", async () => {
    const db = makeFakeDb();
    await seedPrevSync(db, "g.md", 5, T0);
    const local = new InMemoryFs("local");
    const remote = new InMemoryFs("remote");
    await local.writeFile("g.md", strToBuffer("hello"), T0, T0);
    await local.writeFile("keep.md", strToBuffer("keep"), T0, T0);
    await remote.writeFile("keep.md", strToBuffer("keep"), T0, T0);

    const errors = await run(local, remote, db);

    assert.equal(errors.length, 0, `unexpected error: ${errors[0]?.message}`);
    assert.ok(!local.files.has("g.md"), "the local file should be deleted");
    assert.ok(local.files.has("keep.md"));
  });

  it("should not delete anything in push-only mode", async () => {
    const db = makeFakeDb();
    await seedPrevSync(db, "h.md", 5, T0);
    const local = new InMemoryFs("local");
    const remote = new InMemoryFs("remote");
    await local.writeFile("keep.md", strToBuffer("keep"), T0, T0);
    await remote.writeFile("h.md", strToBuffer("hello"), T0, T0);
    await remote.writeFile("keep.md", strToBuffer("keep"), T0, T0);

    const errors = await run(local, remote, db, {
      syncDirection: "incremental_push_only",
    });

    assert.equal(errors.length, 0, `unexpected error: ${errors[0]?.message}`);
    assert.ok(remote.files.has("h.md"), "push-only must not delete anything");
  });

  it("should create the missing folder on the remote", async () => {
    const db = makeFakeDb();
    const local = new InMemoryFs("local");
    const remote = new InMemoryFs("remote");
    await local.mkdir("folder/", T0, T0);
    await local.writeFile("keep.md", strToBuffer("keep"), T0, T0);
    await remote.writeFile("keep.md", strToBuffer("keep"), T0, T0);

    const errors = await run(local, remote, db);

    assert.equal(errors.length, 0, `unexpected error: ${errors[0]?.message}`);
    assert.ok(remote.folders.has("folder/"));
  });

  it("should create the missing folder on the local", async () => {
    const db = makeFakeDb();
    const local = new InMemoryFs("local");
    const remote = new InMemoryFs("remote");
    await remote.mkdir("folder/", T0, T0);
    await remote.writeFile("keep.md", strToBuffer("keep"), T0, T0);
    await local.writeFile("keep.md", strToBuffer("keep"), T0, T0);

    const errors = await run(local, remote, db);

    assert.equal(errors.length, 0, `unexpected error: ${errors[0]?.message}`);
    assert.ok(local.folders.has("folder/"));
  });
});

describe("Sync: syncer conflict and deletion branches", () => {
  const V = "vault1";
  const P = "profile1";
  const CONFIG_DIR = ".obsidian";
  const T0 = 1700000000000;

  const settings = (
    extra: Partial<RemotelySavePluginSettings> = {}
  ): RemotelySavePluginSettings =>
    ({
      s3: {
        s3Endpoint: "https://s3.cstcloud.cn",
        s3Region: "us-east-1",
        s3AccessKeyID: "",
        s3SecretAccessKey: "",
        s3BucketName: "",
      },
      serviceType: "s3",
      concurrency: 2,
      protectModifyPercentage: -1,
      conflictAction: "keep_newer",
      syncDirection: "bidirectional",
      ...extra,
    }) as RemotelySavePluginSettings;

  const seedPrevSync = async (
    db: InternalDBs,
    key: string,
    size: number,
    mtime: number
  ) => {
    await db.prevSyncRecordsTbl.setItem(`${V}\t${P}\t${key}`, {
      key,
      keyRaw: key,
      size,
      sizeEnc: size,
      sizeRaw: size,
      mtimeCli: mtime,
      mtimeSvr: mtime,
    });
  };

  const run = async (
    local: InMemoryFs,
    remote: InMemoryFs,
    db: InternalDBs,
    opts: Partial<RemotelySavePluginSettings> = {}
  ) => {
    const errors: Error[] = [];
    await syncer(
      local,
      remote,
      db,
      "manual",
      P,
      V,
      CONFIG_DIR,
      settings(opts),
      "0.0.2",
      async () => {},
      () => "protected",
      () => {},
      async () => {},
      async (_s: any, err: Error) => {
        errors.push(err);
      },
      undefined,
      undefined,
      undefined
    );
    return errors;
  };

  it("should only keep the history when the file is gone on both sides", async () => {
    const db = makeFakeDb();
    await seedPrevSync(db, "gone.md", 5, T0);
    const local = new InMemoryFs("local");
    const remote = new InMemoryFs("remote");
    await local.writeFile("keep.md", strToBuffer("keep"), T0, T0);
    await remote.writeFile("keep.md", strToBuffer("keep"), T0, T0);

    const errors = await run(local, remote, db);

    assert.equal(errors.length, 0, `unexpected error: ${errors[0]?.message}`);
    const keys = await db.prevSyncRecordsTbl.keys();
    assert.ok(
      !keys.includes(`${V}\t${P}\tgone.md`),
      "the prev sync record should have been cleaned up"
    );
  });

  it("should keep the local side when both sides created the same file", async () => {
    const db = makeFakeDb();
    const local = new InMemoryFs("local");
    const remote = new InMemoryFs("remote");
    await local.writeFile("new.md", strToBuffer("local"), T0 + 3000, T0);
    await remote.writeFile("new.md", strToBuffer("remote"), T0 + 2000, T0);

    const errors = await run(local, remote, db);

    assert.equal(errors.length, 0, `unexpected error: ${errors[0]?.message}`);
    assert.equal(bufferToStr(await remote.readFile("new.md")), "local");
  });

  it("should keep the remote side when both sides created the same file", async () => {
    const db = makeFakeDb();
    const local = new InMemoryFs("local");
    const remote = new InMemoryFs("remote");
    await local.writeFile("new.md", strToBuffer("local"), T0 + 1000, T0);
    await remote.writeFile("new.md", strToBuffer("remote"), T0 + 3000, T0);

    const errors = await run(local, remote, db);

    assert.equal(errors.length, 0, `unexpected error: ${errors[0]?.message}`);
    assert.equal(bufferToStr(await local.readFile("new.md")), "remote");
  });

  it("should keep the bigger side when both sides created the same file", async () => {
    const db = makeFakeDb();
    const local = new InMemoryFs("local");
    const remote = new InMemoryFs("remote");
    await local.writeFile("new.md", strToBuffer("the local one is bigger"), T0, T0);
    await remote.writeFile("new.md", strToBuffer("small"), T0 + 3000, T0);

    const errors = await run(local, remote, db, {
      conflictAction: "keep_larger",
    });

    assert.equal(errors.length, 0, `unexpected error: ${errors[0]?.message}`);
    assert.equal(
      bufferToStr(await remote.readFile("new.md")),
      "the local one is bigger"
    );
  });

  it("should keep the remote side when the remote one is bigger (keep_larger)", async () => {
    // The counterpart of the test above: the remote file is the bigger one,
    // so the remote side must win. Without this, the `local.sizeEnc >=
    // remote.sizeEnc` comparison in the `keep_larger` branch could be
    // replaced by an unconditional "keep local" without any test failing.
    const db = makeFakeDb();
    const local = new InMemoryFs("local");
    const remote = new InMemoryFs("remote");
    await local.writeFile("new.md", strToBuffer("small"), T0, T0);
    await remote.writeFile("new.md", strToBuffer("the remote one is bigger"), T0 + 3000, T0);

    const errors = await run(local, remote, db, {
      conflictAction: "keep_larger",
    });

    assert.equal(errors.length, 0, `unexpected error: ${errors[0]?.message}`);
    assert.equal(
      bufferToStr(await local.readFile("new.md")),
      "the remote one is bigger"
    );
  });

  it("should not push the local-only new files in pull-only mode", async () => {
    // In pull-only mode a file that only exists locally must NOT be
    // uploaded to the remote (it is a "do nothing" decision). Without this
    // assertion, the pull-only guard could silently turn into a push.
    const db = makeFakeDb();
    const local = new InMemoryFs("local");
    const remote = new InMemoryFs("remote");
    await local.writeFile("local-only.md", strToBuffer("local only"), T0, T0);
    await remote.writeFile("remote-new.md", strToBuffer("remote"), T0, T0);

    const errors = await run(local, remote, db, {
      syncDirection: "incremental_pull_only",
    });

    assert.equal(errors.length, 0, `unexpected error: ${errors[0]?.message}`);
    // the local-only file must stay local
    assert.ok(
      !remote.files.has("local-only.md"),
      "pull-only mode must not upload the local-only files"
    );
    // and the remote-only file must still be pulled
    assert.ok(local.files.has("remote-new.md"));
  });

  it("should not download the new remote files in push-only mode", async () => {
    const db = makeFakeDb();
    const local = new InMemoryFs("local");
    const remote = new InMemoryFs("remote");
    await remote.writeFile("remote-new.md", strToBuffer("remote"), T0, T0);
    await local.writeFile("keep.md", strToBuffer("keep"), T0, T0);

    const errors = await run(local, remote, db, {
      syncDirection: "incremental_push_only",
    });

    assert.equal(errors.length, 0, `unexpected error: ${errors[0]?.message}`);
    assert.ok(!local.files.has("remote-new.md"));
  });

  it("should download the new remote files in pull-only mode", async () => {
    const db = makeFakeDb();
    const local = new InMemoryFs("local");
    const remote = new InMemoryFs("remote");
    await remote.writeFile("remote-new.md", strToBuffer("remote"), T0, T0);
    await local.writeFile("keep.md", strToBuffer("keep"), T0, T0);

    const errors = await run(local, remote, db, {
      syncDirection: "incremental_pull_only",
    });

    assert.equal(errors.length, 0, `unexpected error: ${errors[0]?.message}`);
    assert.ok(local.files.has("remote-new.md"));
    assert.equal(bufferToStr(await local.readFile("remote-new.md")), "remote");
  });

  it("should only propagate the remote deletions in pull-and-delete-only mode", async () => {
    const db = makeFakeDb();
    await seedPrevSync(db, "deleted-local.md", 5, T0);
    await seedPrevSync(db, "deleted-remote.md", 5, T0);
    const local = new InMemoryFs("local");
    const remote = new InMemoryFs("remote");
    await local.writeFile("deleted-remote.md", strToBuffer("hello"), T0, T0);
    await local.writeFile("keep.md", strToBuffer("keep"), T0, T0);
    await remote.writeFile("deleted-local.md", strToBuffer("hello"), T0, T0);
    await remote.writeFile("keep.md", strToBuffer("keep"), T0, T0);

    const errors = await run(local, remote, db, {
      syncDirection: "incremental_pull_and_delete_only",
    });

    assert.equal(errors.length, 0, `unexpected error: ${errors[0]?.message}`);
    // in pull-and-delete-only mode the deletions only flow from the remote
    // to the local, the remote always wins
    assert.ok(
      remote.files.has("deleted-local.md"),
      "the local deletion must not be pushed to the remote"
    );
    assert.ok(
      local.files.has("deleted-local.md"),
      "the remote file should be downloaded back to the local"
    );
    assert.ok(
      !local.files.has("deleted-remote.md"),
      "the remote deletion should be applied to the local"
    );
  });

  it("should merge the modified markdown file when the conflict action is smart_conflict", async () => {
    const db = makeFakeDb();
    await seedPrevSync(db, "m.md", 5, T0);
    const local = new InMemoryFs("local");
    const remote = new InMemoryFs("remote");
    await local.writeFile(
      "m.md",
      strToBuffer("line1\nlocal line\n"),
      T0 + 1000,
      T0
    );
    await remote.writeFile(
      "m.md",
      strToBuffer("line1\nremote line\n"),
      T0 + 2000,
      T0
    );

    const errors = await run(local, remote, db, {
      conflictAction: "smart_conflict",
    });

    assert.equal(errors.length, 0, `unexpected error: ${errors[0]?.message}`);
    const mergedLocal = bufferToStr(await local.readFile("m.md"));
    const mergedRemote = bufferToStr(await remote.readFile("m.md"));
    assert.equal(mergedLocal, mergedRemote, "both sides should be merged");
    assert.ok(mergedLocal.includes("local line"));
    assert.ok(mergedLocal.includes("remote line"));
  });

  it("should delete the remote folder when the local one was deleted", async () => {
    const db = makeFakeDb();
    await seedPrevSync(db, "folder/", 0, T0);
    const local = new InMemoryFs("local");
    const remote = new InMemoryFs("remote");
    await local.writeFile("keep.md", strToBuffer("keep"), T0, T0);
    await remote.mkdir("folder/", T0, T0);
    await remote.writeFile("keep.md", strToBuffer("keep"), T0, T0);

    const errors = await run(local, remote, db);

    assert.equal(errors.length, 0, `unexpected error: ${errors[0]?.message}`);
    assert.ok(!remote.folders.has("folder/"));
  });

  it("should delete the local folder when the remote one was deleted", async () => {
    const db = makeFakeDb();
    await seedPrevSync(db, "folder/", 0, T0);
    const local = new InMemoryFs("local");
    const remote = new InMemoryFs("remote");
    await local.mkdir("folder/", T0, T0);
    await local.writeFile("keep.md", strToBuffer("keep"), T0, T0);
    await remote.writeFile("keep.md", strToBuffer("keep"), T0, T0);

    const errors = await run(local, remote, db);

    assert.equal(errors.length, 0, `unexpected error: ${errors[0]?.message}`);
    assert.ok(!local.folders.has("folder/"));
  });
});
