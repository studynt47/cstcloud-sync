/**
 * A tiny in-memory implementation of the abstract FakeFs.
 *
 * It is used by the cstcloud-sync core-logic unit tests (B4 / PRD v1.3 Step 72)
 * so that the tests can exercise the copy / merge / sync decision logic
 * without touching the real vault, the real S3 bucket, or Obsidian itself.
 *
 * It is intentionally NOT a mocha spec file (it contains no `describe`), it is
 * only a helper module that the spec files import.
 */

import type { Entity } from "../../src/baseTypes";
import { FakeFs } from "../../src/fsAll";

export interface InMemoryFile {
  content: ArrayBuffer;
  mtime: number;
  ctime: number;
}

export interface InMemoryFsOptions {
  /**
   * If true, `stat()` will not report `size` (simulates android / some webdav
   * adapters that do not return the size of a file).
   */
  omitSize?: boolean;
  /**
   * If true, `stat()` will not report `mtimeCli` (simulates a broken adapter).
   */
  omitMtime?: boolean;
  /**
   * A shared log of operations. Give the same array to the local and the
   * remote fs, so that the tests can assert on the *global* order of the
   * operations (e.g. "upload first, download afterwards").
   */
  sharedOps?: string[];
}

export class InMemoryFs extends FakeFs {
  kind: string;
  files: Map<string, InMemoryFile>;
  folders: Map<string, { mtime: number; ctime: number }>;
  opts: InMemoryFsOptions;
  /**
   * Every writeFile() / mkdir() / rename() / rm() call is recorded here, so
   * that the tests can assert on the *sequence* of operations (upload first,
   * download afterwards, ...).
   */
  ops: string[];

  constructor(kind: string, opts: InMemoryFsOptions = {}) {
    super();
    this.kind = kind;
    this.files = new Map();
    this.folders = new Map();
    this.ops = [];
    this.opts = opts;
  }

  private log(op: string) {
    this.ops.push(op);
    this.opts.sharedOps?.push(op);
  }

  private entityOf(key: string, f: InMemoryFile): Entity {
    const size = f.content.byteLength;
    const e: Entity = {
      key: key,
      keyRaw: key,
      sizeRaw: size,
      mtimeCli: this.opts.omitMtime ? undefined : f.mtime,
      ctimeCli: f.ctime,
      mtimeSvr: f.mtime,
    };
    if (!this.opts.omitSize) {
      e.size = size;
    }
    return e;
  }

  async walk(): Promise<Entity[]> {
    const res: Entity[] = [];
    for (const [folder, meta] of this.folders) {
      res.push({
        key: folder,
        keyRaw: folder,
        size: 0,
        sizeRaw: 0,
        mtimeCli: meta.mtime,
        ctimeCli: meta.ctime,
        mtimeSvr: meta.mtime,
        synthesizedFolder: true,
      });
    }
    for (const [key, f] of this.files) {
      res.push(this.entityOf(key, f));
    }
    return res;
  }

  async walkPartial(): Promise<Entity[]> {
    return await this.walk();
  }

  async stat(key: string): Promise<Entity> {
    const folderMeta = this.folders.get(key);
    if (folderMeta !== undefined) {
      return {
        key: key,
        keyRaw: key,
        size: 0,
        sizeRaw: 0,
        mtimeCli: folderMeta.mtime,
        ctimeCli: folderMeta.ctime,
        mtimeSvr: folderMeta.mtime,
        synthesizedFolder: true,
      };
    }
    const f = this.files.get(key);
    if (f === undefined) {
      throw Error(`stat: key ${key} not found`);
    }
    return this.entityOf(key, f);
  }

  async mkdir(key: string, mtime?: number, ctime?: number): Promise<Entity> {
    this.log(`mkdir:${this.kind}:${key}`);
    const now = Date.now();
    this.folders.set(key, { mtime: mtime ?? now, ctime: ctime ?? mtime ?? now });
    return {
      key: key,
      keyRaw: key,
      size: 0,
      sizeRaw: 0,
      mtimeCli: mtime ?? now,
      ctimeCli: ctime ?? mtime ?? now,
      mtimeSvr: mtime ?? now,
      synthesizedFolder: true,
    };
  }

  async writeFile(
    key: string,
    content: ArrayBuffer,
    mtime: number,
    ctime: number
  ): Promise<Entity> {
    this.log(`writeFile:${this.kind}:${key}`);
    this.files.set(key, { content, mtime, ctime });
    return this.entityOf(key, { content, mtime, ctime });
  }

  async readFile(key: string): Promise<ArrayBuffer> {
    const f = this.files.get(key);
    if (f === undefined) {
      throw Error(`readFile: key ${key} not found`);
    }
    return f.content;
  }

  async rename(key1: string, key2: string): Promise<void> {
    this.log(`rename:${this.kind}:${key1}->${key2}`);
    const f = this.files.get(key1);
    if (f === undefined) {
      throw Error(`rename: key ${key1} not found`);
    }
    this.files.delete(key1);
    this.files.set(key2, f);
    const folderMeta = this.folders.get(key1);
    if (folderMeta !== undefined) {
      this.folders.delete(key1);
      this.folders.set(key2, folderMeta);
    }
  }

  async rm(key: string): Promise<void> {
    this.log(`rm:${this.kind}:${key}`);
    this.files.delete(key);
    this.folders.delete(key);
  }

  async checkConnect(callbackFunc?: any): Promise<boolean> {
    return true;
  }

  async getUserDisplayName(): Promise<string> {
    return this.kind;
  }

  async revokeAuth(): Promise<any> {
    return undefined;
  }

  allowEmptyFile(): boolean {
    return true;
  }
}

export const strToBuffer = (s: string): ArrayBuffer => {
  const b = new TextEncoder().encode(s);
  return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer;
};

export const bufferToStr = (b: ArrayBuffer): string =>
  new TextDecoder("utf-8").decode(new Uint8Array(b));
