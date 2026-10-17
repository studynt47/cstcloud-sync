# PRD v1.1

> 项目 cstcloud-sync 计划书 v1.1
> 基于：remotely-save v0.5.25（Apache-2.0）+ 任务书 /home/WPS/NEW/remotely_save.md + 技术分析 tech_v1.md

**当前版本**：v1.1
**生成时间**：2026-10-16
**修订时间**：2026-10-17
**状态**：定稿待评审

---

## 修订记录

| 版本 | 修订时间 | 变更点 |
|---|---|---|
| v1.0 | 2026-10-16 | 初始版本，基于 remotly-save v0.5.25 改造为 cstcloud-sync |
| <u>v1.1</u> | <u>2026-10-17</u> | <u>① 弹窗文案改 3 langs × 6 键（langs 3 文件 + §5.1.A syncAlgoV3Notice.ts / §6 Step45~47 系列 / §9 AC9）</u> |
| | | <u>② 删除"导入导出部分设置"功能（§3.4 NI-12 删 / §5.1 A 类文件 / §6 Step48~54 / §9 AC10）</u> |
| | | <u>③ 删除"调试-删除同步计划历史"功能 + 删 debugMode.ts（§3.2 P1-13/14 删 / §3.4 NI-12 删 / §5.1 A 类文件 / §6 Step55~58 / §9 AC10）</u> |

---

## 1. 项目概述

| 项目 | 值 |
|---|---|
| 产品名 | `cstcloud-sync` |
| 上游 | remotely-save v0.5.25（Apache-2.0，fyears） |
| 上游 URL | https://github.com/remotely-save/remotely-save |
| 源码路径 | `/home/WPS/ls/cstcloud-sync/` |
| plugin-id | `remotely-save` → `cstcloud-sync` |
| package 名 | `remotely-save` → `cstcloud-sync` |
| License | `Apache-2.0` |
| 目标 endpoint | `s3.cstcloud.cn`（硬编码） |
| S3 URL style | Path-Style（hardcoded `forcePathStyle=true`） |
| 目标 | 将 upstream 改造为仅支持 S3（cstcloud.cn）的 Obsidian 同步插件，删除所有其他云服务 UI、OAuth、PRO 功能 |

**成功标准**：Obsidian 插件商店可安装；用户配置 AccessKey/SecretKey/Bucket 后完成双向同步。

---

## 2. 用户与场景

### 2.1 目标用户

- 使用 Obsidian 的个人用户
- 有 cstcloud.cn S3 账号（对象存储）
- 需要将笔记双向同步到私有 S3

### 2.2 核心使用场景

| 场景 | 描述 |
|---|---|
| 配置 S3 账号 | 用户输入 AccessKey / SecretKey / Bucket，点击"检查连接"验证 |
| 手动同步 | 用户点击 ribbon 图标或命令面板 `start-sync` 触发同步 |
| 自动定时同步 | 设置每 N 分钟自动同步（autoRunEveryMilliseconds） |
| 启动后首次同步 | 设置 Obsidian 启动后 N 分钟自动同步（initRunAfterMilliseconds） |
| 冲突处理 | 文件双向修改时按策略（保留本地/远程/智能冲突）处理 |
| 旧 data.json 兼容 | 旧 data.json（含 PRO 字段）仅兼容 free 字段；启动时强制覆盖 serviceType="s3" |
| 自动同步 schedule loop | 保留自动同步的 schedule loop（autoRunEveryMilliseconds + enableAutoSyncIfSet） |
| 状态栏显示 | 状态栏显示上次成功同步时间 |
| Status bar 状态栏 | 保留 Status bar 状态栏显示上次成功同步时间 |

### 2.3 非场景（明确不实现）

- OneDrive / Dropbox / WebDAV / Webdis 同步
- Google Drive / Box / pCloud / Yandex Disk / Koofr / Azure Blob Storage 同步
- OAuth 第三方登录（Dropbox/OneDrive/Google 等）
- PRO 账号体系
- 端到端加密 UI（密码设置界面）
- 导入/导出设置（QR / URI）
- 导出同步计划
- 性能分析 profiler UI
- 调试日志级别修改
- 保存时自动触发同步（syncOnSave）
- S3 准确修改时间（useAccurateMTime）
- S3 远端前缀路径（remotePrefix）
- S3 反向代理（reverseProxyNoSignUrl）
- S3 生成文件夹 Object（generateFolderObject）

---

## 3. 功能需求

### 3.1 P0 必含（未实装则核心流程不通）

| # | 功能 | 代码位置 | 说明 |
|---|---|---|---|
| P0-1 | S3 同步核心（读/写/删除） | `src/fsS3.ts` 全文 | 保留 fsS3 全部逻辑 |
| P0-2 | 文件 diff + copy 逻辑 | `src/copyLogic.ts` 全文 | 双向 diff 算法 |
| P0-3 | 设置 UI（S3 三字段） | `settings.ts:927-967` | AccessKey / SecretKey / Bucket 输入框 |
| P0-4 | 检查连接按钮 | `settings.ts:1125-1148` | `settings_checkonnectivity` |
| P0-5 | Ribbon 图标 + 触发同步 | `main.ts:1171-1175` | 点击 `this.syncRun("manual")` |
| P0-6 | 命令面板 start-sync / dry-run | `main.ts:1213-1227` | `start-sync` / `start-sync-dry-run` 命令 |
| P0-7 | 同步方向设置 | `settings.ts:2500-2531` | `setting_syncdirection`（含双向/单向/仅下载/仅上传） |
| P0-8 | 冲突处理策略 | `settings.ts:2387-2424` | 含 smart_conflict |
| P0-9 | 自动定时同步 loop | `main.ts:1757-1771` | `enableAutoSyncIfSet()` |
| P0-10 | 启动后自动同步 | `main.ts:1773-1785` | `enableInitSyncIfSet()` |
| P0-11 | 状态栏显示上次同步时间 | `main.ts:1180-1210`, `main.ts:1925-2031` | 30 秒轮询更新 |
| P0-12 | 数据持久化（data.json 读写） | `src/configPersist.ts` + `main.ts:1338-1512` | 含加密混淆存储 |
| P0-13 | 强制 `serviceType="s3"` | `main.ts:129`, `baseTypes.ts:30-42` | 启动时强制覆盖旧配置 |
| P0-14 | 强制 `syncOnSaveAfterMilliseconds=-1` | `main.ts:loadSettings()` | 兼容旧配置 |

