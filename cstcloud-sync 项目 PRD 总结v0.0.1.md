# cstcloud-sync 项目 PRD 总结

> [!WARNING]
> **⚠️ 本文档为历史归档（v1.0/v1.1 规划期记录）** —— 其中关于端到端加密「保留」的结论**已失效**：加密后端已于 cstcloud-sync v0.0.2 / PRD v1.3 Step 75-77 全部移除（历史归档）。

**来源**: 飞书卡片消息 (pm 智能体)
**原始消息ID**: om_x100b6215296348bcc01a235e561f17a
**发送者**: ou_9eb86a60f4a0f2925b72ec1c63e2b6a2
**接收时间**: 2026-10-16 20:20 (GMT+8)
**智能体**: pm
**模型**: MiniMax-M3
**Provider**: minimax

---

## 一句话定位

把 upstream `remotely-save v0.5.25`（Apache-2.0）改造为**仅支持 S3/cstcloud.cn** 的 Obsidian 双向同步插件，独立品牌 `cstcloud-sync`，从 0.0.1 起步。

---

## 1. 核心改造规模

| 维度 | 数量 | 备注 |
| -------- | -------- | -------- |
| 总实施步骤 | **44 步** | 分 4 个 Phase |
| 总工期 | **16h（约 2 人日）** | M1~M4 |
| 源文件改造 | **25 保留 + 1 新建 + 4 删除** | `src/` 目录 |
| pro/ 目录删除 | **32 个文件** | 24 .ts + 1 .d.ts + 1 .md + 4 langs/ + 2 tests/ |
| package.json 依赖删除 | **8 个** | OneDrive / WebDAV / Dropbox / Webdis / Box / pCloud / AzureBlob 等 |
| i18n key 删除 | **~194 个** | 13 类前缀（dropbox 36 / onedrive 34 / pro 27 / webdav 24 / syncplans 16 / webdis 14 / password 12 / remoteprefix 9 / remotebasedir 8 / encrypt 6 / chooseService 3 / export 3 / box 2） |
| 代码行号审验 | **71 个去重引用 100% 对齐** | 30 轮 P2 偏差已修复 |

---

## 2. 功能矩阵

### 2.1 必含（P0，14 项）

- **S3 同步核心**（fsS3.ts 全文）
- **文件 diff + copy**（copyLogic.ts 全文）
- **S3 三字段 UI**（AccessKey / SecretKey / Bucket）
- **检查连接**（settings.ts:1125-1148）
- **Ribbon 图标 + 命令面板**（main.ts:1171-1175 / 1213-1227）
- **同步方向**（双向/单向/仅下载/仅上传）
- **冲突处理**（含 smart_conflict）
- **自动定时 + 启动后自动同步**（autoRun + initRun）
- **状态栏显示上次同步时间**（30 秒轮询）
- **数据持久化**（含加密混淆存储）
- **强制 serviceType="s3"** + **syncOnSaveAfterMilliseconds=-1**

### 2.2 可选保留（P1，14 项）

分块并行度 / 自动运行间隔 / 跳过大文件 / 状态栏开关 / 并行度 / 同步下划线文件 / 同步配置文件夹 / 同步书签 / 删除到回收站 / 保护修改百分比 / 删除同步计划历史 / 删除上次同步明细 等。

### 2.3 硬编码（P2，6 项）

| 字段 | 值 | 位置 |
| -------- | -------- | -------- |
| serviceType | "s3" | main.ts:129 + baseTypes.ts:30-42 |
| s3.s3Endpoint | "s3.cstcloud.cn" | fsS3.ts:179-192 |
| s3.s3Region | "us-east-1" | fsS3.ts:179-192 |
| s3.forcePathStyle | true | fsS3.ts:179-192 + Step 42 删 UI |
| currLogLevel | "info" | main.ts:130 |
| obfuscateSettingFile | true | main.ts:152 |

### 2.4 删除（NI，24 项）

合并任务书 46 项裁剪：

- 4 个云服务适配器（OneDrive 35KB / WebDAV 28KB / Dropbox 21KB / Webdis 8KB）
- PRO 整目录 32 文件
- 端到端加密 UI（PasswordModal + EncryptionMethodModal）
- OAuth 环境变量 15 个
- 导出同步计划 / 导入导出设置 / profiler / logLevel / obfuscate UI
- 5 个 S3 可选字段（useAccurateMTime / remotePrefix / reverseProxyNoSignUrl / generateFolderObject 等）

---

## 3. 技术栈

- **语言**：TypeScript 5.5.4
- **打包**：esbuild（`esbuild.config.mjs`，target es2016，入口 `src/main.ts`）
- **测试**：mocha + tsx
- **License**：Apache-2.0

**保留依赖**：AWS SDK 全家桶 / localforage / diff-match-patch / lodash / nanoid / qrcode / openapi-fetch 等 S3 + 工具链

**删除依赖**：msal-node / microsoft-graph-client / dropbox / webdav / pcloud-sdk / box-typescript-sdk / azure/storage-blob

