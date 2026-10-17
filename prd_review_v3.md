# openclaw PRD v1.0 第 3 次审验报告

> 审验对象：`/root/.openclaw/Project/cstcloud-sync/PRD.md`（486 行 / 25KB / md5 `9953e6ce078eb2fa39637a554a21374d`，第 2 次审验字段名修正后定稿版）
> 审验输入（仅 3 个）：
> 1. `/home/WPS/NEW/remotely_save.md`（任务书，3661 字节）
> 2. `/root/.openclaw/Project/cstcloud-sync/tech_v1.md`（技术分析 v1，36KB）
> 3. https://github.com/remotely-save/remotely-save（上游 + 浅克隆 `/home/WPS/ls/cstcloud-sync/`）
> 审验时间：2026-10-16（第 3 次，**重点深挖依赖完整性 + i18n 实际数量**）

---

## 1. 总体结论

**审验结果**：**第 2 次审验后定稿版通过字段名修复，但发现 2 处 P1 严重问题（package.json 虚构删除 + i18n key 实际数量远超）**。

| 等级 | 问题数 | 严重性 |
|---|---|---|
| **P1 package.json 虚构删除** | **2 项** | `googleapis` / `koofr-api` 不在 package.json，但 PRD §4.2 列为"删除" |
| **P1 i18n key 实际远超** | **~200 待删 vs PRD 说 62** | 工程师按 62 删除会漏 |
| P2 保留依赖不完整 | ~14 项 transitive 依赖缺失 | 工程师不知道哪些保留 |
| 第 1/2 次修复 | — | P1+P2 修复 + 字段名修正已生效 |

---

## 2. P1 严重：package.json §4.2 虚构删除项

### 2.1 实际 package.json dependencies/devDependencies

| 类型 | 实际存在 |
|---|---|
| dependencies | 41 个 |
| devDependencies | 13 个 |

### 2.2 PRD §4.2 删除列表核对

| PRD §4.2 列出 | 实际 package.json | 状态 |
|---|---|---|
| `@azure/msal-node` | ✓ 存在 | ✅ |
| `@microsoft/microsoft-graph-client` | ✓ 存在 | ✅ |
| `@microsoft/microsoft-graph-types` | ✓ 存在（devDeps） | ✅ |
| `box-typescript-sdk-gen` | ✓ 存在 | ✅ |
| `dropbox` | ✓ 存在 | ✅ |
| `pcloud-sdk-js` | ✓ 存在 | ✅ |
| `webdav` | ✓ 存在 | ✅ |
| **`googleapis`** | **❌ 不存在** | **❌ P1 虚构** |
| `koofr-api` | ❌ 不存在 | ❌ P1 虚构 |
| `@azure/storage-blob` | ✓ 存在 | ✅ |

**8 项真实 + 2 项虚构**（`googleapis` / `koofr-api`）。

**实际原因**：这两个包被 PRO 目录 `pro/src/*.ts` 直接 `import`，但不在根 `package.json`，因为 PRO 是个独立子项目。**工程师按 PRD §4.2 找不到这两个包**（grep 整个项目都找不到 `googleapis` 字面）。

**修正方案**：
- §4.2 删除列表中**删除 `googleapis` 和 `koofr-api`**
- §5.1.D pro/ 整目录删除已包含这 2 个的 `import` 引用清除（Step 5）

### 2.3 PRD §4.1 保留列表不完整

PRD §4.1 列出 20 个保留依赖，但实际 package.json dependencies 41 个中**至少 14 个 PRD 未列**：

| PRD 未列的保留依赖 | 用途推测 |
|---|---|
| `@smithy/fetch-http-handler` | AWS SDK transitive |
| `@smithy/protocol-http` | AWS SDK transitive |
| `@smithy/querystring-builder` | AWS SDK transitive |
| `acorn` | 编译工具 |
| `assert` | polyfill |
| `aws-crt` | AWS CRT 绑定 |
| `emoji-regex` | 工具 |
| `http-status-codes` | 工具 |
| `localforage-getitems` | localforage 扩展 |
| `localforage-removeitems` | localforage 扩展 |
| `lucide` | 图标库（ribbon icon 用） |
| `node-diff3` | 3-way merge 算法 |
| `openapi-fetch` | OpenAPI 客户端 |
| `process` / `rimraf` / `stream-browserify` / `url` / `util` | Node polyfill |

**风险**：
- 工程师按 §4.1 列表 + §4.2 列表核对，可能误删 transitive 依赖
- 实际 S3 适配器需要 `@smithy/*` + `aws-crt`，删了会编译失败

**修正方案**：
- §4.1 补充完整保留依赖清单（41 个全部列）
- 或改为"除 §4.2 列出 8 个外，其余保留"的反向描述

---

## 3. P1 严重：i18n key 实际远超 PRD 描述

### 3.1 实际数据

`src/langs/en.json` 总 **374 个 key**，按需删前缀统计：

