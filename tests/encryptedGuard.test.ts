import { strict as assert } from "assert";
import {
  MAGIC_ENCRYPTED_PREFIX_BASE32,
  MAGIC_ENCRYPTED_PREFIX_BASE64URL,
  checkRemoteEncryption,
  copyEntityAndCopyKeyEncSizeEnc,
  isRemoteEncrypted,
} from "../src/encryptedGuard";
import { syncer } from "../src/sync";
import type { Entity } from "../src/baseTypes";
import { InMemoryFs, strToBuffer } from "./helpers/inMemoryFs";

/**
 * The Obsidian runtime injects a few browser-ish globals (`window.moment`,
 * `self`, ...) that the plugin sources use. The unit tests run in plain Node,
 * so we provide the minimal stubs that are needed here.
 */
const g: any = globalThis;
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
  g.moment = (x: number) => ({
    toISOString: () => new Date(x).toISOString(),
    format: () => new Date(x).toISOString(),
  });
}

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

const makeFakeDb = (): any => {
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
  };
};

const entityOf = (keyRaw: string, sizeRaw = 5): Entity => ({
  key: keyRaw,
  keyRaw,
  size: sizeRaw,
  sizeRaw,
  mtimeCli: 1700000000000,
  ctimeCli: 1700000000000,
  mtimeSvr: 1700000000000,
});

describe("Guard: the openssl magic prefixes", () => {
  it("should keep the magic prefixes verbatim", () => {
    assert.equal(MAGIC_ENCRYPTED_PREFIX_BASE32, "KNQWY5DFMRPV");
    assert.equal(MAGIC_ENCRYPTED_PREFIX_BASE64URL, "U2FsdGVkX");
  });
});

describe("Guard: copyEntityAndCopyKeyEncSizeEnc", () => {
  it("should fill keyEnc = keyRaw and sizeEnc = sizeRaw", () => {
    const res = copyEntityAndCopyKeyEncSizeEnc(entityOf("a.md", 42));
    assert.equal(res.keyEnc, "a.md");
    assert.equal(res.sizeEnc, 42);
    assert.equal(res.keyEnc, res.keyRaw);
    assert.equal(res.sizeEnc, res.sizeRaw);
  });

  it("should not modify the input entity", () => {
    const input = entityOf("a.md", 42);
    const res = copyEntityAndCopyKeyEncSizeEnc(input);
    assert.equal(input.keyEnc, undefined);
    assert.equal(input.sizeEnc, undefined);
    assert.notEqual(res, input);
  });
});

describe("Guard: isRemoteEncrypted", () => {
  it("should detect the openssl base32 prefix", () => {
    assert.equal(isRemoteEncrypted([entityOf(`${MAGIC_ENCRYPTED_PREFIX_BASE32}xx`)]), true);
  });

  it("should detect the openssl base64url prefix", () => {
    assert.equal(isRemoteEncrypted([entityOf(`${MAGIC_ENCRYPTED_PREFIX_BASE64URL}xx`)]), true);
  });

  it("should not report a plain remote as encrypted", () => {
    assert.equal(isRemoteEncrypted([entityOf("a.md"), entityOf("b.md")]), false);
    assert.equal(isRemoteEncrypted([]), false);
  });
});

describe("Guard: checkRemoteEncryption", () => {
  it("should accept an empty remote", () => {
    const res = checkRemoteEncryption([]);
    assert.equal(res.ok, true);
    assert.equal(res.reason, "empty_remote");
  });

  it("should abort the sync when the remote is encrypted", async () => {
    const local = new InMemoryFs("local");
    const remote = new InMemoryFs("remote");
    await local.writeFile("a.md", strToBuffer("hello"), 1000, 1000);
    // the openssl magic prefix
    await remote.writeFile(
      `${MAGIC_ENCRYPTED_PREFIX_BASE64URL}1abcdef`,
      strToBuffer("cipher"),
      1000,
      1000
    );
    const db = makeFakeDb();
    const errors: Error[] = [];

    const res = checkRemoteEncryption(await remote.walk());
    assert.equal(res.ok, false);
    assert.equal(res.reason, "remote_encrypted_local_no_password");

    await syncer(
      local,
      remote,
      db,
      "manual",
      "profile1",
      "vault1",
      ".obsidian",
      {
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
      } as any,
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

    assert.equal(errors.length, 1);
    assert.equal(errors[0].message, "remote_encrypted_local_no_password");
    assert.ok(
      !local.files.has(`${MAGIC_ENCRYPTED_PREFIX_BASE64URL}1abcdef`),
      "the ciphertext must not be pulled as if it were plaintext"
    );
  });
});
