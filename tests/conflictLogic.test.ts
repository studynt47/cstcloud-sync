import { strict as assert } from "assert";
import {
  MERGABLE_SIZE,
  getFileRenameForDup,
  isMergable,
  mergeFile,
  threeWayMerge,
  tryDuplicateFile,
  twoWayMerge,
} from "../src/conflictLogic";
import type { Entity } from "../src/baseTypes";
import { InMemoryFs, bufferToStr, strToBuffer } from "./helpers/inMemoryFs";

const entityOf = (key: string, sizeRaw: number): Entity => ({
  key,
  keyRaw: key,
  size: sizeRaw,
  sizeRaw,
  mtimeCli: 1700000000000,
  ctimeCli: 1700000000000,
});

describe("ConflictLogic: isMergable", () => {
  it("should not merge folders", () => {
    assert.equal(isMergable(entityOf("a/", 0)), false);
  });

  it("should not merge files that are too large", () => {
    assert.equal(
      isMergable(entityOf("a.md", MERGABLE_SIZE + 1)),
      false
    );
    assert.equal(isMergable(entityOf("a.md", MERGABLE_SIZE)), true);
  });

  it("should only merge markdown files", () => {
    assert.equal(isMergable(entityOf("a.md", 10)), true);
    assert.equal(isMergable(entityOf("a.markdown", 10)), true);
    assert.equal(isMergable(entityOf("a.txt", 10)), false);
  });

  it("should not merge when the two keys differ", () => {
    assert.equal(isMergable(entityOf("a.md", 10), entityOf("b.md", 10)), false);
    assert.equal(isMergable(entityOf("a.md", 10), entityOf("a.md", 10)), true);
    assert.equal(isMergable(entityOf("a.md", 10), undefined), true);
  });
});

describe("ConflictLogic: getFileRenameForDup", () => {
  it("should reject keys that cannot be renamed", () => {
    for (const k of ["", ".", "..", "/", "a/"]) {
      assert.throws(() => {
        getFileRenameForDup(k);
      }, /we cannot rename key=/);
    }
  });

  it("should rename a name without any dot", () => {
    assert.equal(getFileRenameForDup("a/b/kkk"), "a/b/kkk.dup");
  });

  it("should rename a name with a leading dot", () => {
    assert.equal(getFileRenameForDup("a/.kkkk"), "a/.kkkk.dup");
  });

  it("should rename a name with a tailing dot", () => {
    assert.equal(getFileRenameForDup("a/kkkk."), "a/kkkk.dup");
  });

  it("should rename a normal name", () => {
    assert.equal(getFileRenameForDup("a/aaa.bbb"), "a/aaa.dup.bbb");
  });

  it("should rename a name with more than one dot", () => {
    assert.equal(getFileRenameForDup("a/x.bbb.ccc"), "a/x.bbb.dup.ccc");
  });
});

describe("ConflictLogic: twoWayMerge", () => {
  it("should keep the original text when both sides are empty", () => {
    assert.equal(twoWayMerge("", ""), "");
    assert.equal(twoWayMerge("  ", "\n"), "  ");
  });

  it("should return the other side when one side is empty", () => {
    assert.equal(twoWayMerge("aaa", ""), "aaa");
    assert.equal(twoWayMerge("", "bbb"), "bbb");
  });

  it("should merge two different texts", () => {
    const res = twoWayMerge("line1\nline2\n", "line1\nline3\n");
    assert.ok(res.includes("line1"));
    assert.ok(res.includes("line2"));
    assert.ok(res.includes("line3"));
  });
});

describe("ConflictLogic: threeWayMerge", () => {
  it("should merge using the original text as the base", () => {
    const res = threeWayMerge("a\nb\n", "a\nc\n", "a\n");
    assert.ok(res.includes("b"));
    assert.ok(res.includes("c"));
  });
});

