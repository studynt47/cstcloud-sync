# openclaw PRD v1.0 第 4 次审验报告

> 审验对象：`/root/.openclaw/Project/cstcloud-sync/PRD.md`（502 行 / 26KB / md5 `f7a9427efc48d0295c491dbe66268c33`，第 3 次审验 P1+P2 修复后定稿版）
> 审验输入（仅 3 个）：
> 1. `/home/WPS/NEW/remotely_save.md`（任务书，3661 字节）
> 2. `/root/.openclaw/Project/cstcloud-sync/tech_v1.md`（技术分析 v1，36KB）
> 3. https://github.com/remotely-save/remotely-save（上游 + 浅克隆 `/home/WPS/ls/cstcloud-sync/`）
> 审验时间：2026-10-16（第 4 次，**重点深挖内部一致性** + **实施步骤代码位置**）

---

## 1. 总体结论

**审验结果**：**第 3 次审验后定稿版通过 P1+P2 修复，但发现 3 处 P1 内部数字不一致 + 1 处 P1 case 数错**。

| 等级 | 问题数 | 严重性 |
|---|---|---|
| **P1 内部数字不一致** | **3 处** | §5.1.E 改后 Step 39 / Step 29 / Step 7 未同步 |
| **P1 case 数错** | **1 处** | Step 7 写"11 个 case"实际 12 个（含 onedrivefull） |
| P2 表述不准 | 1 | Step 44 写"cloud expire check"实际是 OAuth expire check |
| P2 验收不完整 | 1 | AC8 只验证 serviceType，没验证 syncOnSave 等其他强制覆盖 |
| 第 1/2/3 次修复 | — | 全部生效 |

---

## 2. P1 严重：内部数字不一致（3 处）

### 2.1 Step 39 数字未同步

**§5.1.E 已改**（第 3 次审验后）：
```
| `src/langs/en.json` | 删除 ~194 个 PRO/cloud i18n key，13 类前缀... |
```

