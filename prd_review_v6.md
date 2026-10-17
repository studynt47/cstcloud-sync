# openclaw PRD v1.0 第 6 次审验报告

> 审验对象：`/root/.openclaw/Project/cstcloud-sync/PRD.md`（532 行 / 28KB / md5 `6e1d989fd89da085e23537de48ad4827`，第 5 次审验 4 处 P1 修复后定稿版）
> 审验输入（仅 3 个）：
> 1. `/home/WPS/NEW/remotely_save.md`（任务书，3661 字节）
> 2. `/root/.openclaw/Project/cstcloud-sync/tech_v1.md`（技术分析 v1，36KB）
> 3. https://github.com/remotely-save/remotely-save（上游 + 浅克隆 `/home/WPS/ls/cstcloud-sync/`）
> 审验时间：2026-10-16（第 6 次，**重点深挖 import 链 + tests/ + manifest.json + 关键接口行号**）

---

## 1. 总体结论

**审验结果**：**第 5 次审验后定稿版通过 4 处 P1 修复，但发现 3 处 P1 严重遗漏/偏差**。

| 等级 | 问题数 | 严重性 |
|---|---|---|
| **P1 tests/ 目录漏处理** | **1 处** | 5 个测试文件，删 fsWebdis.ts 后 fsWebdis.test.ts 编译失败，PRD Step 1-44 全无 |
| **P1 importExport.ts 漏 1 行清理** | **1 处** | Step 11 只提"删行 4 getShrinkedSettingsOnedriveFull"，漏行 11 getShrinkedSettingsOnedrive |
| **P1 manifest.json version 漏** | **1 处** | Step 28 只提 id/name/description/fundingUrl，漏 version 字段改造 |
| P2 关键接口行号偏差 | 1 | `getS3Client()` PRD 写 230-254 实际 223-260（偏差 7 行） |
| P2 esbuild OAuth env 起始行偏差 | 1 | PRD 写 L17-33，实际 L16-30（偏差 1 行） |
| 第 1/2/3/4/5 次修复 | — | 全部生效 |

---

## 2. P1 严重：tests/ 目录完全漏处理

### 2.1 实际 tests/ 目录

```
tests/
├─ configPersist.test.ts      (1.3KB)   ← 源保留，测试保留
├─ encryptOpenSSL.test.ts     (6.0KB)   ← 源保留，测试保留
├─ fsWebdis.test.ts           (384B)    ← ⚠️ 源删了，测试怎么办？
├─ metadataOnRemote.test.ts   (2.0KB)   ← 源保留，测试保留
├─ misc.test.ts               (13.9KB)  ← 源保留，测试保留
└─ static_assets/             (空目录)
```

### 2.2 风险

- **Step 1-44 完全没提 tests/ 改造**
- `fsWebdis.test.ts` 引用了将被删除的 `fsWebdis.ts`，**Step 1 删 fsWebdis.ts 后 fsWebdis.test.ts 必编译失败**
- AC7 写"`npm test` 无新增测试失败"，但**没明确说"删 fsWebdis.test.ts"**

### 2.3 修正

- §6 Phase 1 追加 Step 1.5：**删除 `tests/fsWebdis.test.ts`**
- §6 追加 Step 1.6：**保留 `tests/static_assets/` 目录**（与测试数据有关）
- AC7 验证方式补充："执行 `npm test` 前确认 5 个测试文件保留（configPersist/encryptOpenSSL/metadataOnRemote/misc），`fsWebdis.test.ts` 已删"

---

## 3. P1 严重：importExport.ts 漏 1 行清理

### 3.1 实际 import 链

```bash
$ grep -rn "fsOnedrive" src/importExport.ts
src/importExport.ts:4:  import { getShrinkedSettings as getShrinkedSettingsOnedriveFull } from "../pro/src/fsOnedriveFull";
src/importExport.ts:11: import { getShrinkedSettings as getShrinkedSettingsOnedrive } from "./fsOnedrive";
```

### 3.2 PRD Step 11 写

```
| 11 | 删除 `importExport.ts:4` getShrinkedSettingsOnedriveFull import | `importExport.ts` |
```

**漏了**：
- `importExport.ts:11` getShrinkedSettingsOnedrive import（来自 `./fsOnedrive`，Step 1 删除后会编译失败）

### 3.3 修正

**Step 11 改为**：
```
| 11 | 删除 `importExport.ts:4 + 11` getShrinkedSettingsOnedriveFull + getShrinkedSettingsOnedrive import | `importExport.ts` |
```

---

## 4. P1 严重：manifest.json version 字段漏

### 4.1 实际 manifest.json

```json
{
  "id": "remotely-save",
  "name": "Remotely Save",
  "version": "0.5.25",
  "minAppVersion": "0.13.21",
  "description": "Yet another unofficial plugin...",
  "author": "fyears",
  "authorUrl": "https://github.com/fyears",
  "isDesktopOnly": false,
  "fundingUrl": "https://remotelysave.com"
}
```

### 4.2 PRD Step 28 写

```
| 28 | 修改 `manifest.json`：id→cstcloud-sync，name→cstcloud-sync，description 修改，删除 fundingUrl | `manifest.json` |
```

**漏了 `version` 字段**：
- 当前 `version: 0.5.25`（与上游一致）
- 改造后应该是 `1.0.0`（cstcloud-sync 独立版本）
- 否则 Obsidian 升级识别错误

### 4.3 修正

**Step 28 改为**：
```
| 28 | 修改 `manifest.json`：id→cstcloud-sync，name→cstcloud-sync，version→1.0.0，description 修改，删除 fundingUrl，authorUrl 改 cstcloud 仓库（如有） | `manifest.json` |
```

