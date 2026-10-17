# openclaw PRD v1.0 第 7 次审验报告

> 审验对象：`/root/.openclaw/Project/cstcloud-sync/PRD.md`（533 行 / 29KB / md5 `e7b1fe78e3145c34e027d75c9311f53a`，第 6 次审验 3 处 P1 修复后定稿版）
> 审验输入（仅 3 个）：
> 1. `/home/WPS/NEW/remotely_save.md`（任务书，3661 字节）
> 2. `/root/.openclaw/Project/cstcloud-sync/tech_v1.md`（技术分析 v1，36KB）
> 3. https://github.com/remotely-save/remotely-save（上游 + 浅克隆 `/home/WPS/ls/cstcloud-sync/`）
> 审验时间：2026-10-16（第 7 次，**重点深挖 scripts / pro/src/sync.ts 内部依赖 / DEFAULT_SETTINGS / fsS3 字段映射**）

---

## 1. 总体结论

**审验结果**：**第 6 次审验后定稿版通过 3 处 P1 修复，但发现 2 处 P1 严重遗漏**（scripts + pro/src/sync.ts 内部依赖）。

| 等级 | 问题数 | 严重性 |
|---|---|---|
| **P1 scripts 漏改造** | **1 处** | `package.json` `test: mocha ... 'pro/tests/**/*.ts'` —— Step 5 删 pro/ 后必失败 |
| **P1 pro/src/sync.ts 提取漏** | **1 处** | pro 内部 3 个 import（account/conflictLogic/localdb）Step 34 没说明怎么合并 |
| P2 manifest.json minAppVersion 漏 | 1 | Step 28 没提 minAppVersion 字段处理 |
| P2 P0-9 / P0-10 行号偏差 | 1 | 实际 main.ts:1765 是 syncRun("auto")，P0-9/P0-10 行号可能 ±5 |
| 第 1-6 次修复 | — | 全部生效 |

---

## 2. P1 严重：package.json scripts.test 漏改造

### 2.1 实际 scripts

```json
"scripts": {
  "dev2": "node esbuild.config.mjs --watch",
  "build2": "tsc -noEmit -skipLibCheck && node esbuild.config.mjs production",
  "build": "webpack --mode production",
  "dev": "webpack --mode development --watch",
  "format": "npx @biomejs/biome check --write .",
  "clean": "npx rimraf main.js",
  "test": "mocha --import=tsx 'tests/**/*.ts' 'pro/tests/**/*.ts'"  ← ⚠️
}
```

### 2.2 风险

- **Step 5 删 pro/ 后 `pro/tests/` 目录没了**
- `npm test` 会因 `pro/tests/**/*.ts` glob 找不到文件而失败
- AC7 写"`npm test` 无新增测试失败"，但**没说改 test script**

### 2.3 修正

**Step 29 末尾追加**：
```
| 29 | 修改 `package.json`：name→cstcloud-sync，license→Apache-2.0，删除 8 个云服务依赖，**`scripts.test` 改为 `mocha --import=tsx 'tests/**/*.ts'`（去掉 pro/tests/**/*.ts）** | `package.json` |
```

---

## 3. P1 严重：pro/src/sync.ts 提取漏内部依赖

### 3.1 实际 pro/src/sync.ts 完整 import 链

```typescript
// npm 依赖（3 个）
import AggregateError from "aggregate-error";
import PQueue from "p-queue";
import XRegExp from "xregexp";

// src 内部（8 个）
import type { ... } from "../../src/baseTypes";
import { copyFile, copyFileOrFolder, copyFolder } from "../../src/copyLogic";
import type { FakeFs } from "../../src/fsAll";
import type { FakeFsEncrypt } from "../../src/fsEncrypt";
import { ... } from "../../src/localdb";
import { ... } from "../../src/metadataOnRemote";
import { ... } from "../../src/misc";
import type { Profiler } from "../../src/profiler";

// ⚠️ pro 内部（3 个）
import { checkProRunnableAndFixInplace } from "./account";
import { isMergable, mergeFile, tryDuplicateFile } from "./conflictLogic";
import { ... } from "./localdb";
```