describe("ConflictLogic: mergeFile", () => {
  it("should throw for a folder key", async () => {
    const left = new InMemoryFs("local");
    const right = new InMemoryFs("remote");
    await assert.rejects(async () => {
      await mergeFile("a/", left, right, null);
    }, /should not call a\/ in mergeFile/);
  });

  it("should throw for non-markdown files", async () => {
    const left = new InMemoryFs("local");
    const right = new InMemoryFs("remote");
    await assert.rejects(async () => {
      await mergeFile("a.txt", left, right, null);
    }, /only support markdown files in mergeFile/);
  });

  it("should keep the content when both sides are equal", async () => {
    const left = new InMemoryFs("local");
    const right = new InMemoryFs("remote");
    await left.writeFile("a.md", strToBuffer("same"), 1, 1);
    await right.writeFile("a.md", strToBuffer("same"), 1, 1);

    const res = await mergeFile("a.md", left, right, null);

    assert.equal(bufferToStr(res.content!), "same");
    assert.equal(bufferToStr(await left.readFile("a.md")), "same");
    assert.equal(bufferToStr(await right.readFile("a.md")), "same");
  });

  it("should two-way merge when no original content is given", async () => {
    const left = new InMemoryFs("local");
    const right = new InMemoryFs("remote");
    await left.writeFile("a.md", strToBuffer("line1\nline2\n"), 1, 1);
    await right.writeFile("a.md", strToBuffer("line1\nline3\n"), 1, 1);

    const res = await mergeFile("a.md", left, right, null);

    const merged = bufferToStr(res.content!);
    assert.ok(merged.includes("line2"));
    assert.ok(merged.includes("line3"));
  });

  it("should three-way merge when the original content is given", async () => {
    const left = new InMemoryFs("local");
    const right = new InMemoryFs("remote");
    await left.writeFile("a.md", strToBuffer("a\nb\n"), 1, 1);
    await right.writeFile("a.md", strToBuffer("a\nc\n"), 1, 1);

    const res = await mergeFile("a.md", left, right, strToBuffer("a\n"));

    const merged = bufferToStr(res.content!);
    assert.ok(merged.includes("b"));
    assert.ok(merged.includes("c"));
  });

  it("should write to the remote first and to the local afterwards", async () => {
    const sharedOps: string[] = [];
    const left = new InMemoryFs("local", { sharedOps });
    const right = new InMemoryFs("remote", { sharedOps });
    await left.writeFile("a.md", strToBuffer("x"), 1, 1);
    await right.writeFile("a.md", strToBuffer("y"), 1, 1);

    sharedOps.length = 0; // only count the operations of the merge itself
    await mergeFile("a.md", left, right, null);

    const writes = sharedOps.filter(
      (x) => x === "writeFile:remote:a.md" || x === "writeFile:local:a.md"
    );
    assert.equal(writes.length, 2);
    // the remote write must happen before the local write
    const remoteWriteAt = sharedOps.indexOf("writeFile:remote:a.md");
    const localWriteAt = sharedOps.indexOf("writeFile:local:a.md");
    assert.ok(remoteWriteAt >= 0 && localWriteAt >= 0);
    assert.ok(
      remoteWriteAt < localWriteAt,
      `expected the remote write before the local write, got ${JSON.stringify(sharedOps)}`
    );
  });
});

describe("ConflictLogic: tryDuplicateFile", () => {
  it("should only update the local side when the contents are equal", async () => {
    const local = new InMemoryFs("local");
    const remote = new InMemoryFs("remote");
    await local.writeFile("a.md", strToBuffer("same"), 100, 100);
    await remote.writeFile("a.md", strToBuffer("same"), 200, 200);

    let uploaded = 0;
    let downloaded = 0;
    await tryDuplicateFile(
      "a.md",
      local,
      remote,
      async () => {
        uploaded += 1;
      },
      async () => {
        downloaded += 1;
      }
    );

    assert.equal(uploaded, 0, "no upload should happen when both sides are equal");
    assert.equal(downloaded, 1, "the local side should be updated once");
    assert.ok(local.files.has("a.md"));
    assert.ok(!local.files.has("a.dup.md"));
  });

  it("should rename the local file when the contents differ but the sizes match", async () => {
    const local = new InMemoryFs("local");
    const remote = new InMemoryFs("remote");
    await local.writeFile("a.md", strToBuffer("AAAA"), 100, 100);
    await remote.writeFile("a.md", strToBuffer("BBBB"), 200, 200);

    let uploaded = 0;
    let downloaded = 0;
    await tryDuplicateFile(
      "a.md",
      local,
      remote,
      async () => {
        uploaded += 1;
      },
      async () => {
        downloaded += 1;
      }
    );

    assert.equal(uploaded, 1);
    assert.equal(downloaded, 1);
    // the remote content wins the original name
    assert.equal(bufferToStr(await local.readFile("a.md")), "BBBB");
    // the local content is kept under the .dup. name
    assert.equal(bufferToStr(await local.readFile("a.dup.md")), "AAAA");
    assert.equal(bufferToStr(await remote.readFile("a.dup.md")), "AAAA");
  });

  it("should rename the local file when the sizes differ", async () => {
    const local = new InMemoryFs("local");
    const remote = new InMemoryFs("remote");
    await local.writeFile("a.md", strToBuffer("AAAA"), 100, 100);
    await remote.writeFile("a.md", strToBuffer("BBBBBBBB"), 200, 200);

    let uploaded = 0;
    let downloaded = 0;
    await tryDuplicateFile(
      "a.md",
      local,
      remote,
      async () => {
        uploaded += 1;
      },
      async () => {
        downloaded += 1;
      }
    );

    assert.equal(uploaded, 1);
    assert.equal(downloaded, 1);
    assert.equal(bufferToStr(await local.readFile("a.md")), "BBBBBBBB");
    assert.equal(bufferToStr(await local.readFile("a.dup.md")), "AAAA");
    assert.equal(bufferToStr(await remote.readFile("a.dup.md")), "AAAA");
  });

  it("should pick the next free .dup. name when it is already taken", async () => {
    const local = new InMemoryFs("local");
    const remote = new InMemoryFs("remote");
    await local.writeFile("a.md", strToBuffer("AAAA"), 100, 100);
    await local.writeFile("a.dup.md", strToBuffer("old"), 100, 100);
    await remote.writeFile("a.md", strToBuffer("BBBBBBBB"), 200, 200);

    await tryDuplicateFile(
      "a.md",
      local,
      remote,
      async () => {},
      async () => {}
    );

    assert.ok(local.files.has("a.dup.dup.md"), "the next free dup name should be used");
    assert.equal(bufferToStr(await local.readFile("a.dup.dup.md")), "AAAA");
  });
});