### 3.2 P1 保留可配置（提供 UI 入口）

| # | 功能 | Setting ID | 代码位置 |
|---|---|---|---|
| P1-1 | 分块并行度（partsConcurrency） | `settings_s3_parts` | `settings.ts:1015-1034` |
| P1-2 | 自动运行间隔（autoRunEveryMilliseconds） | `settings_autorun` | `settings.ts:2088-2124` |
| P1-3 | 启动后自动运行（initRunAfterMilliseconds） | `settings_runoncestartup` | `settings.ts:2126-2150` |
| P1-4 | 跳过大文件（skipSizeLargerThan） | `settings_skiplargefiles` | `settings.ts:2175-2189` |
| P1-5 | 状态栏显示开关（enableStatusBarInfo） | `settings_enablestatusbar_info` | `settings.ts:2193-2204` |
| P1-6 | 重设状态栏时间记录 | `settings_resetstatusbar_time` | `settings.ts:2206-2227` |
| P1-7 | 并行度（concurrency） | `settings_concurrency` | `settings.ts:2279-2298` |
| P1-8 | 同步下划线文件（syncUnderscoreItems） | `settings_syncunderscore` | `settings.ts:2300-2314` |
| P1-9 | 同步配置文件夹（syncConfigDir） | `settings_configdir` | `settings.ts:2316-2347` |
| P1-10 | 同步书签（syncBookmarks） | `settings_bookmarks` | `settings.ts:2349-2368` |
| P1-11 | 删除到系统回收站/Obsidian .trash | `settings_deletetowhere` | `settings.ts:2370-2385` |
| P1-12 | 保护修改百分比（protectModifyPercentage） | `settings_protectmodifypercentage` | `settings.ts:2428-2498` |
| <u>P1-13</u> | <u>删除同步计划历史</u> | <u>`settings_delsyncplans`</u> | <u>`settings.ts:829-835`（<u>v1.1 删除</u>）</u> |
| <u>P1-14</u> | <u>删除上次同步明细</u> | <u>`settings_delprevsync`</u> | <u>`settings.ts:840-849`（<u>v1.1 删除</u>）</u> |

### 3.3 P2 硬编码（代码存在但 UI 不显示）

| # | 字段 | 硬编码值 | 位置 |
|---|---|---|---|
| P2-1 | `serviceType` | `"s3"` | `main.ts:129` DEFAULT_SETTINGS；`baseTypes.ts:30-42` |
| P2-2 | `s3.s3Endpoint` | `"s3.cstcloud.cn"` | `fsS3.ts:179-192` DEFAULT_S3_CONFIG |
| P2-3 | `s3.s3Region` | `"us-east-1"` | `fsS3.ts:179-192` DEFAULT_S3_CONFIG |
| P2-4 | `s3.forcePathStyle` | `true` | `fsS3.ts:179-192` DEFAULT_S3_CONFIG 写死；`settings.ts:968-987` UI dropdown 删除（Step 42） |
| P2-5 | `currLogLevel` | `"info"` | `main.ts:130` DEFAULT_SETTINGS |
| P2-6 | `obfuscateSettingFile` | `true` | `main.ts:152` DEFAULT_SETTINGS |

**说明**：本节 6 项 P2 字段硬编码，任务书补充 10 条（OneDrive free / WebDAV / Dropbox / Webdis / 端到端加密 / 旧 data.json / msal-browser / pro/ 整目录 / ribbon / 命令面板 / schedule / Status bar）已全部合并到 §2.1/§2.2/§2.3/§3.1/§3.2/§3.4/§4.2/§5.1.D，剩余 0 条未映射。

### 3.4 删除功能（不保留代码）

**NI 编号说明**：本节 24 个 NI 合并任务书 46 项功能裁剪（`/home/WPS/NEW/remotely_save.md`），不一一对应任务书每行。<u>另有 2 项 P1 调试功能（删除同步计划历史 / 删除上次同步明细 + debugMode.ts）非独立 NI，随 debugMode.ts 删除一并清理（v1.1）。</u>

| PRD NI | 任务书条目 | 说明 |
|---|---|---|
| NI-1 | OneDrive free | 一对一 |
| NI-2 | WebDAV | 一对一 |
| NI-3 | Dropbox | 一对一 |
| NI-4 | Webdis | 一对一 |
| NI-5 | PRO 全部 | 一对多（PRO 32 文件） |
| NI-6 + NI-7 | 端到端加密 UI + 字段 | 二对一 |
| NI-8 | syncOnSaveAfterMilliseconds | 一对一 |
| NI-9 | ignorePaths / onlyAllowPaths | 一对一 |
| NI-10 | 导出同步计划按钮 | 一对一 |
| NI-11 | profiler UI | 一对一 |
| NI-12 | 导入/导出设置 | 一对一（v1.0 删 UI；v1.1 进一步删 `importExport.ts` 全文 + `ExportSettingsQrCodeModal` 整类 + `QRExportType` 类型） |
| NI-13 | 修改日志级别 UI | 一对一 |
| NI-14 | 混淆设置文件 UI | 一对一 |
| NI-15 | 查看终端输出 UI | 一对一 |
| NI-16 | 输出 vault ID | 一对一 |
| NI-17 | 重设本地缓存 | 一对一 |
| NI-18 | clear dup files | 一对一 |
| NI-19 | OAuth 环境变量 | 一对一 |
| NI-20 | 端到端加密 Modal | 一对一 |
| NI-21~NI-24 | S3 可选字段 | 一对一（useAccurateMTime / remotePrefix / reverseProxyNoSignUrl / generateFolderObject） |