### 3.2 风险

- **Step 34 写"从 pro/src/sync.ts 提取核心 syncer 逻辑"**，但**没说明 pro 内部 3 个 import 怎么办**
- **Step 5 删 pro/ 后**：
  - `pro/src/account.ts` 的 `checkProRunnableAndFixInplace` —— 这是 PRO 校验，**可能 cstcloud-sync 不需要**（无 PRO）
  - `pro/src/conflictLogic.ts` 的 `isMergable / mergeFile / tryDuplicateFile` —— 这是合并算法，**S3 同步需要**
  - `pro/src/localdb.ts` 的类型 —— **需要合并到 src/localdb.ts**
- **关键遗漏**：conflictLogic 提取到 src/conflictLogic.ts？

### 3.3 修正方案

**Step 34 改为**（详细列出提取内容）：
```
| 34 | 新建 `src/sync.ts`：从 `pro/src/sync.ts` 提取 syncer 主体，同时新建 `src/conflictLogic.ts`（从 `pro/src/conflictLogic.ts` 提取 `isMergable / mergeFile / tryDuplicateFile`）和合并 `pro/src/localdb.ts` 类型到 `src/localdb.ts`，删除 `pro/src/account.ts` 的 PRO 校验调用 | `src/sync.ts` + `src/conflictLogic.ts` + `src/localdb.ts` |
```

**附 R4 风险升级**：
- R4 写"pro/src/sync.ts 提取到 src/sync.ts 可能遗漏依赖（如 SyncPlanType）"
- **应升级为 P1**：因为 conflictLogic 是核心算法不提取就编译失败

---

## 4. P2 中等：manifest.json minAppVersion 漏

### 4.1 实际 manifest.json 字段

```json
{
  "id": "remotely-save",
  "name": "Remotely Save",
  "version": "0.5.25",
  "minAppVersion": "0.13.21",        ← ⚠️ PRD Step 28 没提
  "description": "...",
  "author": "fyears",
  "authorUrl": "https://github.com/fyears",
  "isDesktopOnly": false,
  "fundingUrl": "https://remotelysave.com"
}
```

### 4.2 修正

**Step 28 末尾追加**：`minAppVersion 保留 "0.13.21"`（Obsidian 最低支持版本，无需改）

---

## 5. P2 中等：P0-9 / P0-10 行号偏差

### 5.1 实际 main.ts 关键行

```bash
$ grep -n "syncRun\|enableAutoSyncIfSet\|enableInitSyncIfSet" src/main.ts
234:  async syncRun(triggerSource: SyncTriggerSourceType = "manual") {  # syncRun 定义
1174:      async () => this.syncRun("manual")                            # ribbon
1217:        this.syncRun("manual");                                      # command start-sync
1226:        this.syncRun("dry");                                         # command start-sync-dry-run
1765:          this.syncRun("auto");                                      # auto sync
```

### 5.2 PRD 引用

| PRD 引用 | 实际 | 偏差 |
|---|---|---|
| P0-9 `main.ts:1757-1771 enableAutoSyncIfSet()` | 1765 附近 | ±8 |
| P0-10 `main.ts:1773-1785 enableInitSyncIfSet()` | 1765 附近 | ±8 |
| P0-5 `main.ts:1171-1175` ribbon | 1174 | ±3 |

**P3 行号小偏差**，可不改（5 行内合理范围）。

---

## 6. 第 1-6 次审验修复确认

