# ClaudeCode 需求拆解 v1（PRD 启动前置）

> [!WARNING]
> **⚠️ 本文档为历史归档（v1.0/v1.1 规划期记录）** —— 其中关于端到端加密「保留」的结论**已失效**：加密后端已于 cstcloud-sync v0.0.2 / PRD v1.3 Step 75-77 全部移除（历史归档）。

> 基于 3 个输入：tech_v1.md / remotely_save.md / https://github.com/remotely-save/remotely-save

---

## 1. PRD 范围定界

| 项目 | 值 |
|---|---|
| 文档名 | `decomp_claudecode_v1.md` |
| 起始版本 | `0.5.25`（对齐上游） |
| 必含章节 | §1 项目概述 / §2 用户场景 / §3 功能需求 / §4 技术栈 / §5 架构设计 / §6 实施步骤 / §7 里程碑 / §8 风险依赖 / §9 验收标准 |
| 与 tech_v1.md 关系 | **本拆解基于 tech_v1.md 所有改造决策**，tech_v1.md 是改造实现手册；本文档是 PRD 启动前的需求确认稿 |
| 副本路径 | `/root/.openclaw/Project/cstcloud-sync/decomp_claudecode_v1.md` |

---

## 2. 项目概述（PRD §1 草案）

| 项目 | 值 |
|---|---|
| 产品名 | `cstcloud-sync` |
| 上游 | remotely-save v0.5.25（fyears） |
| 上游 URL | https://github.com/remotely-save/remotely-save |
| 源码路径 | `/home/WPS/ls/cstcloud-sync/` |
| 目标 | 将 upstream 改造为仅支持 S3（cstcloud.cn）的 Obsidian 同步插件，删除所有其他云服务 UI、OAuth、PRO 功能 |
| plugin-id | `remotely-save` → `cstcloud-sync` |
| package 名 | `remotely-save` → `cstcloud-sync` |
| License | `Apache-2.0`（上游为 `SEE LICENSE IN LICENSE`，本项目明确为 Apache-2.0） |
| 目标 endpoint | `s3.cstcloud.cn`（硬编码） |
| S3 URL style | Path-Style（hardcoded `forcePathStyle=true`） |
| 成功标准 | Obsidian 插件商店可安装；用户配置 AccessKey/SecretKey/Bucket 后完成双向同步 |

---

## 3. 用户与场景（PRD §2 草案）

### 3.1 目标用户

- 使用 Obsidian 的个人用户
- 有 cstcloud.cn S3 账号（对象存储）
- 需要将笔记双向同步到私有 S3

### 3.2 核心场景

| 场景 | 描述 |
|---|---|
| 配置 S3 账号 | 用户输入 AccessKey / SecretKey / Bucket，点击"检查连接"验证 |
| 手动同步 | 用户点击 ribbon 图标或命令面板 `start-sync` 触发同步 |
| 自动定时同步 | 设置每 N 分钟自动同步（autoRunEveryMilliseconds） |
| 启动后首次同步 | 设置 Obsidian 启动后 N 分钟自动同步（initRunAfterMilliseconds） |
| 冲突处理 | 文件双向修改时按策略（保留本地/远程/智能冲突）处理 |
| 状态栏显示 | 状态栏显示上次成功同步时间 |

### 3.3 非场景（明确不实现）

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

---

## 4. 功能需求（PRD §3 草案）

### 4.1 P0 必含（未实装则核心流程不通）