---

## 4. 架构设计

### 4.1 数据流

```
syncRun (main.ts)
 ↓
fsGetter.getFs(settings) → FakeFsS3
 ↓
copyLogic.runSync(localFs, remoteFs)
 ↓ (diff → decideCopyActions → executeCopyActions)
 ↓
fsS3.put() / fsS3.delete()
 ↓
updateLastSyncMsg() → StatusBar 刷新
```

### 4.2 关键模块

| 模块 | 角色 |
| -------- | -------- |
| `src/main.ts` | 入口 + syncRun + loadSettings + 命令注册 |
| `src/fsS3.ts` | S3 适配器（25KB 保留） |
| `src/copyLogic.ts` | 双向 diff + copy 核心算法 |
| `src/sync.ts`（**新建**） | 从 `pro/src/sync.ts` 提取 syncer 主体 |
| `src/conflictLogic.ts`（**新建**） | 从 `pro/src/conflictLogic.ts` 提取 4 个函数 |
| `src/localdb.ts` | DB 操作 + 合并 pro 4 个函数 |
| `src/settings.ts` | 仅保留 S3 UI + 14 个 P1 Setting |
| `src/importExport.ts` | exportFields 固定为 `basic_and_advanced` |
| `src/fsGetter.ts` | switch 仅剩 s3 case |

### 4.3 强制覆盖逻辑（loadSettings 行 1410-1427）

启动时强制 6 项覆盖：

- `s3.generateFolderObject = false`
- `ignorePaths = []`
- `onlyAllowPaths = []`
- `enableStatusBarInfo = true`
- `syncOnSaveAfterMilliseconds = -1`
- `deleteToWhere = "system"`

---

## 5. 实施路径（44 步 / 4 Phase）

| Phase | 步骤 | 关键改造 |
| -------- | -------- | -------- |
| **Phase 1：清理 - 删除** | Step 1-5 | 删 4 云适配器 + 删 pro/ 32 文件 |
| **Phase 2：清理 - import/handler** | Step 6-14 | 删 pro/src import + 12 个 fsGetter case + OAuth handler |
| **Phase 3：改造 - settings.ts** | Step 15-27 | 大删 settings.ts（3029 行删 ~1500 行：6 Modal + 80+ 云服务 Setting + debug 区块） |
| **Phase 4：硬编码 + 配置** | Step 28-44 | manifest / package.json / esbuild / DEFAULT_SETTINGS / loadSettings 强制覆盖 / 新建 src/sync.ts / 删 OAuth 残留 / 删 S3 UI dropdown / 删 endpoint/region input / 删 commands |

**关键工程难点**：Step 34 提取 `pro/src/sync.ts` 到 `src/sync.ts`（含 4 个 conflictLogic 函数 + 4 个 localdb 函数 + 删 PRO 校验调用）—— **高风险**，需编译验证。

---

## 6. 里程碑

| 里程碑 | 内容 | 估时 |
| -------- | -------- | -------- |
| M1 | 干净删除（src 仅剩保留文件，pro/ 删，无编译错误） | **6h** |
| M2 | 硬编码验证（manifest + DEFAULT_SETTINGS） | 2h |
| M3 | 功能验证（syncRun 通 + import/export 可用 + i18n 无缺失） | 4h |
| M4 | E2E 验证（Obsidian 装插件 + S3 连通 + 单/双向同步通过） | 4h |

**总估时：16h（约 2 人日）**

---

## 7. 风险

| 风险 | 等级 | 缓解 |
| -------- | -------- | -------- |
| R4：`pro/src/sync.ts` 提取到 `src/sync.ts` 遗漏 pro 内部依赖 | **高** | Step 34 详细化（拆 conflictLogic + localdb），提取后编译验证 |
| R1：`ignorePaths`/`onlyAllowPaths` UI 删后字段仍被处理 | 中 | loadSettings 行 1413/1416 强制覆盖为 `[]` |
| R2：`syncOnSaveAfterMilliseconds` 逻辑保留无 UI，旧配置可能误触发 | 中 | loadSettings 强制覆盖为 `-1` |
| R3-R8 | 低 | 编译验证 + E2E 验证 |

---

## 8. 验收标准（8 条）

- **AC1**：plugin id 改为 `cstcloud-sync`
- **AC2**：设置页仅 3 个 S3 必填 + 14 个 P1 可选
- **AC3**：Endpoint / Region / S3 URL Style / Log Level / Obfuscate 不在 UI 显示
- **AC4**：检查连接按钮可用
- **AC5**：Ribbon + 命令面板两个命令均可用
- **AC6**：`npm run build2` 无错误
- **AC7**：`npm test` 无新增失败
- **AC8**：data.json 加载后 6 项关键字段被强制覆盖

---

## 9. 当前状态

✅ **PRD v1.0 定稿**，30 轮行号精度审验完成，源 + 副本 md5 一致 `546068485185cd6b960da20021e29fee`

下一步：等老板指派"全栈工程师"按 44 步 Checklist 执行开发。
