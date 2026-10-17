# cstcloud-sync 技术分析报告 v1

> 基于上游 remotely-save v0.5.25 + 任务书 /home/WPS/NEW/remotely_save.md

---

## 1. 项目概述

| 项目 | 值 |
|---|---|
| 上游 | remotely-save v0.5.25 (fyears) |
| 目标名称 | cstcloud-sync |
| plugin-id | `remotely-save` → `cstcloud-sync` |
| package 名 | `remotely-save` → `cstcloud-sync` |
| license | Apache-2.0 |
| 目标 endpoint | s3.cstcloud.cn (us-east-1) |
| 目标 S3 URL style | Path-Style (hardcoded) |
| 架构 | 保留 S3 适配器 + fsAll 抽象层，删除其他所有云服务 |

---

## 2. 功能裁剪明细

任务书 30+ 项逐条对照上游代码位置：

### 2.1 服务选择与 S3 配置（全部硬编码或保留）

| 功能 | 任务书动作 | 上游代码位置 | 改造方式 |
|---|---|---|---|
| 选择远程服务 | **硬编码 S3**、不显示 | `settings.ts:1938-2029` (serviceType dropdown) | 删除 dropdown；`serviceType` 固定为 `"s3"` |
| 服务地址 (Endpoint) | **硬编码 s3.cstcloud.cn** | `settings.ts:901-912` | 删除 input；默认值改为 `s3.cstcloud.cn` |
| 区域 (Region) | **硬编码 us-east-1** | `settings.ts:914-925` | 删除 input；默认值改为 `us-east-1` |
| Access Key ID | 保留 | `settings.ts:927-939` | 保留手工输入 |
| Secret Access Key | 保留 | `settings.ts:941-953` | 保留手工输入 |
| 存储桶名字 | 保留 | `settings.ts:955-966` | 保留手工输入 |
| S3 URL style | **硬编码 Path-Style** | `settings.ts:968-987` | 删除 dropdown；代码写死 `forcePathStyle=true` |
| 分块并行度 | 保留 | `settings.ts:1015-1034` | 保留 dropdown (1/2/3/5/10/15/20) |
| 检查可否连接 | 保留 | `settings.ts:1125-1148` | 保留按钮 |

### 2.2 删除功能（完全移除 UI 和逻辑）