| 待删前缀 | 命中 key 数 | 备注 |
|---|---|---|
| `dropbox` | 36 | Dropbox + DropBoxAuth + DropBox Protocol |
| `onedrive` | 34 | Onedrive + OnedriveAuth + OnedriveRevoke + Protocol |
| `pro` | 27 | PRO 各种 Setting |
| `webdav` | 24 | WebDAV |
| `syncplans` | 16 | 同步计划历史（任务书行 39-40） |
| `webdis` | 14 | Webdis |
| `password` | 12 | 端到端加密（任务书补充 3） |
| `remoteprefix` | 9 | **NI-22 `remotePrefix` 对应 Modal**（PRD §3.4 漏了 i18n 删除） |
| `remotebasedir` | 8 | 反向代理/远程基址 Modal |
| `encrypt` | 6 | 加密 UI |
| `chooseService` | 3 | 服务选择 dropdown（任务书 1 硬编码） |
| `export_` | 3 | 导出（任务书 39） |
| `box` | 2 | Box（PRO 删） |
| **合计** | **~194 个 key 待删** | **PRD §5.1.E 只说"62 类"** |

### 3.2 PRD §5.1.E vs 实际

- PRD 写："删除 62 类 PRO/cloud i18n key"
- 实际：~194 个 key 涉及删除（按前缀分类约 13 类，但每类含多个 key）

**风险**：
- 工程师按 "62" 删除会漏 ~130 个 key
- 残留 i18n key 不会编译报错，但运行时 `t()` 函数可能 missing key（PRD R6 已识别此风险）
- 实际上 R6 应升级为 P1 风险

### 3.3 额外发现

**`modal_remoteprefix_*` 有 9 个 i18n key**（对应 NI-22 `remotePrefix`），但 PRD §3.4 NI-22 **没提 i18n key 删除**。

**`modal_remotebasedir_*` 有 8 个 i18n key**（对应 NI-23 `reverseProxyNoSignUrl`），但 PRD §3.4 NI-23 **也没提 i18n key 删除**。

**修正方案**：
- §3.4 NI-22 / NI-23 追加"i18n key 全删（modal_remoteprefix_* / modal_remotebasedir_*）"
- §5.1.E 改为具体数字（~194 个 key）+ 列出 13 类前缀
- §6 实施步骤 Step 39 改为"删除 ~194 个 PRO/cloud i18n key"

---

## 4. 第 1/2 次审验修复确认

| 修复 | 状态 |
|---|---|
| 4 项 NI-21~NI-24 追加 | ✅ 齐全（行 146-149） |
| §2.3 追加 4 项 S3 开关 | ✅ 齐全（行 64-67） |
| §2.2 追加 3 行任务书原词 | ✅ 齐全（行 47/48/51） |
| 4 处字段名修正（remotePrefix / reverseProxyNoSignUrl） | ✅ 错名 0 命中，新名 2+2 命中（行 66/67/148/149） |

---

## 5. 任务书 46 项覆盖度（最终）

| 维度 | 第 1 次 | 第 2 次 | 第 3 次 |
|---|---|---|---|
| 任务书 46 项覆盖 | 42/46 | 46/46 | 46/46 |
| 任务书 10 条补充 | 10/10 | 10/10 | 10/10 |
| 字段名准确性 | 未抽检 | 2 处错 | ✅ 已修 |
| 行号准确性 | 未抽检 | 13 处抽检 | 13 处抽检 |
| **package.json 依赖完整性** | 未抽检 | 未抽检 | **2 虚构 + 14 缺失** |
| **i18n key 实际数量** | 未抽检 | 未抽检 | **194 vs 62** |

---

## 6. 抽样验证详情（本次新增 5 类）

| # | 抽样 | 实际 | PRD 引用 | 状态 |
|---|---|---|---|---|
| 1 | `pro/package.json` | ❌ 不存在 | 隐含 PRO 是独立包 | ⚠️ |
| 2 | `package.json` googleapis | ❌ 不存在 | §4.2 列入"删除" | ❌ P1 虚构 |
| 3 | `package.json` koofr-api | ❌ 不存在 | §4.2 列入"删除" | ❌ P1 虚构 |
| 4 | `package.json` @smithy/* | 3 个 | §4.1 未列 | ⚠️ P2 缺 |
| 5 | `en.json` key 数 | 374 个 / ~194 待删 | §5.1.E 说 62 类 | ❌ P1 数量错 |

---

## 7. 建议执行

| 优先级 | 动作 | 成本 |
|---|---|---|
| **P1-1 必做** | §4.2 删除 `googleapis` + `koofr-api`（不存在） | 1 分钟 |
| **P1-2 必做** | §5.1.E 改为具体数字（~194 个 key + 13 类前缀） | 3 分钟 |
| **P1-3 必做** | §3.4 NI-22 / NI-23 追加 i18n key 删除说明 | 1 分钟 |
| **P2 可选** | §4.1 补充完整 41 个保留依赖 | 5 分钟 |
| **P2 可选** | R6 升级为 P1 风险 | 1 分钟 |

老板拍板：
- **A**：让 ClaudeCode 修 P1-1 + P1-2 + P1-3 → openclaw 评审 + 同步副本
- **B**：只修 P1-1 + P1-2（最关键）
- **C**：A + P2 全部

按老板"认真全面仔细"原则，建议**选项 A**（5 行替换/补充）。