---

## 5. P2 中等：关键接口行号偏差

### 5.1 `getS3Client()` 行号

| 引用 | 范围 |
|---|---|
| PRD §5.3 写 | `fsS3.ts:230-254` |
| 实际 | `fsS3.ts:223-260`（getS3Client 函数定义 223 + new S3Client × 2 在 231/245 + closing brace 约 260） |
| 偏差 | ±7 行 |

**修正**：`fsS3.ts:230-254` → `fsS3.ts:223-260`

### 5.2 esbuild.config.mjs OAuth env 起始行

| 引用 | 范围 |
|---|---|
| PRD Step 30 写 | `L17-33 OAuth 环境变量` |
| 实际 | `L16-30`（15 个 const DEFAULT_..._APP_KEY 等） |
| 偏差 | ±1~3 行 |

**修正**：`L17-33` → `L16-30`

---

## 6. 第 1/2/3/4/5 次审验修复确认

| 修复 | 状态 |
|---|---|
| 4 项 NI-21~NI-24 + i18n | ✅ 齐全（行 148-150） |
| §2.3 追加 4 项 S3 开关 | ✅ 齐全（行 64-67） |
| §2.2 追加 3 行任务书原词 | ✅ 齐全（行 47/48/51） |
| 4 处字段名修正 | ✅ 0 错名 |
| §4.2 删 googleapis + koofr-api | ✅ 0 命中 |
| §5.1.E 改 ~194 + 13 类前缀 | ✅ 行 323 齐全 |
| §4.1 补充 18 个保留依赖 | ✅ 全部 1 命中 |
| Step 39 / 29 / 7 / 44 / AC8 5 处修正 | ✅ 全部生效 |
| §5.1.D 数量 + NI-5 | ✅ 行 316 / 158 齐全 |
| Step 35 行号 | ✅ 行 469 齐全 |
| §5.1.A 追加 3 文件 | ✅ 行 297-299 齐全 |
| NI 编号映射说明 | ✅ 行 125-150 齐全 |

**新发现**：
- 以上修复**全部生效**
- 但 tests/ + importExport 行 11 + manifest version + 关键接口行号是新发现的更深层问题

---

## 7. 任务书 46 项覆盖度（6 轮累计）

| 维度 | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| 任务书 46 项 | 42/46 | 46/46 | 46/46 | 46/46 | 46/46 | 46/46 |
| 任务书 10 条补充 | 10/10 | 10/10 | 10/10 | 10/10 | 10/10 | 10/10 |
| 字段名 | — | 2 错→修 | ✅ | ✅ | ✅ | ✅ |
| 行号（13 处抽） | — | ✅ | ✅ | ✅ | Step 35 修 | **❌ 3 处漏** |
| package.json | — | — | 2 虚+14 缺→修 | ✅ | ✅ | ✅ |
| i18n 数量 | — | — | 194 vs 62→修 | 同步 | ✅ | ✅ |
| 内部一致性 | — | — | — | 5 处修 | ✅ | ✅ |
| §5.1.D 文件数 | — | — | — | — | 29 文件修 | ✅ |
| NI 编号映射 | — | — | — | — | 修 | ✅ |
| §5.1.A 保留文件 | — | — | — | — | 漏 3→修 | ✅ |
| **tests/ 目录** | — | — | — | — | — | **❌ 完全漏** |
| **importExport.ts 完整清理** | — | — | — | — | — | **❌ 漏行 11** |
| **manifest.json version** | — | — | — | — | — | **❌ 漏** |

---

## 8. 抽样验证详情（本次新增 6 类）

| # | 抽样 | 实际 | PRD 引用 | 状态 |
|---|---|---|---|---|
| 1 | tests/ 目录 | 5 个测试文件 | §6 Step 1-44 全无 | ❌ P1 漏 |
| 2 | tests/fsWebdis.test.ts | 384B 引用 fsWebdis | Step 1 删 fsWebdis.ts 后必编译失败 | ❌ P1 漏 |
| 3 | importExport.ts 全部 fsOnedrive import | 行 4 + 行 11 | Step 11 只提行 4 | ❌ P1 漏 |
| 4 | manifest.json version | "0.5.25" | Step 28 没提 version | ❌ P1 漏 |
| 5 | fsS3.ts getS3Client 行号 | 223-260 | PRD 写 230-254 | ⚠️ P2 偏差 7 行 |
| 6 | esbuild OAuth env 起始行 | L16 | PRD 写 L17 | ⚠️ P2 偏差 1 行 |

---

## 9. 建议执行

| 优先级 | 动作 | 成本 |
|---|---|---|
| **P1-1 必做** | §6 Phase 1 追加 Step 1.5（删 tests/fsWebdis.test.ts） | 1 分钟 |
| **P1-2 必做** | Step 11 改"行 4 + 11 getShrinkedSettingsOnedriveFull + getShrinkedSettingsOnedrive" | 1 分钟 |
| **P1-3 必做** | Step 28 改"version→1.0.0" | 1 分钟 |
| **P2-1 可选** | §5.3 getS3Client 行号改 223-260 | 1 分钟 |
| **P2-2 可选** | Step 30 esbuild OAuth env 改 L16-30 | 1 分钟 |

老板拍板：
- **A**：让 ClaudeCode 修 3 处 P1（tests/ + importExport + manifest version）→ 同步副本
- **B**：A + 2 处 P2（getS3Client 行号 + esbuild OAuth env 行号）
- **C**：直接通过 PRD（实施时工程师会发现）

按老板"认真全面仔细"原则，建议**选项 A**。