**任务书剩余 22 项**（行 11-15 / 23-30 / 38-46 等）已合并到 §2.1 硬编码规则、§2.2 场景表、§2.3 开关表、§3.1 P0 强制覆盖、§3.2 P1 默认值、§3.3 P2 显式提示。

| # | 功能 | 原代码位置 | 删除方式 |
|---|---|---|---|
| NI-1 | OneDrive free（含 msal-browser） | `src/fsOnedrive.ts`（35KB）+ `settings.ts:1334-1485` | 全文件删除 + Setting 区块删除 |
| NI-2 | WebDAV | `src/fsWebdav.ts`（28KB）+ `settings.ts:1491-1714` | 全文件删除 + Setting 区块删除 |
| NI-3 | Dropbox | `src/fsDropbox.ts`（21KB）+ `settings.ts:1154-1328` | 全文件删除 + Setting 区块删除 |
| NI-4 | Webdis | `src/fsWebdis.ts`（8KB）+ `settings.ts:1720-1839` | 全文件删除 + Setting 区块删除 |
| NI-5 | PRO 全部（24 .ts + 1 .d.ts + 1 .md + 4 langs/ + 2 tests/ = 32 文件） | `pro/src/` + `pro/tests/` + `pro/src/langs/` | 目录整体删除（含 pro/tests/） |
| NI-6 | PasswordModal + EncryptionMethodModal | `settings.ts:72-195` | 全类删除 |
| NI-7 | password / encryptionMethod Setting | `settings.ts:2038-2086` | 全删 |
| NI-8 | syncOnSaveAfterMilliseconds Setting | `settings.ts:2154-2173` | UI 全删，逻辑保留 |
| NI-9 | ignorePaths / onlyAllowPaths Setting | `settings.ts:2229-2274` | UI 全删，逻辑需确认是否删除 |
| NI-10 | 导出同步计划（5 个按钮） | `settings.ts:2832-2901` | 全删 |
| NI-11 | profiler UI + export | `settings.ts:2928-2998` | 全删 |
| NI-12 | 导入/导出设置（QR + URI） | `settings.ts:737-820` | v1.1 全删：`importExport.ts` 全文 + `ExportSettingsQrCodeModal` 整类 + `baseTypes.ts:54` `QRExportType` 类型 |
| NI-13 | 修改日志级别 UI | `settings.ts:2777-2790` | 删 UI，硬编码 info |
| NI-14 | 混淆设置文件 UI | `settings.ts:2804-2826` | 删 UI，硬编码 true |
| NI-15 | 查看终端输出 UI | `settings.ts:2828-2830` | 全删 |
| NI-16 | 输出 vault ID / basepath | `settings.ts:3000-3009` | 全删 |
| NI-17 | 重设本地缓存 | `settings.ts:3011-3021` | 全删（destroyDBs 函数保留无 UI） |
| NI-18 | clear dup files（smart_conflict 辅助） | `settings.ts:2426` 调用 + `pro/src/settingsClearDupFiles.ts` | 全删 |
| NI-19 | OAuth 环境变量（15 个） | `esbuild.config.mjs:17-33` | 全删 |
| NI-20 | 端到端加密 UI（Modal） | `settings.ts:72-156` PasswordModal / `settings.ts:159-195` EncryptionMethodModal | 全删 |
| NI-21 | `useAccurateMTime`（使用准确的文件修改时间） | `fsS3.ts:DEFAULT_S3_CONFIG` + `copyLogic.ts` 读取点 | 字段删除 + Setting 已删 + 调用点全删 |
| NI-22 | `remotePrefix`（修改远端前缀路径） | `fsS3.ts:DEFAULT_S3_CONFIG` + `settings.ts:902-913` Setting 区块 + `src/langs/*.json` 9 个 `modal_remoteprefix_*` key | 字段删除 + Setting 区块删除 + i18n key 全删 |
| NI-23 | `reverseProxyNoSignUrl`（S3 反向代理地址） | `fsS3.ts:DEFAULT_S3_CONFIG` + `settings.ts:914-925` Setting 区块 + `src/langs/*.json` 8 个 `modal_remotebasedir_*` key | 字段删除 + Setting 区块删除 + i18n key 全删 |
| NI-24 | `generateFolderObject`（是否生成文件夹 Object） | `fsS3.ts:DEFAULT_S3_CONFIG` + `copyLogic.ts` 调用点 | 字段删除 + Setting 区块删除 + 调用点全删 |

---

## 4. 技术栈

| 项目 | 值 |
|---|---|
| 语言 | TypeScript（上游 5.5.4） |
| 打包工具 | esbuild（`esbuild.config.mjs`，入口 `src/main.ts`） + webpack 备选 |
| 测试框架 | mocha + tsx（`npm test`，上游配置） |
| Node target | `es2016`（esbuild.config.mjs L60） |
| License | `Apache-2.0`（修改自上游 `SEE LICENSE IN LICENSE`） |

### 4.1 保留依赖（package.json）