**Step 39 仍写**（未同步）：
```
| 39 | 改造 `langs/en.json` + `zh_cn.json` + `zh_tw.json`：删除 62 类 PRO/cloud key | `src/langs/*.json` |
```

**风险**：
- 工程师按 Step 39 删除 62 类会漏 ~130 个 key
- §5.1.E 和 Step 39 自相矛盾

**修正**：`删除 62 类` → `删除 ~194 个 PRO/cloud i18n key`

### 2.2 Step 29 数字不一致

**§4.2 已改**（第 3 次审验后）：**8 项**删除（删了 googleapis + koofr-api）

**Step 29 仍写**：
```
| 29 | 修改 `package.json`：name→cstcloud-sync，license→Apache-2.0，**删除 9 个云服务依赖** | `package.json` |
```

**修正**：`删除 9 个云服务依赖` → `删除 8 个云服务依赖`

### 2.3 Step 7 case 数错

**实际 fsGetter.ts 12 个 case**（grep 验证）：
```typescript
switch (settings.serviceType) {
  case "s3": ...
  case "webdav": ...
  case "dropbox": ...
  case "onedrive": ...
  case "onedrivefull": ...   // ← PRD 漏了
  case "webdis": ...
  case "googledrive": ...
  case "box": ...
  case "pcloud": ...
  case "yandexdisk": ...
  case "koofr": ...
  case "azureblobstorage": ...
}
```

**PRD §3.4 / §5.1.F** 都按 11 云（free 4 + PRO 7）= 11 描述

**Step 7 写**：
```
| 7 | 删除 `fsGetter.ts` 所有 pro/src/ import 和 **11 个 case 分支** | `fsGetter.ts` |
```

**修正**：`11 个 case 分支` → `12 个 case 分支（含 onedrivefull）`

---

## 3. P2 中等：表述不准

### 3.1 Step 44 表述

**Step 44 写**：
```
| 44 | 修改 `main.ts:553`：删除所有 **cloud expire check** | `main.ts` |
```

**实际 main.ts:553**：
```typescript
await this.checkIfOauthExpires();
```

**实际是 OAuth token expire check，不是 cloud expire check**（前者是 OAuth 刷新，后者是云服务 token 过期）

**修正**：`cloud expire check` → `OAuth expire check (checkIfOauthExpires)`

### 3.2 AC8 验收不完整

**AC8 写**：
```
| AC8 | 插件加载后 `data.json` 中 `serviceType` 被强制覆盖为 `"s3"`（旧配置升级） | 首次加载后读取 data.json |
```

**实际 PRD §3.1 P0-13 + P0-14 + Step 33 强制覆盖 5 项**：
- `serviceType = "s3"`
- `syncOnSaveAfterMilliseconds = -1`
- `ignorePaths = []`
- `onlyAllowPaths = []`
- `currLogLevel = "info"`

**AC8 只验证 serviceType，缺其他 4 项验证**。

**修正**：AC8 改为"插件加载后 data.json 中 5 项关键字段（serviceType/syncOnSave/ignorePaths/onlyAllowPaths/currLogLevel）被强制覆盖"。

---

## 4. 第 1/2/3 次审验修复确认

| 修复 | 状态 |
|---|---|
| 4 项 NI-21~NI-24 + i18n key 追加 | ✅ 齐全（行 148-149） |
| §2.3 追加 4 项 S3 开关 | ✅ 齐全（行 64-67） |
| §2.2 追加 3 行任务书原词 | ✅ 齐全（行 47/48/51） |
| 4 处字段名修正 | ✅ 错名 0 命中（行 66/67/148/149） |
| §4.2 删 googleapis + koofr-api | ✅ 0 命中 |
| §5.1.E 改 ~194 + 13 类前缀 | ✅ 行 323 齐全 |
| §4.1 补充 18 个保留依赖 | ✅ 全部 1 处命中 |

**新发现问题**：以上修复**导致 §5.1.E、§4.2、§4.1 已更新，但 §6 Step 39 / Step 29 / Step 7 未同步更新**。

---

## 5. 任务书 46 项覆盖度（最终）

| 维度 | 第 1 | 第 2 | 第 3 | 第 4 |
|---|---|---|---|---|
| 任务书 46 项覆盖 | 42/46 | 46/46 | 46/46 | 46/46 |
| 任务书 10 条补充 | 10/10 | 10/10 | 10/10 | 10/10 |
| 字段名准确性 | 未抽 | 2 错 → 已修 | ✅ | ✅ |
| 行号准确性 | 未抽 | 13 处抽 | 13 处抽 | 13 处抽 |
| **package.json 依赖** | 未抽 | 未抽 | 2 虚+14 缺 → 已修 | ✅ |
| **i18n key 实际数量** | 未抽 | 未抽 | 194 vs 62 → 已修 | ⚠️ Step 39 未同步 |
| **§4.2 → §6 Step 29 数字同步** | — | — | — | **❌ 未同步** |
| **fsGetter case 数** | — | — | — | **❌ 11 vs 12** |

---

## 6. 抽样验证详情（本次新增 5 类）

| # | 抽样 | 实际 | PRD 引用 | 状态 |
|---|---|---|---|---|
| 1 | `Step 39` 数字 | "删除 62 类" | §5.1.E 已改 ~194 | ❌ P1 未同步 |
| 2 | `Step 29` 数字 | "删除 9 个" | §4.2 已改 8 个 | ❌ P1 未同步 |
| 3 | `Step 7` case 数 | 12 个（含 onedrivefull） | "11 个" | ❌ P1 错 |
| 4 | `Step 44` 行号 | main.ts:553 是 checkIfOauthExpires | "cloud expire check" | ⚠️ P2 表述 |
| 5 | `fsGetter.ts` case 清单 | s3/webdav/dropbox/onedrive/onedrivefull/webdis/googledrive/box/pcloud/yandexdisk/koofr/azureblobstorage | 漏 onedrivefull | ❌ 漏列 |

---

## 7. 建议执行

| 优先级 | 动作 | 成本 |
|---|---|---|
| **P1-1 必做** | Step 39 改"删除 62 类" → "删除 ~194 个" | 1 分钟 |
| **P1-2 必做** | Step 29 改"删除 9 个" → "删除 8 个" | 1 分钟 |
| **P1-3 必做** | Step 7 改"11 个 case" → "12 个 case（含 onedrivefull）" | 1 分钟 |
| **P2-1 可选** | Step 44 改"cloud expire check" → "OAuth expire check (checkIfOauthExpires)" | 1 分钟 |
| **P2-2 可选** | AC8 扩展为 5 项强制覆盖验证 | 1 分钟 |

老板拍板：
- **A**：让 ClaudeCode 修 3 处 P1 → openclaw 评审 + 同步副本
- **B**：修 3 处 P1 + 2 处 P2 全部
- **C**：A + B 合并

按老板"认真全面仔细"原则，建议**选项 B**（5 行替换，5 分钟）。
