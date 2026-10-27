import { strict as assert } from "assert";
import { copyFile, copyFileOrFolder, copyFolder } from "../src/copyLogic";
import { InMemoryFs, bufferToStr, strToBuffer } from "./helpers/inMemoryFs";

describe("CopyLogic: copyFolder", () => {
  it("should throw if the key is not a folder", async () => {
    const left = new InMemoryFs("local");
    const right = new InMemoryFs("remote");
    await assert.rejects(async () => {
      await copyFolder("a.md", left, right);
    }, /should not call a\.md in copyFolder/);
  });

  it("should create the folder on the right side with the left mtime", async () => {
    const left = new InMemoryFs("local");
    const right = new InMemoryFs("remote");
    const mtime = 1700000000000;
    await left.mkdir("folder/", mtime, mtime);

    const res = await copyFolder("folder/", left, right);

    assert.ok(res.entity !== undefined);
    assert.equal(res.entity.key, "folder/");
    assert.equal(res.entity.mtimeCli, mtime);
    assert.equal(res.content, undefined);
    assert.ok(right.folders.has("folder/"));
    assert.equal((await right.stat("folder/")).mtimeCli, mtime);
  });
});

describe("CopyLogic: copyFile", () => {
  it("should throw if the key is a folder", async () => {
    const left = new InMemoryFs("local");
    const right = new InMemoryFs("remote");
    await assert.rejects(async () => {
      await copyFile("folder/", left, right);
    }, /should not call folder\/ in copyFile/);
  });

  it("should copy the content and keep the mtime/ctime", async () => {
    const left = new InMemoryFs("local");
    const right = new InMemoryFs("remote");
    const mtime = 1700000000001;
    const ctime = 1700000000002;
    await left.writeFile("a.md", strToBuffer("hello"), mtime, ctime);

    const res = await copyFile("a.md", left, right);

    assert.equal(bufferToStr(res.content!), "hello");
    assert.equal(res.entity.key, "a.md");
    assert.equal(res.entity.mtimeCli, mtime);
    assert.equal(res.entity.ctimeCli, ctime);
    assert.equal(bufferToStr(await right.readFile("a.md")), "hello");
  });

  it("should use content length when the source does not report a size", async () => {
    const left = new InMemoryFs("local", { omitSize: true });
    const right = new InMemoryFs("remote");
    await left.writeFile("a.md", strToBuffer("12345"), 1700000000001, 1700000000001);

    const res = await copyFile("a.md", left, right);

    assert.equal(res.entity.size, 5);
    assert.equal(res.entity.sizeRaw, 5);
  });

  it("should throw when the reported size does not match the content", async () => {
    const left = new InMemoryFs("local");
    const right = new InMemoryFs("remote");
    await left.writeFile("a.md", strToBuffer("12345"), 1700000000001, 1700000000001);
    // corrupt the reported size
    const origStat = left.stat.bind(left);
    left.stat = async (key: string) => {
      const e = await origStat(key);
      e.size = 999;
      e.sizeRaw = 999;
      return e;
    };

    await assert.rejects(async () => {
      await copyFile("a.md", left, right);
    }, /size not matched/);
  });

  it("should throw when the source does not report a mtime", async () => {
    const left = new InMemoryFs("local", { omitMtime: true });
    const right = new InMemoryFs("remote");
    await left.writeFile("a.md", strToBuffer("12345"), 1700000000001, 1700000000001);

    await assert.rejects(async () => {
      await copyFile("a.md", left, right);
    }, /no mtimeCli/);
  });
});

describe("CopyLogic: copyFileOrFolder", () => {
  it("should dispatch to copyFolder for folders", async () => {
    const left = new InMemoryFs("local");
    const right = new InMemoryFs("remote");
    await left.mkdir("folder/", 1700000000000, 1700000000000);

    const res = await copyFileOrFolder("folder/", left, right);

    assert.equal(res.entity.key, "folder/");
    assert.equal(res.content, undefined);
    assert.ok(right.folders.has("folder/"));
  });

  it("should dispatch to copyFile for files", async () => {
    const left = new InMemoryFs("local");
    const right = new InMemoryFs("remote");
    await left.writeFile("a.md", strToBuffer("hello"), 1700000000001, 1700000000001);

    const res = await copyFileOrFolder("a.md", left, right);

    assert.equal(res.entity.key, "a.md");
    assert.equal(bufferToStr(res.content!), "hello");
    assert.ok(right.files.has("a.md"));
  });
});