| 包 | 用途 |
|---|---|
| `@aws-sdk/client-s3` | S3 API 客户端 |
| `@aws-sdk/lib-storage` | S3 Upload 管理 |
| `@aws-sdk/signature-v4-crt` | S3 CRT 签名（fsS3 依赖） |
| `@aws-sdk/types` | AWS 类型定义 |
| `@fyears/rclone-crypt` | 加密（后端保留） |
| `@fyears/tsqueue` | 队列（copyLogic 依赖） |
| `localforage` + `localforage-*` | 浏览器端 DB |
| `@sanity/diff-match-patch` | diff 算法 |
| `lodash` | 工具函数 |
| `nanoid` | ID 生成 |
| `mustache` | 模板（i18n 使用） |
| `mime-types` | MIME 类型检测 |
| `qrcode` | QR 码生成（<u>v1.1 已删</u>：v1.1 随 `importExport.ts` 删除） |
| `xregexp` | 正则（copyLogic 依赖） |
| `rfc4648` | 编码 |
| `p-queue` | 并发控制 |
| `aggregate-error` | 错误聚合 |
| `path-browserify` | 路径兼容 |
| `crypto-browserify` | 加密兼容 |
| `buffer` | 缓冲区 |
| `acorn` | 编译工具（esbuild/webpack transitive） |
| `assert` | Node polyfill |
| `aws-crt` | AWS CRT 绑定（fsS3 依赖） |
| `emoji-regex` | 工具函数 |
| `http-status-codes` | HTTP 状态码常量 |
| `localforage-getitems` | localforage 扩展 |
| `localforage-removeitems` | localforage 扩展 |
| `lucide` | 图标库（ribbon icon 用） |
| `node-diff3` | 3-way merge 算法 |
| `openapi-fetch` | OpenAPI 客户端 |
| `process` | Node polyfill |
| `rimraf` | 文件删除工具 |
| `stream-browserify` | stream polyfill |
| `url` | URL polyfill |
| `util` | util polyfill |
| `@smithy/fetch-http-handler` | AWS SDK transitive |
| `@smithy/protocol-http` | AWS SDK transitive |
| `@smithy/querystring-builder` | AWS SDK transitive |

### 4.2 删除依赖（package.json）

| 包 | 原因 |
|---|---|
| `@azure/msal-node` | OneDrive free 删除 |
| `@microsoft/microsoft-graph-client` | OneDrive free 删除 |
| `@microsoft/microsoft-graph-types` | OneDrive free 删除（devDeps） |
| `box-typescript-sdk-gen` | Box PRO 删除 |
| `dropbox` | Dropbox 删除 |
| `pcloud-sdk-js` | pCloud PRO 删除 |
| `webdav` | WebDAV 删除 |
| `@azure/storage-blob` | PRO 删除（azureblobstorage） |
| `qrcode` | 随 `importExport.ts` 删除（`ExportSettingsQrCodeModal` 依赖） |

### 4.3 manifest.json 改造

| 字段 | 上游值 | 改造后 |
|---|---|---|
| `id` | `remotely-save` | `cstcloud-sync` |
| `name` | `Remotely Save` | `cstcloud-sync` |
| `version` | `0.5.25` | `0.0.1` |
| `description` | `Yet another unofficial plugin...` | `Obsidian 笔记双向同步插件（基于 S3/cstcloud.cn）` |
| `author` | `fyears` | 保留 |
| `fundingUrl` | `https://remotelysave.com` | **删除** |

### 4.4 esbuild.config.mjs 改造

- 删除 L17-33 所有 OAuth 环境变量（15 个 DEFAULT_*）
- 删除 L67-81 所有 `global.DEFAULT_*` define
- 保留 `es2016` target（L60）
- 保留 `entryPoints: ["./src/main.ts"]`（L43）

---

## 5. 架构设计

### 5.1 62 文件改造分类（23 保留 + 1 新建 + 6 删除 + 32 pro/）

#### A. 保留文件（25 行，v1.1 删 2 个后实际保留 23）

> 含 2 个 v1.1 标记删除项（`importExport.ts` / `debugMode.ts`），见 §5.1.C

| 文件 | 改造说明 |
|---|---|
| `src/main.ts` | 改：删除 pro/src import / OAuth handler / cloud 初始化；硬编码 s3/info/true；保留 sync 核心 |
| `src/settings.ts` | 改：删除 80+ 云服务 Setting 区块（Dropbox/WebDAV/Webdis/OneDrive/PRO）；保留 S3 三字段 + <u>12 个 P1 Setting（v1.1 删除 P1-13/P1-14 调试功能）</u> |
| `src/fsS3.ts` | 保留（25KB）：DEFAULT_S3_CONFIG 改为 `s3Endpoint=s3.cstcloud.cn` / `region=us-east-1` / `forcePathStyle=true` |
| `src/fsAll.ts` | 保留：FakeFs 抽象基类 |
| `src/baseTypes.ts` | 改：删除 pro/src/baseTypesPro.ts import；<u>删除 `QRExportType` 类型（v1.1 随 importExport.ts 删除）</u>；保留 S3/Webdav/Dropbox/Onedrive 类型（兼容旧配置） |
| `src/baseTypesObs.ts` | 保留 |
| `src/configPersist.ts` | 保留（加密配置读写） |
| `src/copyLogic.ts` | 保留（文件 diff/copy 核心）；需确认是否删除 `ignorePaths`/`onlyAllowPaths` 读取 |
| <u>`src/importExport.ts`</u> | <u>v1.1 删除（105 行）</u> |
| `src/i18n.ts` | 改：删除 `LANGS_PRO` merge（L5,8）；改为 `const LANGS = LANGS_BASIC` |
| `src/localdb.ts` | 保留（DB 操作）；<u>`SyncPlanType` 已确认（v1.0 Step 12 完成）：已删除 pro/src/sync import，`SyncPlanType` 在 `src/sync.ts:358` 重新 export</u> |
| `src/metadataOnRemote.ts` | 保留 |
| `src/misc.ts` | 保留 |
| `src/obsFolderLister.ts` | 保留 |
| `src/profiler.ts` | 保留（无 UI 调用方） |
| `src/syncAlgoV3Notice.ts` | 保留（删除 pro import） |
| `src/worker.d.ts` | 保留 |
| `src/encryptOpenSSL.ts` | 保留（后端加密实现） |
| `src/encryptRClone.ts` | 保留（后端加密实现） |
| `src/encryptRClone.worker.ts` | 保留（web worker 加密） |
| `src/fsEncrypt.ts` | 保留（FakeFs wrapper，password 为空时 passthrough） |
| <u>`src/debugMode.ts`</u> | <u>v1.1 删除（95 行）</u> |
| `src/fsGetter.ts` | 改：switch 仅剩 s3 case + 12 case 全删（详见 Step 7） |
| `src/fsLocal.ts` | 保留：本地 vault 抽象（无改动） |
| `src/fsMock.ts` | 保留：测试 mock（无改动） |

