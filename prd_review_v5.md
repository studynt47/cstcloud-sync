# openclaw PRD v1.0 第 5 次审验报告

> 审验对象：`/root/.openclaw/Project/cstcloud-sync/PRD.md`（502 行 / 26KB / md5 `e5c5bf2c131e441398cdea556e38c0f4`，第 4 次审验 5 处修改后定稿版）
> 审验输入（仅 3 个）：
> 1. `/home/WPS/NEW/remotely_save.md`（任务书，3661 字节）
> 2. `/root/.openclaw/Project/cstcloud-sync/tech_v1.md`（技术分析 v1，36KB）
> 3. https://github.com/remotely-save/remotely-save（上游 + 浅克隆 `/home/WPS/ls/cstcloud-sync/`）
> 审验时间：2026-10-16（第 5 次，**重点深挖 §5.1 文件清单 + Step 行号 + NI 编号映射**）

---

## 1. 总体结论

**审验结果**：**第 4 次审验后定稿版通过 5 处修改，但发现 3 处 P1 数量/编号错误 + 1 处 P1 行号错 + 2 处遗漏**。

| 等级 | 问题数 | 严重性 |
|---|---|---|
| **P1 数量错** | **1 处** | §5.1.D 标题"26 个 .ts"实际 24 个 .ts + 1 个 .d.ts = 25 个 |
| **P1 NI 编号不对应任务书** | **1 处** | PRD NI-1~NI-24 共 24 项，任务书 46 项，PRD 没显式映射关系 |
| **P1 src/ 保留文件漏列** | **1 处** | §5.1.A 漏了 `fsGetter.ts` / `fsLocal.ts` / `fsMock.ts` |
| **P1 行号错** | **1 处** | Step 35 写"main.ts:488"实际是 main.ts:65（import 而非调用） |
| P2 遗漏 .github/ 改造 | 1 | `.github/ISSUE_TEMPLATE` + `workflows` 目录没提 |
| P2 遗漏 README 改造 | 1 | README.md 存在但 §6 没改造步骤 |
| P2 漏了 4 个 d.ts/文件 | 1 | `src/LICENSE`（奇怪） / `src/worker.d.ts` 已列但 `src/lang/zh.json` 等 |
| 第 1/2/3/4 次修复 | — | 全部生效 |

---

## 2. P1 严重：数量 / 编号 / 遗漏错误

### 2.1 §5.1.D 标题数量错

**实际 `pro/src/` 24 个 .ts + 1 个 .d.ts = 25 个源文件**（`ls pro/src/*.ts` 实测 25 个，含 koofrApi.d.ts 1 个 .d.ts + 24 个 .ts）。

**PRD §5.1.D 标题**：
```
#### D. pro/ 目录整体删除（26 个 .ts + langs/）
```

**实际**：
- 24 个 .ts（account / baseTypesPro / clearDupFiles / conflictLogic / fsAzureBlobStorage / fsBox / fsGoogleDrive / fsKoofr / fsOnedriveFull / fsPCloud / fsYandexDisk / localdb / oauth2 / settingsAzureBlobStorage / settingsBox / settingsClearDupFiles / settingsGoogleDrive / settingsKoofr / settingsOnedriveFull / settingsPCloud / settingsPro / settingsYandexDisk / sync / yandexApi）
- 1 个 .d.ts（koofrApi.d.ts）
- 4 个 langs（index.ts + 3 个 .json）
- **合计 29 个文件（24 ts + 1 d.ts + 4 langs）**

**修正**：
- 标题："26 个 .ts + langs/" → "**24 个 .ts + 1 个 .d.ts + 4 个 langs/ = 29 个文件**"

**附 NI-5 也写"26 个 .ts"**：NI-5 行 131 同样错（"PRO 全部（26 个 .ts + langs/）"）。

### 2.2 NI 编号不对应任务书 46 项

**任务书 46 项功能裁剪 + 10 条补充 = 56 项**。

**PRD §3.4 NI 表实际只有 24 项**（NI-1 ~ NI-24），没显式说明：
- 哪几个 NI 对应任务书哪个条目
- 任务书 22 项没合并到 NI（任务书 46 - PRD 24 = 22 项差异）