| # | 功能 | 代码位置 | 说明 |
|---|---|---|---|
| P0-1 | S3 同步核心（读/写/删除） | `src/fsS3.ts` 全文 | 保留 fsS3 全部逻辑 |
| P0-2 | 文件 diff + copy 逻辑 | `src/copyLogic.ts` 全文 | 双向 diff 算法 |
| P0-3 | 设置 UI（S3 三字段） | `settings.ts:927-966` | AccessKey / SecretKey / Bucket 输入框 |
| P0-4 | 检查连接按钮 | `settings.ts:1125-1148` | `settings_checkonnectivity` |
| P0-5 | Ribbon 图标 + 触发同步 | `main.ts:1171-1175` | 点击 `this.syncRun("manual")` |
| P0-6 | 命令面板 start-sync / dry-run | `main.ts:1212-1228` | `start-sync` / `start-sync-dry-run` 命令 |
| P0-7 | 同步方向设置 | `settings.ts:2500-2531` | `setting_syncdirection`（含双向/单向/仅下载/仅上传） |
| P0-8 | 冲突处理策略 | `settings.ts:2387-2424` | 含 smart_conflict |
| P0-9 | 自动定时同步 loop | `main.ts:1757-1771` | `enableAutoSyncIfSet()` |
| P0-10 | 启动后自动同步 | `main.ts:1773-1785` | `enableInitSyncIfSet()` |
| P0-11 | 状态栏显示上次同步时间 | `main.ts:1180-1210`, `main.ts:1925-2031` | 30 秒轮询更新 |
| P0-12 | 数据持久化（data.json 读写） | `src/configPersist.ts` + `main.ts:1338-1511` | 含加密混淆存储 |
| P0-13 | 强制 `serviceType="s3"` | `main.ts:129`, `baseTypes.ts:30-42` | 启动时强制覆盖旧配置 |
| P0-14 | 强制 `syncOnSaveAfterMilliseconds=-1` | `main.ts:loadSettings()` | 兼容旧配置 |

### 4.2 P1 保留可配置（提供 UI 入口）

| # | 功能 | Setting ID | 代码位置 |
|---|---|---|---|
| P1-1 | 分块并行度（partsConcurrency） | `settings_s3_parts` | `settings.ts:1015-1034` |
| P1-2 | 自动运行间隔（autoRunEveryMilliseconds） | `settings_autorun` | `settings.ts:2088-2124` |
| P1-3 | 启动后自动运行（initRunAfterMilliseconds） | `settings_runoncestartup` | `settings.ts:2126-2150` |
| P1-4 | 跳过大文件（skipSizeLargerThan） | `settings_skiplargefiles` | `settings.ts:2173-2189` |
| P1-5 | 状态栏显示开关（enableStatusBarInfo） | `settings_enablestatusbar_info` | `settings.ts:2193-2204` |
| P1-6 | 重设状态栏时间记录 | `settings_resetstatusbar_time` | `settings.ts:2206-2227` |
| P1-7 | 并行度（concurrency） | `settings_concurrency` | `settings.ts:2279-2298` |
| P1-8 | 同步下划线文件（syncUnderscoreItems） | `settings_syncunderscore` | `settings.ts:2300-2314` |
| P1-9 | 同步配置文件夹（syncConfigDir） | `settings_configdir` | `settings.ts:2316-2347` |
| P1-10 | 同步书签（syncBookmarks） | `settings_bookmarks` | `settings.ts:2349-2368` |
| P1-11 | 删除到系统回收站/Obsidian .trash | `settings_deletetowhere` | `settings.ts:2370-2385` |
| P1-12 | 保护修改百分比（protectModifyPercentage） | `settings_protectmodifypercentage` | `settings.ts:2428-2498` |
| P1-13 | 删除同步计划历史 | `settings_delsyncplans` | `settings.ts:2903-2912` |
| P1-14 | 删除上次同步明细 | `settings_delprevsync` | `settings.ts:2914-2926` |

### 4.3 P2 硬编码（代码存在但 UI 不显示）

| # | 字段 | 硬编码值 | 位置 |
|---|---|---|---|
| P2-1 | `serviceType` | `"s3"` | `main.ts:129` DEFAULT_SETTINGS；`baseTypes.ts:30-42` |
| P2-2 | `s3.s3Endpoint` | `"s3.cstcloud.cn"` | `fsS3.ts:179-192` DEFAULT_S3_CONFIG |
| P2-3 | `s3.s3Region` | `"us-east-1"` | `fsS3.ts:179-192` DEFAULT_S3_CONFIG |
| P2-4 | `s3.forcePathStyle` | `true` | `fsS3.ts:179-192`；`settings.ts:968-987` 强制写死 |
| P2-5 | `currLogLevel` | `"info"` | `main.ts:130` DEFAULT_SETTINGS |
| P2-6 | `obfuscateSettingFile` | `true` | `main.ts:152` DEFAULT_SETTINGS |

### 4.4 删除功能（不保留代码）