#### B. 新建文件（1 个）

| 文件 | 说明 |
|---|---|
| `src/sync.ts` | **从 `pro/src/sync.ts` 提取核心逻辑**，替代 `main.ts` 中 `import { syncer } from "../pro/src/sync"` |

#### C. 删除文件（6 个，v1.1 新增 2 个）

| 文件 | 大小 |
|---|---|
| `src/fsOnedrive.ts` | 35KB |
| `src/fsWebdav.ts` | 28KB |
| `src/fsDropbox.ts` | 21KB |
| `src/fsWebdis.ts` | 8KB |
| <u>`src/importExport.ts`</u> | <u>105 行（v1.1 删除）</u> |
| <u>`src/debugMode.ts`</u> | <u>95 行（v1.1 删除）</u> |

#### D. pro/ 目录整体删除（24 个 .ts + 1 个 .d.ts + 1 个 .md + 4 个 langs/ + 2 个 tests/ = 32 个文件）

```
pro/src/account.ts
pro/src/baseTypesPro.ts
pro/src/clearDupFiles.ts
pro/src/conflictLogic.ts
pro/src/fsAzureBlobStorage.ts
pro/src/fsBox.ts
pro/src/fsGoogleDrive.ts
pro/src/fsKoofr.ts
pro/src/fsOnedriveFull.ts
pro/src/fsPCloud.ts
pro/src/fsYandexDisk.ts
pro/src/koofrApi.d.ts
pro/src/langs/index.ts + en.json + zh_cn.json + zh_tw.json
pro/src/localdb.ts
pro/src/oauth2.ts
pro/src/settingsAzureBlobStorage.ts
pro/src/settingsBox.ts
pro/src/settingsClearDupFiles.ts
pro/src/settingsGoogleDrive.ts
pro/src/settingsKoofr.ts
pro/src/settingsOnedriveFull.ts
pro/src/settingsPCloud.ts
pro/src/settingsPro.ts
pro/src/settingsYandexDisk.ts
pro/src/sync.ts ← 核心提取到 src/sync.ts
pro/src/add_new_service.md
pro/src/yandexApi.ts
pro/tests/conflictLogic.test.ts
pro/tests/sync.test.ts
```

#### E. langs/ 文件改造（3 个）

| 文件 | 改造 |
|---|---|
| `src/langs/en.json` | 删除 ~194 个 PRO/cloud i18n key，13 类前缀：dropbox (36) / onedrive (34) / pro (27) / webdav (24) / syncplans (16) / webdis (14) / password (12) / remoteprefix (9) / remotebasedir (8) / encrypt (6) / chooseService (3) / export_ (3) / box (2) |
| `src/langs/zh_cn.json` | 同上（按相同前缀） |
| `src/langs/zh_tw.json` | 同上（按相同前缀） |

#### F. fsGetter.ts 改造后 case 分支

```typescript
// 改造后仅剩 S3:
switch (settings.serviceType) {
  case "s3":
    return new FakeFsS3(settings.s3);
  default:
    throw Error(`cstcloud-sync only supports S3`);
}
```

### 5.2 数据流

```
用户点击 ribbon / 命令面板 / 自动触发
        │
        ▼
main.ts: syncRun(type)
        │
        ▼
fsGetter.getFs(settings) → FakeFsS3(settings.s3)
        │
        ├── fsS3.list()      → S3 API ListObjectsV2
        ├── fsS3.walk()       → S3 API ListObjectsV2（递归）
        │
        ▼
copyLogic.runSync(localFs, remoteFs, settings)
        │
        ├── diff(localFiles, remoteFiles)  → fileDiff list
        ├── decideCopyActions(diff, direction, conflictAction)
        ├── executeCopyActions()           → fsS3.put() / fsS3.delete()
        │
        ▼
localdb.upsertLastSuccessSyncTimeByVault()
        │
        ▼
main.ts: updateLastSyncMsg() → StatusBar 刷新
```

### 5.3 关键接口

| 接口 | 文件:行号 | 说明 |
|---|---|---|
| `FakeFsS3` 构造 | `fsS3.ts:179-192` | DEFAULT_S3_CONFIG 含硬编码 endpoint/region |
| `getS3Client()` | `fsS3.ts:223-254` | S3 Client 初始化 |
| `FakeFsS3.walk()` | `fsS3.ts` | 递归遍历 S3 prefix 下所有对象 |
| `FakeFsS3.checkConnect()` | `fsS3.ts` | HeadBucket + ListObjectsV2 验证连通性 |
| `getFs(settings)` | `fsGetter.ts` | 唯一 fs 工厂方法，switch 仅剩 s3 case |
| `syncRun(type)` | `main.ts` | 同步入口，支持 `"manual"` / `"auto"` / `"init"` |
| `loadSettings()` | `main.ts:1338-1512` | 加载配置含 backward compat；新增强制覆盖逻辑 |
| `exportQrCodeUri()` | <u>`importExport.ts`</u> | <u>v1.1 已删（随 `importExport.ts` 全文删除）</u> |
| `SyncConfigDirModal` | `settings.ts:681-732` | **保留**，用于选择 vault 目录 |
| `ExportSettingsQrCodeModal` | <u>`settings.ts:734-796`</u> | <u>v1.1 已删（随 `importExport.ts` 全文删除 + `ExportSettingsQrCodeModal` 整类删除）</u> |

---

## 6. 实施步骤（Checklist）

### Phase 1：清理 - 删除文件和目录