| 功能 | 任务书动作 | 上游代码位置 | 改造方式 |
|---|---|---|---|
| 使用准确的文件修改时间 (useAccurateMTime) | **删除** | `settings.ts:1036-1056` | 删除整个 Setting 块；默认 false |
| 修改远端前缀路径 (remotePrefix) | **删除** | `settings.ts:1058-1079` | 删除 Setting 和 `ChangeS3RemotePrefixModal` |
| S3 反向代理地址 (reverseProxyNoSignUrl) | **删除** | `settings.ts:1080-1091` | 删除整个 Setting 块 |
| 是否生成文件夹 Object (generateFolderObject) | **删除** | `settings.ts:1093-1123` | 删除整个 Setting 块；默认 false |
| 密码 (password) | **删除 UI** | `settings.ts:2038-2064` | 删除 password Setting + `PasswordModal` 组件 (settings.ts:72-157) |
| 自动运行 (autoRunEveryMilliseconds) | **保留** | `settings.ts:2088-2124` | 保留 |
| 启动后自动运行一次 (initRunAfterMilliseconds) | **保留** | `settings.ts:2126-2150` | 保留 |
| 保存时同步 (syncOnSaveAfterMilliseconds) | **删除** | `settings.ts:2152-2171` | 删除整个 Setting 块 |
| 跳过大文件 (skipSizeLargerThan) | **保留** | `settings.ts:2173-2189` | 保留 |
| 在状态栏显示上一次成功的同步 (enableStatusBarInfo) | **保留** | `settings.ts:2193-2204` | 保留 |
| 重设上一次成功同步的时间记录 | **保留** | `settings.ts:2206-2227` | 保留按钮 |
| 忽略的文件或文件夹的正则表达式 (ignorePaths) | **删除** | `settings.ts:2229-2248` | 删除整个 Setting 块 |
| 允许同步的文件或文件夹的正则表达式 (onlyAllowPaths) | **删除** | `settings.ts:2250-2269` | 删除整个 Setting 块 |
| 并行度 (concurrency) | **保留** | `settings.ts:2279-2298` | 保留 |
| 同步_文件或文件夹 (syncUnderscoreItems) | **保留** | `settings.ts:2300-2314` | 保留 |
| 同步配置文件夹 (syncConfigDir) | **保留** | `settings.ts:2316-2347` | 保留，含 `SyncConfigDirModal` (settings.ts:681-732) |
| 同步书签 (syncBookmarks) | **保留** | `settings.ts:2349-2368` | 保留 |
| 删除文件到哪里 (deleteToWhere) | **保留** | `settings.ts:2370-2385` | 保留 |
| 处理冲突 (conflictAction) | **保留** | `settings.ts:2387-2424` | 保留（含 smart_conflict） |
| 删除智能处理冲突生成的重复文件 | **删除** | `pro/src/settingsClearDupFiles.ts` | 删除 `generateClearDupFilesSettingsPart` 调用 (settings.ts:2426) |
| 如果修改超过百分比则中止同步 (protectModifyPercentage) | **保留** | `settings.ts:2428-2498` | 保留 |
| 同步方向 (syncDirection) | **保留** | `settings.ts:2500-2531` | 保留 |
| 导入导出部分设置 | **删除** | `settings.ts:2574-2741` | 删除 `ExportSettingsQrCodeModal` 整个区块及所有按钮 |
| 导入 (obsidian:// URI) | **删除** | `settings.ts:2691-2741` | 删除 import text input + confirm button |
| Remotely Save 账号 (PRO) | **删除** | `settings.ts:2747-2768` | 删除 `generateProSettingsPart` 调用和 proDiv |
| 连接 (OAuth callback) | **删除** | `main.ts:586-1169` | 删除所有 `registerObsidianProtocolHandler` 除了基本 COMMAND_URI |
| 修改同步提示信息 (currLogLevel) | **删除** | `settings.ts:2777-2790` | 删除整个 Setting 块；`currLogLevel` 硬编码为 `"info"` |
| 是否混淆保存设置文件 (obfuscateSettingFile) | **删除** | `settings.ts:2804-2826` | 删除整个 Setting 块；`obfuscateSettingFile` 硬编码为 `true` |
| 查看终端输出 | **删除** | `settings.ts:2792-2802` | 删除 `settings_outputsettingsconsole` Setting |
| 导出同步计划 | **删除** | `settings.ts:2832-2901` | 删除所有 5 个 export sync plans 按钮 |
| 删除数据库里的同步计划历史 | **保留** | `settings.ts:2903-2912` | 保留 |
| 删除数据库里的上次同步明细 | **保留** | `settings.ts:2914-2926` | 保留 |
| 导出性能数据记录 | **删除** | `settings.ts:2928-2941` | 删除 export profiler 按钮 |
| 性能收集 (profiler) | **删除** | `settings.ts:2943-2998` | 删除所有 profiler Setting 块 |
| 输出资料库对应的位置和随机分配的 ID | **删除** | `settings.ts:3000-3009` | 删除 output basepath/vaultid 按钮 |
| 重设本地缓存和数据库 (destroyDBs) | **删除** | `settings.ts:3011-3021` | 删除 reset cache 按钮 |

---

## 3. 保留 UI 字段（20 项）+ 硬编码 6 项

### 3.1 保留可配置字段（20 项）

| # | 字段 | Setting 位置 | 代码位置 |
|---|---|---|---|
| 1 | Access Key ID | `settings_s3_accesskeyid` | `settings.ts:927-939` |
| 2 | Secret Access Key | `settings_s3_secretaccesskey` | `settings.ts:941-953` |
| 3 | Bucket 名字 | `settings_s3_bucketname` | `settings.ts:955-966` |
| 4 | 分块并行度 (partsConcurrency) | `settings_s3_parts` | `settings.ts:1015-1034` |
| 5 | 检查可否连接 | `settings_checkonnectivity` | `settings.ts:1125-1148` |
| 6 | 自动运行间隔 | `settings_autorun` | `settings.ts:2088-2124` |
| 7 | 启动后自动运行 | `settings_runoncestartup` | `settings.ts:2126-2150` |
| 8 | 跳过大文件阈值 | `settings_skiplargefiles` | `settings.ts:2173-2189` |
| 9 | 状态栏显示开关 | `settings_enablestatusbar_info` | `settings.ts:2193-2204` |
| 10 | 重设状态栏时间记录 | `settings_resetstatusbar_time` | `settings.ts:2206-2227` |
| 11 | 并行度 (concurrency) | `settings_concurrency` | `settings.ts:2279-2298` |
| 12 | 同步下划线文件 | `settings_syncunderscore` | `settings.ts:2300-2314` |
| 13 | 同步配置文件夹 | `settings_configdir` | `settings.ts:2316-2347` |
| 14 | 同步书签 | `settings_bookmarks` | `settings.ts:2349-2368` |
| 15 | 删除到系统回收站/Obsidian .trash | `settings_deletetowhere` | `settings.ts:2370-2385` |
| 16 | 冲突处理策略 | `settings_conflictaction` | `settings.ts:2387-2424` |
| 17 | 保护修改百分比 | `settings_protectmodifypercentage` | `settings.ts:2428-2498` |
| 18 | 同步方向 | `setting_syncdirection` | `settings.ts:2500-2531` |
| 19 | 删除同步计划历史 | `settings_delsyncplans` | `settings.ts:2903-2912` |
| 20 | 删除上次同步明细 | `settings_delprevsync` | `settings.ts:2914-2926` |

### 3.2 硬编码 6 项

| # | 字段 | 硬编码值 | 位置 |
|---|---|---|---|
| 1 | `serviceType` | `"s3"` | `main.ts:129`, `baseTypes.ts:30-42` |
| 2 | `s3.s3Endpoint` | `"s3.cstcloud.cn"` | `fsS3.ts:179-192` DEFAULT_S3_CONFIG |
| 3 | `s3.s3Region` | `"us-east-1"` | `fsS3.ts:179-192` DEFAULT_S3_CONFIG |
| 4 | `s3.forcePathStyle` | `true` (Path-Style) | `fsS3.ts:179-192` DEFAULT_S3_CONFIG; `settings.ts:968-987` 强制写死 |
| 5 | `currLogLevel` | `"info"` | `main.ts:130` DEFAULT_SETTINGS |
| 6 | `obfuscateSettingFile` | `true` | `main.ts:152` DEFAULT_SETTINGS |

---

## 4. 删除功能列表

| 删除项 | 上游代码文件 | 具体位置 | 改造方式 |
|---|---|---|---|
| useAccurateMTime | `settings.ts` | L1036-1056 | 删除 Setting，代码中默认值 false |
| remotePrefix (S3 前缀) | `settings.ts` | L1058-1079, `ChangeS3RemotePrefixModal` L296-372 | 删除 Modal 类和 Setting |
| reverseProxyNoSignUrl | `settings.ts` | L1080-1091 | 删除 Setting |
| generateFolderObject | `settings.ts` | L1093-1123 | 删除 Setting，默认 false |
| password / 端到端加密 UI | `settings.ts` | L2038-2064, `PasswordModal` L72-157, `EncryptionMethodModal` L159-196 | 删除 Setting + 两个 Modal 类 |
| syncOnSaveAfterMilliseconds | `settings.ts` | L2152-2171 | 删除 Setting，逻辑代码保留但无 UI |
| ignorePaths | `settings.ts` | L2229-2248 | 删除 Setting |
| onlyAllowPaths | `settings.ts` | L2250-2269 | 删除 Setting |
| currLogLevel (UI 修改入口) | `settings.ts` | L2777-2790 | 删除 Setting，但变量保留（硬编码 info） |
| obfuscateSettingFile (UI 修改入口) | `settings.ts` | L2804-2826 | 删除 Setting，硬编码 true |
| settings_outputsettingsconsole | `settings.ts` | L2792-2802 | 删除 Setting |
| export sync plans (5 个按钮) | `settings.ts` | L2832-2901 | 删除全部 5 个按钮 |
| profiler (全部) | `settings.ts` | L2928-2998 | 删除全部 4 个 profiler Setting |
| output basepath/vaultid | `settings.ts` | L3000-3009 | 删除按钮 |
| reset cache | `settings.ts` | L3011-3021 | 删除按钮 |
| import text + confirm | `settings.ts` | L2691-2741 | 删除 import 部分 UI |
| export settings QR (全部按钮) | `settings.ts` | L2579-2689 | 删除全部 12 个 export 按钮 |
| smart_conflict 的 clear dup files | `settings.ts` | L2426, `pro/src/settingsClearDupFiles.ts` | 删除 `generateClearDupFilesSettingsPart` 调用 |

---

## 5. 删除云服务

### 5.1 OneDrive free (App Folder) — 含 msal-browser

| 删除项 | 文件路径 | 改造方式 |
|---|---|---|
| fsOnedrive.ts | `src/fsOnedrive.ts` (35KB) | **整个文件删除** |
| msal-browser 依赖 | `package.json` | 从 dependencies 删除 `@microsoft/microsoft-graph-client`；devDependencies 删除 `@microsoft/microsoft-graph-types` |
| OAuth callback | `main.ts:703-785` | 删除 `COMMAND_CALLBACK_ONEDRIVE` handler |
| Setting tab 部分 | `settings.ts:1334-1485` | 删除 `onedriveDiv` 整个区块 + `OnedriveAuthModal` (L537-609) + `OnedriveRevokeAuthModal` (L611-679) |
| DEFAULT_ONEDRIVE_CONFIG | `baseTypes.ts:109-122` | 保留类型定义，但 default settings 中不再初始化 |
| `sendAuthReqOnedrive` / `setConfigBySuccessfullAuthInplaceOnedrive` | `fsOnedrive.ts` | 随文件删除 |

### 5.2 WebDAV

| 删除项 | 文件路径 | 改造方式 |
|---|---|---|
| fsWebdav.ts | `src/fsWebdav.ts` (28KB) | **整个文件删除** |
| `DEFAULT_WEBDAV_CONFIG` | `settings.ts:94` | 删除 import |
| WebDAV Setting 部分 | `settings.ts:1487-1714` | 删除 `webdavDiv` 整个区块 |
| `FakeFsWebdav` | `fsGetter.ts:27-32` | 删除 case 分支 |

### 5.3 Dropbox

| 删除项 | 文件路径 | 改造方式 |
|---|---|---|
| fsDropbox.ts | `src/fsDropbox.ts` (21KB) | **整个文件删除** |
| `DEFAULT_DROPBOX_CONFIG` | `main.ts:80-83` | 删除 import |
| OAuth callback | `main.ts:615-701` | 删除 `COMMAND_CALLBACK_DROPBOX` handler |
| DropboxAuthModal | `settings.ts:374-535` | 删除 Modal 类 |
| Dropbox Setting 部分 | `settings.ts:1150-1328` | 删除 `dropboxDiv` 整个区块 |
| `FakeFsDropbox` | `fsGetter.ts:33-38` | 删除 case 分支 |
| Dropbox OAuth 环境变量 | `esbuild.config.mjs:17` | `DEFAULT_DROPBOX_APP_KEY` 删除 |

### 5.4 Webdis

| 删除项 | 文件路径 | 改造方式 |
|---|---|---|
| fsWebdis.ts | `src/fsWebdis.ts` (8KB) | **整个文件删除** |
| `DEFAULT_WEBDIS_CONFIG` | `main.ts:95` | 删除 import |
| Webdis Setting 部分 | `settings.ts:1716-1839` | 删除 `webdisDiv` 整个区块 |
| `FakeFsWebdis` | `fsGetter.ts:51-56` | 删除 case 分支 |

---

## 6. 删除 PRO 目录

### 6.1 pro/ 目录文件清单（全部删除）

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
pro/src/langs/index.ts         ← 含 en.json / zh_cn.json / zh_tw.json
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
pro/src/sync.ts
pro/src/yandexApi.ts
pro/tests/conflictLogic.test.ts
pro/tests/sync.test.ts
```

**共 26 个 .ts 文件 + 459 行 pro/src/langs**

### 6.2 改造点

| 位置 | 改造方式 |
|---|---|
| `main.ts:20-65` | 删除所有 `../pro/src/...` import 语句 |
| `main.ts:115-157` DEFAULT_SETTINGS | 删除 `googledrive`/`box`/`pcloud`/`yandexdisk`/`koofr`/`azureblobstorage`/`pro` 字段 |
| `main.ts:488` | 删除 `syncer` 从 pro/src/sync 的 import，改为从 src 层导入（需新建） |
| `settings.ts:24-32` | 删除所有 `../pro/src/settings*.ts` import |
| `settings.ts:1845-1930` | 删除 generateOnedriveFullSettingsPart / GoogleDrive / Box / PCloud / YandexDisk / Koofr / AzureBlobStorage 调用 |
| `settings.ts:2747-2768` | 删除 generateProSettingsPart 调用 |
| `fsGetter.ts:1-14` | 删除所有 pro/src/ fs 适配器 import |
| `fsGetter.ts:45-80` | 删除 onedrivefull / googledrive / box / pcloud / yandexdisk / koofr / azureblobstorage case 分支 |
| `baseTypes.ts:6-15` | 删除 pro/src/baseTypesPro.ts 类型 import |
| `i18n.ts:5` | 删除 `LANGS_PRO` import 和 merge |
| `importExport.ts:4` | 删除 `getShrinkedSettingsOnedriveFull` import |
| `localdb.ts:9` | 删除 `SyncPlanType` 从 pro/src/sync 的 import |
| `syncAlgoV3Notice.ts:3` | 删除 pro import |

---

## 7. 删除端到端加密 UI

### 7.1 PasswordModal 组件

| 项目 | 详情 |
|---|---|
| 文件位置 | `settings.ts:72-157` |
| 类名 | `PasswordModal` |
| i18n key | `modal_password_title` / `modal_password_shortdesc` / `modal_password_attn1-5` / `modal_password_secondconfirm` / `modal_password_notice` |
| 删除方式 | 整个类删除；调用处 `settings.ts:2054-2063` 删除 |

### 7.2 EncryptionMethodModal 组件

| 项目 | 详情 |
|---|---|
| 文件位置 | `settings.ts:159-196` |
| 类名 | `EncryptionMethodModal` |
| i18n key | `modal_encryptionmethod_title` / `modal_encryptionmethod_shortdesc` |
| 删除方式 | 整个类删除；调用处 `settings.ts:2082-2085` 删除 |

### 7.3 相关 Setting UI 删除

| Setting | 位置 | i18n key |
|---|---|---|
| password 输入框 + confirm | `settings.ts:2038-2064` | `settings_password` / `settings_password_desc` |
| encryptionMethod dropdown | `settings.ts:2071-2086` | `settings_encryptionmethod` / `settings_encryptionmethod_desc` |
| encryptionMethodSetting 变量 | `settings.ts:2039` | 控制 `settings-encryption-method-hide` class |

### 7.4 后端加密逻辑处理

- `fsEncrypt.ts` (`src/fsEncrypt.ts`) — **保留文件**，加密逻辑在后端仍然需要（作为 FakeFsEncrypt wrapper）
- `encryptOpenSSL.ts` / `encryptRClone.ts` — **保留文件**，加密实现仍然需要
- `main.ts:257-261` — `FakeFsEncrypt` 仍然被实例化，但 `password` 为空字符串时相当于 passthrough
- `encryptionMethod` 字段在 settings 中仍然存在（用于兼容旧配置），但无 UI 修改入口

---

## 8. 删除 SDK 依赖

### 8.1 package.json 改造

| 依赖 | 类型 | 改造 |
|---|---|---|
| `@microsoft/microsoft-graph-client` | dependencies | **删除** |
| `@microsoft/microsoft-graph-types` | devDependencies | **删除** |
| `box-typescript-sdk-gen` | dependencies | **删除** |
| `googleapis` | 未直接可见（由 pro 引入） | 由 pro/ 删除而清除 |
| `koofr-api` | 未直接可见（由 pro 引入） | 由 pro/ 删除而清除 |
| `@azure/msal-node` | dependencies | **删除** |
| `dropbox` | dependencies | **删除** |
| `pcloud-sdk-js` | dependencies | **删除** |
| `webdav` | dependencies | **删除** |

**注意**：`@aws-sdk/client-s3` / `@aws-sdk/lib-storage` / `@aws-sdk/signature-v4-crt` — **保留**，S3 适配器依赖。

---

## 9. 删除 OAuth 环境变量

### 9.1 esbuild.config.mjs 改造

| 行 | 变量名 | 任务书动作 |
|---|---|---|
| 17 | `DEFAULT_DROPBOX_APP_KEY` | **删除** |
| 18 | `DEFAULT_ONEDRIVE_CLIENT_ID` | **删除** |
| 19 | `DEFAULT_ONEDRIVE_AUTHORITY` | **删除** |
| 20 | `DEFAULT_REMOTELYSAVE_WEBSITE` | **删除**（PRO） |
| 21 | `DEFAULT_REMOTELYSAVE_CLIENT_ID` | **删除**（PRO） |
| 22 | `DEFAULT_GOOGLEDRIVE_CLIENT_ID` | **删除**（PRO） |
| 23-24 | `DEFAULT_GOOGLEDRIVE_CLIENT_SECRET` | **删除**（PRO） |
| 25 | `DEFAULT_BOX_CLIENT_ID` | **删除**（PRO） |
| 26 | `DEFAULT_BOX_CLIENT_SECRET` | **删除**（PRO） |
| 27 | `DEFAULT_PCLOUD_CLIENT_ID` | **删除**（PRO） |
| 28 | `DEFAULT_PCLOUD_CLIENT_SECRET` | **删除**（PRO） |
| 29 | `DEFAULT_YANDEXDISK_CLIENT_ID` | **删除**（PRO） |
| 30-31 | `DEFAULT_YANDEXDISK_CLIENT_SECRET` | **删除**（PRO） |
| 32 | `DEFAULT_KOOFR_CLIENT_ID` | **删除**（PRO） |
| 33 | `DEFAULT_KOOFR_CLIENT_SECRET` | **删除**（PRO） |

**15 个 OAuth 环境变量全部删除 → 0 个**

### 9.2 esbuild define 块改造

`esbuild.config.mjs:66-91` 中所有 `global.DEFAULT_*` define 全部删除。

---

## 10. 保留机制

### 10.1 Ribbon 图标 + 提示词改造

| 项目 | 详情 |
|---|---|
| 文件位置 | `main.ts:1171-1175` |
| 图标 | 保留 `iconNameSyncWait` / `iconNameSyncRunning` |
| 提示词 | `main.ts:423` 中 `aria-label` 从 `${this.manifest.name}` 可改为"同步" |
| 点击行为 | 保留 `() => this.syncRun("manual")` |

### 10.2 命令面板同步命令

| 命令 ID | 命令名 | 位置 |
|---|---|---|
| `start-sync` | `t("command_startsync")` | `main.ts:1212-1219` |
| `start-sync-dry-run` | `t("command_drynrun")` | `main.ts:1221-1228` |

**保留**。其他命令（export sync plans 系列）**删除**。

### 10.3 自动同步 schedule loop

| 机制 | 位置 | 详情 |
|---|---|---|
| `enableAutoSyncIfSet()` | `main.ts:1757-1771` | `autoRunEveryMilliseconds` > 0 时注册 interval |
| `enableInitSyncIfSet()` | `main.ts:1773-1785` | `initRunAfterMilliseconds` > 0 时一次性触发 |
| `toggleSyncOnSaveIfSet()` | `main.ts:1849-1874` | `syncOnSaveAfterMilliseconds` > 0 时注册事件监听（**UI 已删除但逻辑保留**） |
| `enableAutoClearSyncPlanHist()` | `main.ts:2077-2093` | 定期清理过期同步计划记录 |

### 10.4 Status Bar 状态栏

| 项目 | 位置 |
|---|---|
| 创建 | `main.ts:1180-1210` |
| 更新逻辑 | `main.ts:1925-2031` (`updateLastSyncMsg`) |
| 30 秒轮询 | `main.ts:1197-1209` |

---

## 11. 架构设计

### 11.1 30 个 src 文件改造分类

| 类别 | 文件 | 改造 |
|---|---|---|
| **保留** | `src/main.ts` | 修改：删除 PRO/OAuth/cloud 初始化，保留 S3 sync 核心 |
| **保留** | `src/settings.ts` | 修改：删除 OneDrive/Dropbox/WebDAV/Webdis/PRO UI，保留 S3 basic/advanced settings |
| **保留** | `src/fsS3.ts` | 保留（25KB） |
| **保留** | `src/fsAll.ts` | 保留（FakeFs 抽象基类） |
| **保留** | `src/baseTypes.ts` | 修改：删除 PRO 类型，保留 S3/Webdav/Dropbox/Onedrive 类型定义（供兼容） |
| **保留** | `src/baseTypesObs.ts` | 保留 |
| **保留** | `src/configPersist.ts` | 保留（加密配置读写） |
| **保留** | `src/copyLogic.ts` | 保留 |
| **保留** | `src/importExport.ts` | 修改：删除所有云服务 export case，仅保留 basic_and_advanced export |
| **保留** | `src/i18n.ts` | 修改：删除 LANGS_PRO merge |
| **保留** | `src/localdb.ts` | 保留 |
| **保留** | `src/metadataOnRemote.ts` | 保留 |
| **保留** | `src/misc.ts` | 保留 |
| **保留** | `src/obsFolderLister.ts` | 保留 |
| **保留** | `src/profiler.ts` | 保留（但 UI 删除） |
| **保留** | `src/syncAlgoV3Notice.ts` | 保留 |
| **保留** | `src/worker.d.ts` | 保留 |
| **删除** | `src/fsOnedrive.ts` (35KB) | 全删 |
| **删除** | `src/fsWebdav.ts` (28KB) | 全删 |
| **删除** | `src/fsDropbox.ts` (21KB) | 全删 |
| **删除** | `src/fsWebdis.ts` (8KB) | 全删 |
| **删除** | `src/fsEncrypt.ts` | 保留文件（但 PasswordModal UI 删除） |
| **删除** | `src/encryptOpenSSL.ts` | 保留（加密实现仍需要） |
| **删除** | `src/encryptRClone.ts` | 保留（加密实现仍需要） |
| **删除** | `src/encryptRClone.worker.ts` | 保留（加密实现仍需要） |
| **删除** | `src/debugMode.ts` | 保留（export sync plans 调用点删除） |
| **新建** | `src/sync.ts` (从 pro/src/sync 提取) | 需提取 sync 核心逻辑，替代 `../pro/src/sync` import |
| **删除** | `pro/` 全部 26 个 .ts | 全删 |
| **保留** | `langs/en.json` | 修改：删除 PRO/cloud i18n key |
| **保留** | `langs/zh_cn.json` | 修改：删除 PRO/cloud i18n key |
| **保留** | `langs/zh_tw.json` | 修改：删除 PRO/cloud i18n key |

### 11.2 fsGetter.ts 改造后 case 分支

```typescript
// 改造后仅剩 S3:
switch (settings.serviceType) {
  case "s3":
    return new FakeFsS3(settings.s3);
  default:
    throw Error(`cstcloud-sync only supports S3`);
}
```

---

## 12. 关键模块改造点

### 12.1 main.ts

| 节 | 改造 |
|---|---|
| L20-65 import | 删除所有 `../pro/src/...` 和 free cloud import |
| L115-157 DEFAULT_SETTINGS | 硬编码 `serviceType="s3"`；删除 pro/cloud 字段；`currLogLevel="info"` 硬编码；`obfuscateSettingFile=true` 硬编码 |
| L257-261 FakeFsEncrypt | 保留，但 password 为空时 passthrough |
| L553 checkIfOauthExpires() | 删除所有 cloud expire check 分支 |
| L586-602 COMMAND_URI handler | 保留（import QR 用） |
| L604-1169 | 删除所有 `COMMAND_CALLBACK_*` OAuth handler（dropbox/onedrive/pro/box/pcloud/yandexdisk/koofr） |
| L1171-1175 ribbon | 保留，可改 aria-label 提示词为"同步" |
| L1180-1210 status bar | 保留 |
| L1212-1219 start-sync command | 保留 |
| L1221-1228 start-sync-dry-run command | 保留 |
| L1230-1292 export-sync-plans commands | **删除全部 4 个** |
| L1294 setting tab | 保留（改造后的 RemotelySaveSettingTab） |
| L1338-1511 loadSettings() | 删除 free cloud 字段的 backward-compat 填充逻辑（L1349-1370 dropbox/onedrive，L1376-1395 webdav，L1486-1508 pro fields） |
| L1532-1704 checkIfOauthExpires() | 删除所有 cloud expire check；仅保留 PRO check 或完全删除 |
| L1757-1771 enableAutoSyncIfSet() | 保留 |
| L1849-1874 toggleSyncOnSaveIfSet() | 保留（无 UI 入口但逻辑保留） |

### 12.2 settings.ts

| 节 | 改造 |
|---|---|
| L1-70 import | 删除所有 pro/src/ import |
| L72-196 `PasswordModal` / `EncryptionMethodModal` | **全删** |
| L374-535 `DropboxAuthModal` | **全删** |
| L537-609 `OnedriveAuthModal` | **全删** |
| L611-679 `OnedriveRevokeAuthModal` | **全删** |
| L681-732 `SyncConfigDirModal` | **保留** |
| L734-796 `ExportSettingsQrCodeModal` | **保留**（但 exportFields 仅支持 basic_and_advanced） |
| L1150-1328 dropboxDiv | **全删** |
| L1334-1485 onedriveDiv | **全删** |
| L1487-1714 webdavDiv | **全删** |
| L1716-1839 webdisDiv | **全删** |
| L1845-1930 generate* PRO settings | **全删** |
| L1938-2029 serviceType dropdown | 改为隐藏域或删除 dropdown |
| L2038-2064 password Setting | **全删** |
| L2071-2086 encryptionMethod Setting | **全删** |
| L2088-2124 autoRun | **保留** |
| L2126-2150 initRunAfter | **保留** |
| L2152-2171 syncOnSave | **全删** |
| L2173-2189 skipLargeFiles | **保留** |
| L2229-2248 ignorePaths | **全删** |
| L2250-2269 onlyAllowPaths | **全删** |
| L2279-2298 concurrency | **保留** |
| L2300-2314 syncUnderscore | **保留** |
| L2316-2347 syncConfigDir | **保留** |
| L2349-2368 syncBookmarks | **保留** |
| L2370-2385 deleteToWhere | **保留** |
| L2387-2424 conflictAction | **保留** |
| L2426 generateClearDupFilesSettingsPart | **删除调用** |
| L2428-2498 protectModifyPercentage | **保留** |
| L2500-2531 syncDirection | **保留** |
| L2574-2741 import/export 区块 | **全删**（含所有 export 按钮和 import input） |
| L2747-2768 proDiv | **全删** |
| L2777-2790 currLogLevel | **全删** |
| L2792-2802 outputsettingsconsole | **全删** |
| L2804-2826 obfuscateSettingFile | **全删** |
| L2832-2901 export sync plans | **全删** |
| L2903-2912 delSyncPlans | **保留** |
| L2914-2926 delPrevSync | **保留** |
| L2928-2998 profiler | **全删** |
| L3000-3009 outputbasepathvaultid | **全删** |
| L3011-3021 resetCache | **全删** |

### 12.3 fsS3.ts

| 项目 | 改造 |
|---|---|
| DEFAULT_S3_CONFIG | `s3Endpoint` 默认为 `"s3.cstcloud.cn"`；`s3Region` 默认为 `"us-east-1"`；`forcePathStyle` 默认为 `true` |
| getS3Client() | L230-254 保留，S3 client 初始化逻辑不变 |
| ObsHttpHandler | 保留（Obsidian requestUrl 封装） |
| walk / walkPartial | 保留 |
| mkdir / writeFile / readFile / rm | 保留 |
| checkConnect | 保留 |

### 12.4 fsGetter.ts

- 删除所有 pro/src/ import
- 删除 onedrivefull / googledrive / box / pcloud / yandexdisk / koofr / azureblobstorage / onedrive / webdav / dropbox / webdis case 分支
- 仅保留 `case "s3": return new FakeFsS3(settings.s3);`
- default 分支改为 `throw Error("cstcloud-sync only supports S3");`

### 12.5 importExport.ts

| 改造点 | 详情 |
|---|---|
| `exportQrCodeUri()` | `exportFields === "basic_and_advanced"` 时，删除 s3 外的所有 `delete settings2.cloud`（已无意义，因为这些字段本来就不填）；其他 export type 全删 |
| `parseUriByHand()` / `importQrCodeUri()` | 保留（支持 obsidian:// URI import） |

### 12.6 localdb.ts

- `prepareDBs()` 保留，profileID 仍基于 `serviceType-default-1`
- `destroyDBs()` 保留（无 UI 但可被调用）
- `insertSyncPlanRecordByVault()` 保留（同步时写入）
- `clearAllSyncPlanRecords()` 保留（有 UI 按钮）
- `clearAllPrevSyncRecordByVault()` 保留（有 UI 按钮）
- `upsertLastSuccessSyncTimeByVault()` / `getLastSuccessSyncTimeByVault()` — Status bar 依赖

### 12.7 i18n.ts

- 删除 `LANGS_PRO` merge (`i18n.ts:5,8`)
- 改为 `const LANGS = LANGS_BASIC;`
- 所有 PRO/cloud 翻译 key 不再需要，但英文 fallback 会兜底

---

## 13. 数据兼容性

### 13.1 旧 data.json 兼容规则

| 场景 | 规则 | 风险 |
|---|---|---|
| 旧 data.json 含 PRO 字段 | `loadSettings()` 中删除 `pro` 字段初始化 (L1646-1648)，加载时自动忽略 | **低风险**：PRO 字段被忽略，不影响 free 功能 |
| 旧 data.json 含 free cloud 字段 (dropbox/onedrive/webdav/webdis) | `loadSettings()` 中有 backward compat 填充 (L1349-1395)，但这些字段已无实际作用 | **低风险**：字段存在但无效，不影响 S3 sync |
| 旧 data.json 含 `serviceType="onedrive"` 等 | 代码 hardcode `serviceType="s3"`，旧值被覆盖 | **低风险**：启动时强制重置为 s3 |
| 旧 data.json 含 `ignorePaths` / `onlyAllowPaths` | 字段存在但 Setting UI 已删除，逻辑代码仍执行（settings.ts L2229-2269 已删但 `this.settings.ignorePaths` 在 sync 时可能仍被读取） | **中等风险**：需确认 copyLogic.ts 是否读取 ignorePaths/onlyAllowPaths，若读取则需在 sync 核心逻辑中删除这些字段的处理 |
| 旧 data.json 含 `syncOnSaveAfterMilliseconds` | UI 删除但 `toggleSyncOnSaveIfSet()` 逻辑保留 (main.ts L1849-1874)；若旧设置有值可能触发意外行为 | **中等风险**：需在 `loadSettings()` 中将 `syncOnSaveAfterMilliseconds` 强制重置为 -1 |

### 13.2 兼容处理 required

| 必须在 loadSettings() 中处理 | 代码位置 |
|---|---|
| 强制 `serviceType = "s3"` | 新增 |
| 强制 `syncOnSaveAfterMilliseconds = -1` | 新增 |
| 强制 `ignorePaths = []` | 新增 |
| 强制 `onlyAllowPaths = []` | 新增 |
| 强制 `currLogLevel = "info"` | 新增 |
| 强制 `obfuscateSettingFile = true` | 已存在于 L1449-1451 |
| 删除 `password` 设置（UI 无入口） | 可选，建议强制为空 |

---

## 14. i18n 改造

### 14.1 langs/ 文件中的 key 删/留清单

#### src/langs/en.json — 需要删除的 key（按前缀）

| key 前缀 | 所属功能 | 备注 |
|---|---|---|
| `settings_dropbox_*` | Dropbox | 全删 |
| `settings_onedrive_*` | OneDrive free | 全删 |
| `settings_webdav_*` | WebDAV | 全删 |
| `settings_webdis_*` | Webdis | 全删 |
| `settings_googledrive_*` | Google Drive (PRO) | 全删 |
| `settings_onedrivefull_*` | OneDrive Full (PRO) | 全删 |
| `settings_box_*` | Box (PRO) | 全删 |
| `settings_pcloud_*` | pCloud (PRO) | 全删 |
| `settings_yandexdisk_*` | Yandex Disk (PRO) | 全删 |
| `settings_koofr_*` | Koofr (PRO) | 全删 |
| `settings_azureblobstorage_*` | Azure Blob (PRO) | 全删 |
| `settings_pro` | PRO 账号 | 全删 |
| `settings_encryptionmethod_*` | 端到端加密 | 全删 |
| `settings_password*` | 密码设置 | 全删 |
| `modal_password_*` | 密码 Modal | 全删 |
| `modal_encryptionmethod_*` | 加密方法 Modal | 全删 |
| `modal_dropboxauth_*` | Dropbox Auth Modal | 全删 |
| `modal_onedriveauth_*` | OneDrive Auth Modal | 全删 |
| `modal_onedriverevokeauth_*` | OneDrive Revoke Modal | 全删 |
| `modal_remotebasedir_*` | remoteBaseDir Modal | **保留**（其他云已删，但 S3 不需要此 Modal） |
| `modal_syncconfig_*` | SyncConfigDir Modal | **保留** |
| `settings_skiplargefiles*` | 跳过大文件 | **保留** |
| `settings_ignorepaths*` | 忽略路径 | 全删 |
| `settings_onlyallowpaths*` | 仅允许路径 | 全删 |
| `settings_syncplans*` | 同步计划导出 | 全删 |
| `settings_profiler*` | 性能分析 | 全删 |
| `settings_outputsettingsconsole*` | 终端输出 | 全删 |
| `settings_outputbasepathvaultid*` | 输出路径 ID | 全删 |
| `settings_resetcache*` | 重设缓存 | 全删 |
| `settings_delprevsync*` | 删除上次同步 | **保留** |
| `settings_delsyncplans*` | 删除同步计划 | **保留** |
| `settings_remoteprefix_s3` | S3 前缀路径 | 全删 |
| `settings_s3_accuratemtime*` | useAccurateMTime | 全删 |
| `settings_s3_reverse_proxy*` | 反向代理 | 全删 |
| `settings_s3_generatefolderobject*` | 文件夹对象 | 全删 |
| `settings_checkonnectivity*` | 检查连接 | **保留** |
| `settings_debuglevel*` | 调试级别 | 全删 |
| `settings_obfuscatesettingfile*` | 混淆设置 | 全删 |
| `settings_viewconsolelog*` | 查看日志 | 全删 |
| `settings_synconsave*` | 保存时同步 | 全删 |
| `protocol_dropbox_*` | Dropbox OAuth | 全删 |
| `protocol_onedrive_*` | OneDrive OAuth | 全删 |
| `protocol_onedrivefull_*` | OneDrive Full OAuth | 全删 |
| `protocol_pro_*` | PRO OAuth | 全删 |
| `protocol_box_*` | Box OAuth | 全删 |
| `protocol_pcloud_*` | pCloud OAuth | 全删 |
| `protocol_yandexdisk_*` | Yandex Disk OAuth | 全删 |
| `protocol_koofr_*` | Koofr OAuth | 全删 |

#### src/langs/en.json — 需要保留的 key

| key | 所属功能 |
|---|---|
| `settings_chooseservice*` | 服务选择（但 dropdown 删） |
| `settings_s3*` (除 accuratemtime/reverse_proxy/generatefolderobject/remoteprefix) | S3 配置 |
| `settings_basic*` (部分) | 基础设置 |
| `settings_autorun*` | 自动运行 |
| `settings_runoncestartup*` | 启动后运行 |
| `settings_enablestatusbar*` | 状态栏 |
| `settings_resetstatusbar*` | 重设状态栏 |
| `settings_concurrency*` | 并行度 |
| `settings_syncunderscore*` | 下划线文件 |
| `settings_configdir*` | 配置文件夹 |
| `settings_bookmarks*` | 书签 |
| `settings_deletetowhere*` | 删除位置 |
| `settings_conflictaction*` | 冲突处理 |
| `settings_protectmodify*` | 保护百分比 |
| `setting_syncdirection*` | 同步方向 |
| `command_startsync` | 开始同步命令 |
| `command_drynrun` | 试运行命令 |
| `statusbar_*` | 状态栏文字 |
| `syncrun_*` | 同步过程提示 |
| `modal_syncconfig_*` | 配置文件夹确认 |
| `modal_qr_*` | QR 导出 |
| `settings_importexport*` | 导入导出标题（可删） |
| `settings_export*` | 导出按钮文字（大量删减） |
| `settings_import*` | 导入（可简化） |
| `settings_debug*` | 调试标题（部分保留） |

#### pro/src/langs/ — 全部删除

```
pro/src/langs/en.json      → 删除
pro/src/langs/zh_cn.json   → 删除
pro/src/langs/zh_tw.json   → 删除
pro/src/langs/index.ts     → 删除
```

---

## 15. manifest / package.json 改造

### 15.1 manifest.json 改造

| 字段 | 上游值 | 改造后值 |
|---|---|---|
| `id` | `"remotely-save"` | `"cstcloud-sync"` |
| `name` | `"Remotely Save"` | `"cstcloud-sync"` |
| `version` | `"0.5.25"` | `"0.5.25"` 或自定 |
| `minAppVersion` | `"0.13.21"` | 保留 |
| `description` | `"Yet another unofficial plugin..."` | 改为描述 S3 同步 |
| `author` | `"fyears"` | 保留或修改 |
| `authorUrl` | `"https://github.com/fyears"` | 可修改 |
| `fundingUrl` | `"https://remotelysave.com"` | **删除** |

### 15.2 package.json 改造

| 字段 | 上游值 | 改造后值 |
|---|---|---|
| `name` | `"remotely-save"` | `"cstcloud-sync"` |
| `version` | `"0.5.25"` | 保留或自定 |
| `description` | `"This is yet another sync plugin..."` | 改为描述 S3 同步 |
| `license` | `"SEE LICENSE IN LICENSE"` | `"Apache-2.0"` |
| `scripts.build2` | `node esbuild.config.mjs production` | **保留**（esbuild 构建入口） |
| `scripts.build` | `webpack --mode production` | **保留**（webpack 构建入口） |
| `devDependencies` | 保留 `obsidian` / `typescript` 等 | 保留 |
| `dependencies` | 见下方 | 大幅删减 |

**dependencies 删减明细：**

| 删除 | 保留 |
|---|---|
| `@azure/msal-node` | `@aws-sdk/client-s3` |
| `@microsoft/microsoft-graph-client` | `@aws-sdk/lib-storage` |
| `box-typescript-sdk-gen` | `@aws-sdk/signature-v4-crt` |
| `dropbox` | `@aws-sdk/types` |
| `googleapis` (由 pro 引入) | `@fyears/rclone-crypt` (加密用) |
| `koofr-api` (由 pro 引入) | `@fyears/tsqueue` |
| `pcloud-sdk-js` | `@sanity/diff-match-patch` |
| `webdav` | `localforage` + localforage-* |
| | `lodash` / `nanoid` / `mustache` / `mime-types` |
| | `qrcode` / `xregexp` / `rfc4648` |
| | `p-queue` / `aggregate-error` |
| | `path-browserify` / `process` / `stream-browserify` |
| | `crypto-browserify` / `buffer` / `assert` / `util` / `url` |
| | `acorn` / `openapi-fetch` / `node-diff3` |
| | `emoji-regex` / `http-status-codes` / `rimraf` / `lucide` |

---

## 附录：改造后 src 文件一览

```
src/
├── main.ts              (改造：删除PRO/OAuth/free cloud)
├── settings.ts          (改造：删除free cloud/PRO/加密UI)
├── fsS3.ts             (保留)
├── fsAll.ts            (保留)
├── fsGetter.ts         (改造：仅保留S3 case)
├── baseTypes.ts        (改造：删除PRO类型，保留基础类型)
├── baseTypesObs.ts     (保留)
├── configPersist.ts    (保留)
├── copyLogic.ts        (保留)
├── importExport.ts     (改造：删除cloud export)
├── i18n.ts             (改造：删除LANGS_PRO)
├── localdb.ts          (保留)
├── metadataOnRemote.ts (保留)
├── misc.ts             (保留)
├── obsFolderLister.ts  (保留)
├── profiler.ts         (保留（但UI删除）)
├── syncAlgoV3Notice.ts (保留)
├── encryptOpenSSL.ts   (保留)
├── encryptRClone.ts    (保留)
├── encryptRClone.worker.ts (保留)
├── fsEncrypt.ts        (保留（但PasswordModal删除）)
├── debugMode.ts        (保留（调用方删除）)
├── worker.d.ts         (保留)
├── fsOnedrive.ts       (删除)
├── fsWebdav.ts         (删除)
├── fsDropbox.ts        (删除)
├── fsWebdis.ts         (删除)
└── langs/
    ├── index.ts        (改造：删除LANGS_PRO)
    ├── en.json         (改造：删除cloud/PRO key)
    ├── zh_cn.json      (同上)
    └── zh_tw.json      (同上)

pro/                    (全部删除，26个.ts + langs/)
```