| 修复 | 状态 |
|---|---|
| NI-21~NI-24 + i18n | ✅ |
| §2.3 4 项 S3 开关 | ✅ |
| §2.2 3 行任务书原词 | ✅ |
| 4 处字段名修正 | ✅ |
| §4.2 删 googleapis/koofr-api | ✅ |
| §5.1.E ~194 + 13 类 | ✅ |
| §4.1 补充 18 保留依赖 | ✅ |
| Step 39/29/7/44/AC8 5 处 | ✅ |
| §5.1.D 数量 + NI-5 | ✅ |
| Step 35 行号 | ✅ |
| §5.1.A 追加 3 文件 | ✅ |
| NI 编号映射 | ✅ |
| Step 1.5（tests/fsWebdis.test.ts） | ✅ |
| Step 11 行 4+11 | ✅ |
| Step 28 version 0.0.1 | ✅ |

**新发现**：
- 以上修复**全部生效**
- 但 `scripts.test` + `pro/src/sync.ts 内部依赖`是新发现的更深层问题

---

## 7. 任务书 46 项覆盖度（7 轮累计）

| 维度 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---|---|---|---|---|---|---|
| 任务书 46 项 | 42/46 | 46/46 | 46/46 | 46/46 | 46/46 | 46/46 | 46/46 |
| 任务书 10 条补充 | 10/10 | 10/10 | 10/10 | 10/10 | 10/10 | 10/10 | 10/10 |
| 字段名 | — | 2 错→修 | ✅ | ✅ | ✅ | ✅ | ✅ |
| 行号 | — | ✅ | ✅ | ✅ | Step 35 修 | ✅ | **❌ 1 偏差** |
| package.json 依赖 | — | — | 修 | ✅ | ✅ | ✅ | ✅ |
| i18n 数量 | — | — | 修 | 同步 | ✅ | ✅ | ✅ |
| 内部一致性 | — | — | — | 5 处修 | ✅ | ✅ | ✅ |
| §5.1.D 文件数 | — | — | — | — | 修 | ✅ | ✅ |
| NI 编号映射 | — | — | — | — | 修 | ✅ | ✅ |
| §5.1.A 保留文件 | — | — | — | — | 修 | ✅ | ✅ |
| tests/ 目录 | — | — | — | — | — | 修 | ✅ |
| importExport 完整 | — | — | — | — | — | 修 | ✅ |
| manifest version | — | — | — | — | — | 修 | ✅ |
| **scripts.test 改造** | — | — | — | — | — | — | **❌** |
| **pro/src/sync.ts 内部依赖** | — | — | — | — | — | — | **❌** |

---

## 8. 抽样验证详情（本次新增 5 类）

| # | 抽样 | 实际 | PRD 引用 | 状态 |
|---|---|---|---|---|
| 1 | package.json test script | "mocha --import=tsx 'tests/**/*.ts' 'pro/tests/**/*.ts'" | Step 29 没提 | ❌ P1 漏 |
| 2 | pro/src/sync.ts 内部 import | 3 个（account/conflictLogic/localdb） | Step 34 没提 | ❌ P1 漏 |
| 3 | main.ts DEFAULT_SETTINGS 字段 | 11 云 + 28 其他 | Step 31 列 3 项 | ⚠️ P3 简略 |
| 4 | fsS3.ts DEFAULT_S3_CONFIG 字段 | 12 字段 | PRD §3.2 P1 列 14 项 | ⚠️ P3 数量差 |
| 5 | manifest.json minAppVersion | "0.13.21" | Step 28 没提 | ⚠️ P2 漏 |

---

## 9. 建议执行

| 优先级 | 动作 | 成本 |
|---|---|---|
| **P1-1 必做** | Step 29 加"`scripts.test` 改为去掉 pro/tests/**/*.ts" | 1 分钟 |
| **P1-2 必做** | Step 34 详细列提取内容（新建 src/conflictLogic.ts + 合并 src/localdb.ts + 删除 PRO 校验调用） | 3 分钟 |
| **P2-1 可选** | Step 28 加"minAppVersion 保留 0.13.21" | 1 分钟 |

老板拍板：
- **A**：让 ClaudeCode 修 2 处 P1（scripts.test + pro/src/sync.ts 提取）→ 同步副本
- **B**：A + 1 处 P2（minAppVersion）
- **C**：直接通过 PRD

按老板"认真全面仔细"原则，建议**选项 A**。