| Step | 动作 | 文件/目录 |
|---|---|---|
| 1 | 删除 OneDrive 适配器 | `src/fsOnedrive.ts` |
| 1.5 | 删除 Webdis 测试（依赖 src/fsWebdis.ts） | `tests/fsWebdis.test.ts` |
| 2 | 删除 WebDAV 适配器 | `src/fsWebdav.ts` |
| 3 | 删除 Dropbox 适配器 | `src/fsDropbox.ts` |
| 4 | 删除 Webdis 适配器 | `src/fsWebdis.ts` |
| 5 | 删除 PRO 目录整体 | `pro/` 全部内容（24 .ts + 1 .d.ts + 1 .md + 4 langs/ + 2 tests/ = 32 文件） |

### Phase 2：清理 - 删除 import 和调用

| Step | 动作 | 位置 |
|---|---|---|
| 6 | 删除 `main.ts:20-65` 所有 pro/src/ 和 free cloud import | `main.ts` |
| 7 | 删除 `fsGetter.ts` 所有 pro/src/ import 和 12 个 case 分支（含 onedrivefull：s3/webdav/dropbox/onedrive/onedrivefull/webdis/googledrive/box/pcloud/yandexdisk/koofr/azureblobstorage） | `fsGetter.ts` |
| 8 | 删除 `settings.ts:1-70` 所有 pro/src/ import | `settings.ts` |
| 9 | 删除 `baseTypes.ts:6-15` pro/src/baseTypesPro.ts import | `baseTypes.ts` |
| 10 | 删除 `i18n.ts:5,8` LANGS_PRO import 和 merge | `i18n.ts` |
| 11 | 删除 `importExport.ts:4 + 11`：`getShrinkedSettingsOnedriveFull`（行 4，来自 `../pro/src/fsOnedriveFull`）+ `getShrinkedSettingsOnedrive`（行 11，来自 `./fsOnedrive`）<u>（v1.0 阶段）</u> | <u>v1.1 修订后被 Step 48~54 系列覆盖，不需单独执行</u> |
| 12 | 删除 `localdb.ts:9` SyncPlanType 从 pro/src/sync 的 import | `localdb.ts` |
| 13 | 删除 `syncAlgoV3Notice.ts:3` pro import | `syncAlgoV3Notice.ts` |
| 14 | 删除 `main.ts:604-1169` 所有 OAuth callback handler | `main.ts` |

### Phase 3：改造 - settings.ts

| Step | 动作 | 位置 |
|---|---|---|
| 15 | 删除 `settings.ts:72-156` PasswordModal | `settings.ts` |
| 16 | 删除 `settings.ts:159-195` EncryptionMethodModal | `settings.ts` |
| 17 | 删除 `settings.ts:374-535` DropboxAuthModal | `settings.ts` |
| 18 | 删除 `settings.ts:537-679` OnedriveAuthModal / OnedriveRevokeAuthModal | `settings.ts` |
| 19 | 删除 `settings.ts:1150-1932` dropboxDiv / onedriveDiv / webdavDiv / webdisDiv / 所有 PRO Setting 调用 | `settings.ts` |
| 20 | 删除 `settings.ts:1938-2029` serviceType dropdown（改为隐藏或删除） | `settings.ts` |
| 21 | 删除 `settings.ts:2038-2086` password + encryptionMethod Setting | `settings.ts` |
| 22 | 删除 `settings.ts:2154-2173` syncOnSave Setting | `settings.ts` |
| 23 | 删除 `settings.ts:2229-2274` ignorePaths + onlyAllowPaths Setting | `settings.ts` |
| 24 | 删除 `settings.ts:2426` generateClearDupFilesSettingsPart 调用 | `settings.ts` |
| 25 | 删除 `settings.ts:2574-2770` import/export 区块 + proDiv | `settings.ts` |
| 26 | 删除 `settings.ts:2777-2790` logLevel + `2792-2802` console + `2804-2826` obfuscate + `2828-2830` viewconsolelog + `2928-2998` profiler + `3000-3009` vaultid + `3011-3021` resetCache（**排除 <u>`829-835` delSyncPlans</u> 和 <u>`840-849` delPrevSync</u>——P1-13/P1-14 保留；<u>已删：5 个 export 按钮</u>（v0.0.1 实施时随 80+ 区块大删连带删除，Step 27 已落地）） | `settings.ts` |
| 27 | <u>v0.0.1 实施时已删：settings.ts 中 5 个 export sync plans 按钮在 80+ 区块大删时连带删除，v1.1 修订不需单独执行</u> | — |

### Phase 4：硬编码 + 配置改造