| # | 功能 | 原代码位置 | 删除方式 |
|---|---|---|---|
| NI-1 | OneDrive free（含 msal-browser） | `src/fsOnedrive.ts`（35KB）+ `settings.ts:1334-1485` | 全文件删除 + Setting 区块删除 |
| NI-2 | WebDAV | `src/fsWebdav.ts`（28KB）+ `settings.ts:1487-1714` | 全文件删除 + Setting 区块删除 |
| NI-3 | Dropbox | `src/fsDropbox.ts`（21KB）+ `settings.ts:1150-1328` | 全文件删除 + Setting 区块删除 |
| NI-4 | Webdis | `src/fsWebdis.ts`（8KB）+ `settings.ts:1716-1839` | 全文件删除 + Setting 区块删除 |
| NI-5 | PRO 全部（26 个 .ts + langs/） | `pro/src/` 全部文件 | 目录整体删除 |
| NI-6 | PasswordModal + EncryptionMethodModal | `settings.ts:72-196` | 全类删除 |
| NI-7 | password / encryptionMethod Setting | `settings.ts:2038-2086` | 全删 |
| NI-8 | syncOnSaveAfterMilliseconds Setting | `settings.ts:2152-2171` | UI 全删，逻辑保留 |
| NI-9 | ignorePaths / onlyAllowPaths Setting | `settings.ts:2229-2269` | UI 全删，逻辑需确认是否删除 |
| NI-10 | 导出同步计划（5 个按钮） | `settings.ts:2832-2901` | 全删 |
| NI-11 | profiler UI + export | `settings.ts:2928-2998` | 全删 |
| NI-12 | 导入/导出设置（QR + URI） | `settings.ts:2574-2741` | 全删（`ExportSettingsQrCodeModal` 保留但 exportFields 固定） |
| NI-13 | 修改日志级别 UI | `settings.ts:2777-2790` | 删 UI，硬编码 info |
| NI-14 | 混淆设置文件 UI | `settings.ts:2804-2826` | 删 UI，硬编码 true |
| NI-15 | 查看终端输出 UI | `settings.ts:2792-2802` | 全删 |
| NI-16 | 输出 vault ID / basepath | `settings.ts:3000-3009` | 全删 |
| NI-17 | 重设本地缓存 | `settings.ts:3011-3021` | 全删（destroyDBs 函数保留无 UI） |
| NI-18 | clear dup files（smart_conflict 辅助） | `settings.ts:2426` 调用 + `pro/src/settingsClearDupFiles.ts` | 全删 |
| NI-19 | OAuth 环境变量（15 个） | `esbuild.config.mjs:17-33` | 全删 |
| NI-20 | 端到端加密 UI（Modal） | `settings.ts:72-157` PasswordModal / `settings.ts:159-196` EncryptionMethodModal | 全删 |

---

## 5. 技术栈（PRD §4 草案）

| 项目 | 值 |
|---|---|
| 语言 | TypeScript（上游 5.5.4） |
| 打包工具 | esbuild（`esbuild.config.mjs`，入口 `src/main.ts`） + webpack 备选 |
| 测试框架 | mocha + tsx（`npm test`，上游配置） |
| Node target | `es2016`（esbuild.config.mjs L60） |
| License | `Apache-2.0`（修改自上游 `SEE LICENSE IN LICENSE`） |

### 5.1 保留依赖（package.json）

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
| `qrcode` | QR 码生成（ExportSettingsQrCodeModal 依赖） |
| `xregexp` | 正则（copyLogic 依赖） |
| `rfc4648` | 编码 |
| `p-queue` | 并发控制 |
| `aggregate-error` | 错误聚合 |
| `path-browserify` | 路径兼容 |
| `crypto-browserify` | 加密兼容 |
| `buffer` | 缓冲区 |
| `acorn` | JS 解析器 |
| `openapi-fetch` | HTTP 客户端 |
| `node-diff3` | 三方 diff（冲突解决） |
| `emoji-regex` | emoji 检测 |
| `http-status-codes` | HTTP 状态码 |
| `rimraf` | 文件删除 |
| `lucide` | 图标库 |

### 5.2 删除依赖（package.json）