**风险**：
- 工程师无法从 PRD NI 编号反查任务书
- 任务书 46 项 vs PRD 24 项差异没说明 = 实施遗漏风险

**修正**：
- §3.4 顶部加映射说明："本节 24 个 NI 合并任务书 46 项功能裁剪，映射关系见附录 A 或 tech_v1.md"
- 或拆 NI 到 46 项，每项对应任务书一行

### 2.3 §5.1.A 保留文件漏列

**实际 `src/` 目录 27 个文件**（含 .ts / .d.ts）：

| 漏列 | 实际文件 | 用途 |
|---|---|---|
| ❌ **fsGetter.ts** | 2.5KB | fs 工厂（Step 7 改造对象） |
| ❌ **fsLocal.ts** | 5.6KB | 本地 vault 抽象 |
| ❌ **fsMock.ts** | 1.4KB | 测试 mock |
| ✅ main/settings/fsS3/... | — | 已列 22 个 |

**修正**：§5.1.A 追加 fsGetter.ts / fsLocal.ts / fsMock.ts 共 3 行。

---

## 3. P1 严重：Step 35 行号错

**Step 35 写**：
```
| 35 | 修改 `main.ts:488`：将 syncer import 改为从 `../src/sync` | `main.ts` |
```

**实际 main.ts:65**：
```typescript
import { syncer } from "../pro/src/sync";
```

**实际 main.ts:488**：
```typescript
await syncer(
  fsLocal, fsRemote, fsEncrypt, ...
);  // 是调用，不是 import
```

**main.ts:65 是 import，main.ts:488 是调用**。Step 35 描述"将 syncer import 改为"，应该是修改 import 行（main.ts:65），不是 main.ts:488。

**修正**：`main.ts:488` → `main.ts:65`

---

## 4. P2 遗漏：仓库根目录文件

### 4.1 `.github/` 目录

```
.github/ISSUE_TEMPLATE/   （存在）
.github/workflows/         （存在）
```

**PRD 完全没提**这 2 个目录的改造：
- ISSUE_TEMPLATE 是 GitHub Issue 模板（提到各云服务的支持说明）
- workflows 是 GitHub Actions CI（测试各云服务）

**建议**：Step 5 整体删 pro/ 时，**追加"删除 .github/workflows/ 中 cloud 服务测试 workflow"**（或在 §5.1 新建 §5.1.G 仓库根目录处理）。

### 4.2 `README.md`

**README.md 存在**（11KB），含上游 URL + 各云服务安装说明 + 截图等。

**PRD §1 提到"上游 URL: https://github.com/...remotely-save"**（行 163），但 §6 实施步骤**完全没提 README 改造**。

**风险**：
- 实施后 README 还是引用 remotely-save，文档不一致
- 用户看 README 会困惑（README 提到 8 个云服务，但插件只支持 S3）

**建议**：
- §6 追加 Step 45：修改 README.md（替换为 cstcloud-sync 说明）
- 或 §6 追加 Step 45：删除 README.md（重建或不动）

### 4.3 `src/LICENSE` 异常

**实际 src/LICENSE 11KB**（这不是个 .ts 源文件，但 ls 出来像是 .ts）。

让我看一下：
- README.md / LICENSE 在根目录
- src/LICENSE 也在 src/ 目录（11KB）— 可能是被错误放置的 Apache-2.0 LICENSE

**风险**：build 工具可能错误把它当 .ts 编译。

---

## 5. 第 1/2/3/4 次审验修复确认

| 修复 | 状态 |
|---|---|
| 4 项 NI-21~NI-24 + i18n | ✅ 齐全（行 147-150） |
| §2.3 追加 4 项 S3 开关 | ✅ 齐全（行 64-67） |
| §2.2 追加 3 行任务书原词 | ✅ 齐全（行 47/48/51） |
| 4 处字段名修正 | ✅ 0 错名 |
| §4.2 删 googleapis + koofr-api | ✅ 0 命中 |
| §5.1.E 改 ~194 + 13 类前缀 | ✅ 行 323 齐全 |
| §4.1 补充 18 个保留依赖 | ✅ 全部 1 命中 |
| Step 39 / 29 / 7 / 44 / AC8 5 处修正 | ✅ 全部生效（旧值 0 命中） |