| Step | 动作 | 位置 |
|---|---|---|
| 28 | 修改 `manifest.json`：id="remotely-save"→"cstcloud-sync"，name="Remotely Save"→"cstcloud-sync"，version="0.5.25"→"0.0.1"（cstcloud-sync 是独立插件，老板插件，从 0.0.1 起步），description 改写（说明仅支持 s3.cstcloud.cn），author 保留 "fyears"（Apache-2.0 致谢上游原作者），删除 fundingUrl（remotelysave.com） | `manifest.json` |
| 29 | 修改 `package.json`：name→cstcloud-sync，license→Apache-2.0，删除 8 个云服务依赖，**`scripts.test` 改为 `mocha --import=tsx 'tests/**/*.ts'`（去掉 `'pro/tests/**/*.ts'`，因 Step 5 删 pro/ 后此 glob 失效）** | `package.json` |
| 30 | 修改 `esbuild.config.mjs`：删除 L16-30 OAuth 环境变量（15 个 const DEFAULT_..._APP_KEY/SECRET 等），删除 L67-81 global define（15 个 global.DEFAULT_*） | `esbuild.config.mjs` |
| 31 | 修改 `main.ts DEFAULT_SETTINGS`：硬编码 serviceType="s3" / currLogLevel="info" / obfuscateSettingFile=true | `main.ts:115-157` |
| 32 | 修改 `fsS3.ts DEFAULT_S3_CONFIG`：硬编码 endpoint/region/forcePathStyle | `fsS3.ts:179-192` |
| 33 | 修改 `main.ts:loadSettings()`：新增 6 项强制覆盖（`s3.generateFolderObject=false` / `ignorePaths=[]` / `onlyAllowPaths=[]` / `enableStatusBarInfo=true` / `syncOnSaveAfterMilliseconds=-1` / `deleteToWhere="system"`，行 1410-1427）。`serviceType="s3"` / `currLogLevel="info"` 已在 `main.ts:115-157` DEFAULT_SETTINGS 默认值（Step 31 范畴） | `main.ts:1338-1512` |
| 34 | 新建 `src/sync.ts`：从 `pro/src/sync.ts` 提取 syncer 主体；**同时新建 `src/conflictLogic.ts`（从 `pro/src/conflictLogic.ts` 提取 `isMergable / twoWayMerge / threeWayMerge / getFileRenameForDup` 4 个函数 + 依赖的 `MERGABLE_SIZE` 常量）+ 合并 `pro/src/localdb.ts` 4 个函数到 `src/localdb.ts`（upsertFileContentHistoryByVaultAndProfile / getFileContentHistoryByVaultAndProfile / clearFileContentHistoryByVaultAndProfile / clearAllFileContentHistoryByVault）+ 删除 `checkProRunnableAndFixInplace` 调用（cstcloud-sync 无 PRO）** | `src/sync.ts` + `src/conflictLogic.ts` + `src/localdb.ts` |
| 35 | 修改 `main.ts:65`：将 `import { syncer } from "../pro/src/sync"` 改为 `import { syncer } from "./sync"`（main.ts:488 是 `await syncer(...)` 调用，无需改） | `main.ts` |
| 36 | 修改 `fsGetter.ts`：switch 仅剩 s3 case，default 抛出 `cstcloud-sync only supports S3` | `fsGetter.ts` |
| 37 | 修改 `importExport.ts`：exportQrCodeUri 仅支持 basic_and_advanced<u>（v1.0 阶段）</u> | <u>v1.1 修订后被 Step 48~54 系列覆盖，不需单独执行</u> |
| 38 | 修改 `i18n.ts`：删除 LANGS_PRO merge | `i18n.ts` |
| 39 | 改造 `langs/en.json` + `zh_cn.json` + `zh_tw.json`：删除 ~194 个 PRO/cloud i18n key（13 类前缀：dropbox 36 / onedrive 34 / pro 27 / webdav 24 / syncplans 16 / webdis 14 / password 12 / remoteprefix 9 / remotebasedir 8 / encrypt 6 / chooseService 3 / export_ 3 / box 2） | `src/langs/*.json` |
| 40 | 改造 `main.ts:1171-1175`：aria-label 可改为"同步" | `main.ts` |
| 41 | 修改 `main.ts:1230-1292`：删除 4 个 export-sync-plans commands | `main.ts` |
| 42 | 修改 `settings.ts:968-987`：删除 S3 URL style dropdown，代码写死 forcePathStyle | `settings.ts` |
| 43 | 修改 `settings.ts:902-913` + `914-925`：删除 endpoint/region input，默认值改为 cstcloud.cn/us-east-1 | `settings.ts` |
| 44 | 修改 `main.ts:553`：删除 OAuth expire check（`checkIfOauthExpires()` 调用） | `main.ts` |

### Step Checklist（完整 47 步）

- [ ] Step 1-5：Phase 1 文件删除（含 Step 1.5 tests/fsWebdis.test.ts）
- [ ] Step 6-14：Phase 2 import/handler 删除
- [ ] Step 15-27：Phase 3 settings.ts 大删
- [ ] Step 28-30：manifest / package.json / esbuild.config.mjs
- [ ] Step 31-33：硬编码 + backward compat
- [ ] Step 34：新建 src/sync.ts
- [ ] Step 35-39：import 修复 + i18n 改造
- [ ] Step 40-44：UI 清理 + command 删除
- [ ] <u>Step 45：修改 `src/langs/en.json:191-196` 弹窗 6 个 i18n key（新文案：cstcloud-sync 同步算法说明口径、复选框 2 改为"我理解仅支持 S3 协议 + 默认端点 cstcloud.cn"、GitHub 链接占位 `https://github.com/cstcloud/cstcloud-sync`）</u>
- [ ] <u>Step 46：修改 `src/langs/zh_cn.json:191-196` 同上 6 个 key</u>
- [ ] <u>Step 47：修改 `src/langs/zh_tw.json:191-196` 同上 6 个 key</u>
- [ ] <u>Step 48：删除 `src/importExport.ts`（105 行）</u>
- [ ] <u>Step 49：删除 `src/settings.ts:25-29`（importExport import）</u>
- [ ] <u>Step 50：删除 `src/settings.ts:108`（`exportQrCodeUri` 调用）</u>
- [ ] <u>Step 51：删除 `src/settings.ts:737-820`（`importExportDiv` 区段 + `ExportSettingsQrCodeModal` 整类）</u>
- [ ] <u>Step 52：删除 `src/settings.ts:782-783`（`parseUriByHand` / `importQrCodeUri` 调用）</u>
- [ ] <u>Step 53：删除 3 langs 中 `settings_importexport` / `settings_export` / `settings_export_desc` / `settings_export_basic_and_advanced_button` / `settings_export_s3_button` / `settings_import` / `settings_import_desc` / `modal_qr_*` / `protocol_saveqr` 键</u>
- [ ] <u>Step 54：删除 `baseTypes.ts:54` `QRExportType` 类型</u>
- [ ] <u>Step 55：删除 `src/debugMode.ts`（95 行）</u>
- [ ] <u>Step 56：删除 `src/settings.ts:30-34`（localdb import 中的 `clearAllSyncPlanRecords` / `clearAllPrevSyncRecordByVault`，`destroyDBs` 保留）</u>
- [ ] <u>Step 57：删除 `src/settings.ts:825-855`（`debugDiv` 区段 + 2 个 Setting 块：`delsyncplans` + `delprevsync`）</u>
- [ ] <u>Step 58：删除 3 langs 中 `settings_debug` / `settings_delsyncplans*3` / `settings_delprevsync*3` 键</u>