| 包 | 原因 |
|---|---|
| `@azure/msal-node` | OneDrive free 删除 |
| `@microsoft/microsoft-graph-client` | OneDrive free 删除 |
| `@microsoft/microsoft-graph-types` | OneDrive free 删除（devDeps） |
| `box-typescript-sdk-gen` | Box PRO 删除 |
| `dropbox` | Dropbox 删除 |
| `pcloud-sdk-js` | pCloud PRO 删除 |
| `webdav` | WebDAV 删除 |
| `googleapis` | PRO 删除（googledrive 等） |
| `koofr-api` | PRO 删除（koofr） |
| `@azure/storage-blob` | PRO 删除（azureblobstorage） |
| `aws-crt` | 需确认是否由 @aws-sdk/signature-v4-crt 引入，保留 |

### 5.3 manifest.json 改造

| 字段 | 上游值 | 改造后 |
|---|---|---|
| `id` | `remotely-save` | `cstcloud-sync` |
| `name` | `Remotely Save` | `cstcloud-sync` |
| `version` | `0.5.25` | `0.5.25` |
| `description` | `Yet another unofficial plugin...` | `Obsidian 笔记双向同步插件（基于 S3/cstcloud.cn）` |
| `author` | `fyears` | 保留 |
| `fundingUrl` | `https://remotelysave.com` | **删除** |

### 5.4 esbuild.config.mjs 改造

- 删除 L17-33 所有 OAuth 环境变量（15 个 DEFAULT_*）
- 删除 L67-81 所有 `global.DEFAULT_*` define
- 保留 `es2016` target（L60）
- 保留 `entryPoints: ["./src/main.ts"]`（L43）

---

## 6. 架构设计（PRD §5 草案）

### 6.1 文件改造分类（30 个 src 文件）

#### A. 保留文件（18 个）

| 文件 | 改造说明 |
|---|---|
| `src/main.ts` | 改：删除 pro/src import / OAuth handler / cloud 初始化；硬编码 s3/info/true；保留 sync 核心 |
| `src/settings.ts` | 改：删除 80+ 云服务 Setting 区块（Dropbox/WebDAV/Webdis/OneDrive/PRO）；保留 S3 三字段 + 20 个 P1 Setting |
| `src/fsS3.ts` | 保留（25KB）：DEFAULT_S3_CONFIG 改为 `s3Endpoint=s3.cstcloud.cn` / `region=us-east-1` / `forcePathStyle=true` |
| `src/fsAll.ts` | 保留：FakeFs 抽象基类 |
| `src/baseTypes.ts` | 改：删除 pro/src/baseTypesPro.ts import；保留 S3/Webdav/Dropbox/Onedrive 类型（兼容旧配置） |
| `src/baseTypesObs.ts` | 保留 |
| `src/configPersist.ts` | 保留（加密配置读写） |
| `src/copyLogic.ts` | 保留（文件 diff/copy 核心）；需确认是否删除 `ignorePaths`/`onlyAllowPaths` 读取 |
| `src/importExport.ts` | 改：删除所有 cloud export case；`exportQrCodeUri()` 仅支持 `basic_and_advanced` |
| `src/i18n.ts` | 改：删除 `LANGS_PRO` merge（L5,8）；改为 `const LANGS = LANGS_BASIC` |
| `src/localdb.ts` | 保留（DB 操作）；需确认 `SyncPlanType` 是否还从 pro/src/sync 导入 |
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
| `src/debugMode.ts` | 保留（调用方删除） |

#### B. 新建文件（1 个）

| 文件 | 说明 |
|---|---|
| `src/sync.ts` | **从 `pro/src/sync.ts` 提取核心逻辑**，替代 `main.ts` 中 `import { syncer } from "../pro/src/sync"` |

#### C. 删除文件（4 个）

| 文件 | 大小 |
|---|---|
| `src/fsOnedrive.ts` | 35KB |
| `src/fsWebdav.ts` | 28KB |
| `src/fsDropbox.ts` | 21KB |
| `src/fsWebdis.ts` | 8KB |