**新发现问题**：以上修复**全部生效**，但 §5.1.D 数量错 / §5.1.A 漏列 / Step 35 行号错 / NI 编号映射缺说明是新发现的更深层问题。

---

## 6. 任务书 46 项覆盖度（5 轮累计）

| 维度 | 第 1 | 第 2 | 第 3 | 第 4 | 第 5 |
|---|---|---|---|---|---|
| 任务书 46 项 | 42/46 | 46/46 | 46/46 | 46/46 | 46/46 |
| 任务书 10 条补充 | 10/10 | 10/10 | 10/10 | 10/10 | 10/10 |
| 字段名 | — | 2 错→修 | ✅ | ✅ | ✅ |
| 行号（13 处抽） | — | ✅ | ✅ | ✅ | **❌ Step 35 错** |
| **package.json 依赖** | — | — | 2 虚+14 缺→修 | ✅ | ✅ |
| **i18n 实际数量** | — | — | 194 vs 62→修 | Step 39 同步 | ✅ |
| **§4.2 → Step 29 同步** | — | — | — | 修 | ✅ |
| **fsGetter case 数** | — | — | — | 11→12 修 | ✅ |
| **§5.1.D 文件数** | — | — | — | — | **❌ 26 vs 25** |
| **NI 编号映射** | — | — | — | — | **❌ 24 vs 46** |
| **§5.1.A 保留文件** | — | — | — | — | **❌ 漏 3 个** |
| **.github/ README 改造** | — | — | — | — | **❌ 漏** |

---

## 7. 抽样验证详情（本次新增 8 类）

| # | 抽样 | 实际 | PRD 引用 | 状态 |
|---|---|---|---|---|
| 1 | pro/src/*.ts 数量 | 25（含 .d.ts） | §5.1.D 标题"26 个 .ts" | ❌ P1 数量错 |
| 2 | NI 编号 | 24 项 | 任务书 46 项 | ❌ P1 映射缺 |
| 3 | §5.1.A 保留文件 | 22 个 | 漏 fsGetter/fsLocal/fsMock | ❌ P1 漏列 |
| 4 | Step 35 行号 | main.ts:65（import） | "main.ts:488" | ❌ P1 错 |
| 5 | .github/ 目录 | 存在 | §6 没提 | ⚠️ P2 漏 |
| 6 | README.md | 存在（11KB） | §6 没提改造 | ⚠️ P2 漏 |
| 7 | main.ts:488 内容 | `await syncer(...)` 调用 | "syncer import" | ❌ P1 错 |
| 8 | src/LICENSE | 11KB（异常） | 没提 | ⚠️ P2 异常 |

---

## 8. 建议执行

| 优先级 | 动作 | 成本 |
|---|---|---|
| **P1-1 必做** | §5.1.D 标题改"24 个 .ts + 1 个 .d.ts + 4 个 langs/ = 29 个文件" + NI-5 同步 | 1 分钟 |
| **P1-2 必做** | Step 35 改"main.ts:488" → "main.ts:65"（import 行） | 1 分钟 |
| **P1-3 必做** | §5.1.A 追加 fsGetter.ts / fsLocal.ts / fsMock.ts 共 3 行 | 1 分钟 |
| **P1-4 必做** | §3.4 顶部加 NI ↔ 任务书 46 项映射说明 | 3 分钟 |
| **P2-1 可选** | §6 追加 Step 45 处理 .github/workflows/ | 1 分钟 |
| **P2-2 可选** | §6 追加 Step 46 改/删 README.md | 1 分钟 |
| **P2-3 可选** | §5.1.A 标注 src/LICENSE 异常 | 1 分钟 |

老板拍板：
- **A**：让 ClaudeCode 修 4 处 P1（§5.1.D / Step 35 / §5.1.A / NI 映射）→ 同步副本
- **B**：A + 3 处 P2（Step 45/46/LICENSE 异常）
- **C**：直接通过 PRD（实施时工程师会发现）

按老板"认真全面仔细"原则，建议**选项 A**。