---

## 7. 里程碑与排期

| 里程碑 | 内容 | 估时 |
|---|---|---|
| M1：干净删除 | Phase 1-3 完成，src 目录仅剩保留文件，pro/ 删除，无编译错误 | **6h**（settings.ts 总 3029 行要删 ~1500 行 + pro/src/sync.ts 提取到 src/sync.ts 含 conflictLogic） |
| M2：硬编码验证 | Step 28-33 完成，manifest.json 正确，DEFAULT_SETTINGS 硬编码验证 | 2h |
| M3：功能验证 | Step 34-39 完成，syncRun 流程通，import/export 可用，i18n 无 key 缺失 | 4h |
| M4：E2E 验证 | Obsidian 中安装插件，配置 AccessKey/SecretKey/Bucket，检查连接通过，单向同步通过，双向同步通过 | 4h |

**总估时：16h（约 2 人日）**

---

## 8. 风险与依赖

| ID | 风险 | 等级 | 缓解 |
|---|---|---|---|
| R1 | `main.ts:1412-1416` 在 `loadSettings()` 读取 `ignorePaths`/`onlyAllowPaths`，UI 删除后字段仍被处理 | 中 | Step 33 已在 `loadSettings()` 中强制覆盖为 `[]`（行 1413/1416） |
| R2 | `syncOnSaveAfterMilliseconds` 逻辑已保留但无 UI，旧配置可能触发意外行为 | 中 | `loadSettings()` 中强制覆盖为 `-1` |
| R3 | 旧 data.json 含 PRO 字段，`loadSettings()` backward compat 可能产生副作用 | 低 | 验证 `loadSettings()` 不对 PRO 字段进行任何填充/读取 |
| R4 | `pro/src/sync.ts` 提取到 `src/sync.ts` 时遗漏 pro 内部依赖（account/conflictLogic/localdb × 3 个 import） | **高** | Step 34 详细化：新建 `src/conflictLogic.ts` + 合并 `src/localdb.ts` 类型 + 删除 PRO 校验调用；提取后编译验证 |
| R5 | `fsS3.ts` 保留完整，但 `ObsHttpHandler`（Obsidian requestUrl 封装）可能在 S3 cstcloud.cn 上有兼容问题 | 低 | M4 E2E 验证时重点测试连接 |
| R6 | i18n key 大面积删除，可能导致 `mustache.render` 报错（missing key） | 低 | 英文 fallback 会兜底；确认 `t()` 函数对 missing key 的容错 |
| <u>R7</u> | <u>v1.1 已删</u>：`qrcode` / `ExportSettingsQrCodeModal` / `importExport.ts` 均已删除，此风险消除 | 低 | —（v1.1 修订后消除） |
| R8 | `localdb.ts:9` SyncPlanType import 删除可能影响 `clearAllSyncPlanRecords()` 功能 | 低 | 确认 SyncPlanType 是否定义在 src 层，或需要在 src/sync.ts 中保留 |

---

## 9. 验收标准

| ID | AC | 验证方式 |
|---|---|---|
| AC1 | 插件安装后 plugin id 为 `cstcloud-sync`，名称为 `cstcloud-sync` | 读取 manifest.json 验证 |
| AC2 | 设置页面仅显示 AccessKey / SecretKey / Bucket 三个 S3 必填字段 + <u>12 个 P1 可选字段（v1.1 删除 P1-13/P1-14）</u>，无其他云服务 | 手动检查 UI |
| AC3 | Endpoint / Region / S3 URL Style / Log Level / Obfuscate 均不在 UI 中显示 | 手动检查 UI |
| AC4 | "检查连接"按钮点击后成功验证 S3 连通性（或返回明确错误） | E2E 测试 |
| AC5 | Ribbon 图标点击触发 `start-sync`，命令面板两个命令均可用 | E2E 测试 |
| AC6 | `npm run build2` 无错误完成，生成 `main.js` | CI / 本地构建 |
| AC7 | `npm test` 无新增测试失败（上游 mocha 测试） | CI / 本地测试 |
| AC8 | 插件加载后 `data.json` 中 6 项关键字段被强制覆盖（`loadSettings()` 行 1410-1427）：`s3.generateFolderObject=false` / `ignorePaths=[]` / `onlyAllowPaths=[]` / `enableStatusBarInfo=true` / `syncOnSaveAfterMilliseconds=-1` / `deleteToWhere="system"`。`serviceType="s3"` / `currLogLevel="info"` 已在 `main.ts:115-157` DEFAULT_SETTINGS 默认值（Step 31 范畴，旧 data.json 加载后即覆盖为 "s3"/"info"） | 首次加载后读取 data.json |
| <u>AC9</u> | <u>同步算法说明弹窗在 3 个 langs（en / zh_cn / zh_tw）中均正确显示对应语言文案，6 个 key（`syncalgov3_title` / `syncalgov3_texts` / `syncalgov3_checkbox_manual_backup` / `syncalgov3_checkbox_requiremultidevupdate` / `syncalgov3_button_agree` / `syncalgov3_button_disagree`）均有值；复选框 2 文案包含"仅支持 S3 协议 + 默认端点 cstcloud.cn"语义；GitHub 链接占位为 `https://github.com/cstcloud/cstcloud-sync`</u> | <u>E2E 测试：分别切换 3 种语言触发弹窗，肉眼核对文案</u> |
| <u>AC10</u> | <u>Settings 页面中"导入/导出设置"区块和"调试"区块均已消失；`src/importExport.ts` 和 `src/debugMode.ts` 文件不存在</u> | <u>Step 48~54（importExport）/ Step 55~58（debugMode）后检查文件存在性 + 手动检查 Settings UI</u> |
| <u>AC11</u> | <u>`src/syncAlgoV3Notice.ts` TS 结构未被修改（弹窗触发/同意行为保持不变）</u> | <u>代码审查 `src/syncAlgoV3Notice.ts` + `main.ts:570, 903-907`</u> |