#### D. pro/ 目录整体删除（26 个 .ts + langs/）

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
pro/src/yandexApi.ts
pro/tests/conflictLogic.test.ts
pro/tests/sync.test.ts
```

#### E. langs/ 文件改造（3 个）

| 文件 | 改造 |
|---|---|
| `src/langs/en.json` | 删除 62 类 PRO/cloud i18n key（见 tech_v1.md §14.1） |
| `src/langs/zh_cn.json` | 同上 |
| `src/langs/zh_tw.json` | 同上 |

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

### 6.2 数据流

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

### 6.3 关键接口

| 接口 | 文件:行号 | 说明 |
|---|---|---|
| `FakeFsS3` 构造 | `fsS3.ts:179-192` | DEFAULT_S3_CONFIG 含硬编码 endpoint/region |
| `getS3Client()` | `fsS3.ts:230-254` | S3 Client 初始化 |
| `FakeFsS3.walk()` | `fsS3.ts` | 递归遍历 S3 prefix 下所有对象 |
| `FakeFsS3.checkConnect()` | `fsS3.ts` | HeadBucket + ListObjectsV2 验证连通性 |
| `getFs(settings)` | `fsGetter.ts` | 唯一 fs 工厂方法，switch 仅剩 s3 case |
| `syncRun(type)` | `main.ts` | 同步入口，支持 `"manual"` / `"auto"` / `"init"` |
| `loadSettings()` | `main.ts:1338-1511` | 加载配置含 backward compat；新增强制覆盖逻辑 |
| `exportQrCodeUri()` | `importExport.ts` | 仅支持 basic_and_advanced；s3 外字段全部删除 |
| `SyncConfigDirModal` | `settings.ts:681-732` | **保留**，用于选择 vault 目录 |
| `ExportSettingsQrCodeModal` | `settings.ts:734-796` | **保留**，`exportFields` 固定为 `basic_and_advanced` |

---

## 7. 实施步骤（PRD §6 草案）

### Phase 1：清理 - 删除文件和目录

| Step | 动作 | 文件/目录 |
|---|---|---|
| 1 | 删除 OneDrive 适配器 | `src/fsOnedrive.ts` |
| 2 | 删除 WebDAV 适配器 | `src/fsWebdav.ts` |
| 3 | 删除 Dropbox 适配器 | `src/fsDropbox.ts` |
| 4 | 删除 Webdis 适配器 | `src/fsWebdis.ts` |
| 5 | 删除 PRO 目录整体 | `pro/` 全部内容（26 .ts + langs/ + tests/） |

### Phase 2：清理 - 删除 import 和调用

| Step | 动作 | 位置 |
|---|---|---|
| 6 | 删除 `main.ts:20-65` 所有 pro/src/ 和 free cloud import | `main.ts` |
| 7 | 删除 `fsGetter.ts` 所有 pro/src/ import 和 11 个 case 分支 | `fsGetter.ts` |
| 8 | 删除 `settings.ts:1-70` 所有 pro/src/ import | `settings.ts` |
| 9 | 删除 `baseTypes.ts:6-15` pro/src/baseTypesPro.ts import | `baseTypes.ts` |
| 10 | 删除 `i18n.ts:5,8` LANGS_PRO import 和 merge | `i18n.ts` |
| 11 | 删除 `importExport.ts:4` getShrinkedSettingsOnedriveFull import | `importExport.ts` |
| 12 | 删除 `localdb.ts:9` SyncPlanType 从 pro/src/sync 的 import | `localdb.ts` |
| 13 | 删除 `syncAlgoV3Notice.ts:3` pro import | `syncAlgoV3Notice.ts` |
| 14 | 删除 `main.ts:604-1169` 所有 OAuth callback handler | `main.ts` |

### Phase 3：改造 - settings.ts

| Step | 动作 | 位置 |
|---|---|---|
| 15 | 删除 `settings.ts:72-157` PasswordModal | `settings.ts` |
| 16 | 删除 `settings.ts:159-196` EncryptionMethodModal | `settings.ts` |
| 17 | 删除 `settings.ts:374-535` DropboxAuthModal | `settings.ts` |
| 18 | 删除 `settings.ts:537-679` OnedriveAuthModal / OnedriveRevokeAuthModal | `settings.ts` |
| 19 | 删除 `settings.ts:1150-1930` dropboxDiv / onedriveDiv / webdavDiv / webdisDiv / 所有 PRO Setting 调用 | `settings.ts` |
| 20 | 删除 `settings.ts:1938-2029` serviceType dropdown（改为隐藏或删除） | `settings.ts` |
| 21 | 删除 `settings.ts:2038-2086` password + encryptionMethod Setting | `settings.ts` |
| 22 | 删除 `settings.ts:2152-2171` syncOnSave Setting | `settings.ts` |
| 23 | 删除 `settings.ts:2229-2269` ignorePaths + onlyAllowPaths Setting | `settings.ts` |
| 24 | 删除 `settings.ts:2426` generateClearDupFilesSettingsPart 调用 | `settings.ts` |
| 25 | 删除 `settings.ts:2574-2768` import/export 区块 + proDiv | `settings.ts` |
| 26 | 删除 `settings.ts:2777-2998` logLevel + console + obfuscate + profiler + vaultid + resetCache | `settings.ts` |
| 27 | 删除 `settings.ts:2832-2901` 5 个 export sync plans 按钮 | `settings.ts` |

### Phase 4：硬编码 + 配置改造

| Step | 动作 | 位置 |
|---|---|---|
| 28 | 修改 `manifest.json`：id→cstcloud-sync，name→cstcloud-sync，description 修改，删除 fundingUrl | `manifest.json` |
| 29 | 修改 `package.json`：name→cstcloud-sync，license→Apache-2.0，删除 9 个云服务依赖 | `package.json` |
| 30 | 修改 `esbuild.config.mjs`：删除 L17-33 OAuth 环境变量，删除 L67-81 global define | `esbuild.config.mjs` |
| 31 | 修改 `main.ts DEFAULT_SETTINGS`：硬编码 serviceType="s3" / currLogLevel="info" / obfuscateSettingFile=true | `main.ts:115-157` |
| 32 | 修改 `fsS3.ts DEFAULT_S3_CONFIG`：硬编码 endpoint/region/forcePathStyle | `fsS3.ts:179-192` |
| 33 | 修改 `main.ts:loadSettings()`：新增 5 项强制覆盖（serviceType/syncOnSave/ignorePaths/onlyAllowPaths/currLogLevel） | `main.ts:1338-1511` |
| 34 | 新建 `src/sync.ts`：从 `pro/src/sync.ts` 提取核心 syncer 逻辑 | `src/sync.ts` |
| 35 | 修改 `main.ts:488`：将 syncer import 改为从 `../src/sync` | `main.ts` |
| 36 | 修改 `fsGetter.ts`：switch 仅剩 s3 case，default 抛出 `cstcloud-sync only supports S3` | `fsGetter.ts` |
| 37 | 修改 `importExport.ts`：exportQrCodeUri 仅支持 basic_and_advanced | `importExport.ts` |
| 38 | 修改 `i18n.ts`：删除 LANGS_PRO merge | `i18n.ts` |
| 39 | 改造 `langs/en.json` + `zh_cn.json` + `zh_tw.json`：删除 62 类 PRO/cloud key | `src/langs/*.json` |
| 40 | 改造 `main.ts:1171-1175`：aria-label 可改为"同步" | `main.ts` |
| 41 | 修改 `main.ts:1230-1292`：删除 4 个 export-sync-plans commands | `main.ts` |
| 42 | 修改 `settings.ts:968-987`：删除 S3 URL style dropdown，代码写死 forcePathStyle | `settings.ts` |
| 43 | 修改 `settings.ts:901-912` + `914-925`：删除 endpoint/region input，默认值改为 cstcloud.cn/us-east-1 | `settings.ts` |
| 44 | 修改 `main.ts:553`：删除所有 cloud expire check | `main.ts` |

### Step Checklist（完整 44 步）

- [ ] Step 1-5：Phase 1 文件删除
- [ ] Step 6-14：Phase 2 import/handler 删除
- [ ] Step 15-27：Phase 3 settings.ts 大删
- [ ] Step 28-30：manifest / package.json / esbuild.config.mjs
- [ ] Step 31-33：硬编码 + backward compat
- [ ] Step 34：新建 src/sync.ts
- [ ] Step 35-39：import 修复 + i18n 改造
- [ ] Step 40-44：UI 清理 + command 删除

---

## 8. 里程碑与排期（PRD §7 草案）

| 里程碑 | 内容 | 估时 |
|---|---|---|
| M1：干净删除 | Phase 1-3 完成，src 目录仅剩保留文件，pro/ 删除，无编译错误 | 4h |
| M2：硬编码验证 | Step 28-33 完成，manifest.json 正确，DEFAULT_SETTINGS 硬编码验证 | 2h |
| M3：功能验证 | Step 34-39 完成，syncRun 流程通，import/export 可用，i18n 无 key 缺失 | 4h |
| M4：E2E 验证 | Obsidian 中安装插件，配置 AccessKey/SecretKey/Bucket，检查连接通过，单向同步通过，双向同步通过 | 4h |

**总估时：14h（约 2 人日）**

---

## 9. 风险与依赖（PRD §8 草案）

| ID | 风险 | 等级 | 缓解 |
|---|---|---|---|
| R1 | `copyLogic.ts` 读取 `ignorePaths`/`onlyAllowPaths`，UI 删除后字段仍被处理 | 中 | 确认 copyLogic.ts 是否读取；若读取则在 sync 核心路径中强制覆盖为空 |
| R2 | `syncOnSaveAfterMilliseconds` 逻辑已保留但无 UI，旧配置可能触发意外行为 | 中 | `loadSettings()` 中强制覆盖为 `-1` |
| R3 | 旧 data.json 含 PRO 字段，`loadSettings()` backward compat 可能产生副作用 | 低 | 验证 `loadSettings()` 不对 PRO 字段进行任何填充/读取 |
| R4 | `pro/src/sync.ts` 提取到 `src/sync.ts` 可能遗漏依赖（如 `SyncPlanType`） | 中 | 提取后对比 import 列表，确保所有类型在 src 层可获得 |
| R5 | `fsS3.ts` 保留完整，但 `ObsHttpHandler`（Obsidian requestUrl 封装）可能在 S3 cstcloud.cn 上有兼容问题 | 低 | M4 E2E 验证时重点测试连接 |
| R6 | i18n key 大面积删除，可能导致 `mustache.render` 报错（missing key） | 低 | 英文 fallback 会兜底；确认 `t()` 函数对 missing key 的容错 |
| R7 | `qrcode` / `ExportSettingsQrCodeModal` 保留但 exportFields 固定，可能有未清理的分支逻辑 | 低 | Step 37 审查 importExport.ts 中所有非 basic_and_advanced 分支 |
| R8 | `localdb.ts:9` SyncPlanType import 删除可能影响 `clearAllSyncPlanRecords()` 功能 | 低 | 确认 SyncPlanType 是否定义在 src 层，或需要在 src/sync.ts 中保留 |

---

## 10. 验收标准（PRD §9 草案）

| ID | AC | 验证方式 |
|---|---|---|
| AC1 | 插件安装后 plugin id 为 `cstcloud-sync`，名称为 `cstcloud-sync` | 读取 manifest.json 验证 |
| AC2 | 设置页面仅显示 AccessKey / SecretKey / Bucket 三个 S3 必填字段 + 14 个 P1 可选字段，无其他云服务 | 手动检查 UI |
| AC3 | Endpoint / Region / S3 URL Style / Log Level / Obfuscate 均不在 UI 中显示 | 手动检查 UI |
| AC4 | "检查连接"按钮点击后成功验证 S3 连通性（或返回明确错误） | E2E 测试 |
| AC5 | Ribbon 图标点击触发 `start-sync`，命令面板两个命令均可用 | E2E 测试 |
| AC6 | `npm run build2` 无错误完成，生成 `main.js` | CI / 本地构建 |
| AC7 | `npm test` 无新增测试失败（上游 mocha 测试） | CI / 本地测试 |
| AC8 | 插件加载后 `data.json` 中 `serviceType` 被强制覆盖为 `"s3"`（旧配置升级） | 首次加载后读取 data.json |

---

## 11. 副本同步位置

| 类型 | 路径 |
|---|---|
| **源文件** | `/root/.openclaw/Project/cstcloud-sync/decomp_claudecode_v1.md` |
| **副本路径** | 未同步（副本同步是 PM 职责） |
| **源文件 md5** | 待计算（写入后 md5sum 验证） |
