# openclaw 需求拆解 v1（PRD 启动前置）

> [!WARNING]
> **⚠️ 本文档为历史归档（v1.0/v1.1 规划期记录）** —— 其中关于端到端加密「保留」的结论**已失效**：加密后端已于 cstcloud-sync v0.0.2 / PRD v1.3 Step 75-77 全部移除（历史归档）。

> 基于 3 个输入：cstcloud-sync tech_v1.md / remotely_save.md / https://github.com/remotely-save/remotely-save

---

## 1. PRD 范围定界

| 维度 | openclaw 拆解 | 备注 |
|---|---|---|
| 文档名 | `PRD.md` | 沿用项目默认命名 |
| 起始版本 | v1.0 | 全新起点（非 v2.X 续编） |
| 必含章节 | 9 章 | AGENTS.md 强制（项目概述/用户与场景/功能需求/技术栈/架构设计/实施步骤/里程碑与排期/风险与依赖/验收标准） |
| 与 tech_v1.md 关系 | tech_v1.md 是**技术实现方案**（代码层级）；PRD 是**项目计划书**（项目层级） | 两者互不替代 |

## 2. 项目概述（PRD §1）

| 字段 | openclaw 拆解 |
|---|---|
| 产品 | cstcloud-sync（Obsidian 同步插件） |
| 上游 | remotely-save v0.5.25（Apache-2.0） |
| 目标 | 基于上游深度定制，仅支持 cstcloud.cn S3 服务 |
| 命名 | plugin-id: `cstcloud-sync` / package: `cstcloud-sync` |
| License | Apache-2.0 |
| 成功标准 | BRAT 可拉取、S3 同步功能正常、main.js < 5MB、UI 极简（无 11 云选项） |

## 3. 用户与场景（PRD §2）

| 维度 | openclaw 拆解 |
|---|---|
| 目标用户 | cstcloud.cn 部署方 + 其客户（Obsidian 用户） |
| 核心场景 | 用户配置 cstcloud.cn S3 endpoint + Access Key + Bucket → 双向同步笔记 |
| 非场景 | 加密同步（已砍）/ 跨云迁移（已砍）/ 11 个非 S3 服务（已砍） |

## 4. 功能需求（PRD §3）

### P0 必含
- S3 双向同步（cstcloud.cn 特定）
- 跳过大文件
- 自动运行（schedule loop）
- 状态栏同步状态
- 同步冲突处理（保留最后修改）
- 同步方向（双向默认）

### P1 保留可配
Access Key ID / Secret Access Key / Bucket / 分块并行度 / 启动后自动运行 / 同步_文件 / 同步配置 / 同步书签 / 删除位置 / 阈值中止

### P2 硬编码（不显示）
serviceType=S3 / s3Endpoint=s3.cstcloud.cn / s3Region=us-east-1 / S3 URL style=Path-Style / currLogLevel=info / obfuscateSettingFile=true

### 显式不实现（任务书"删除"项）
22+ 项 UI 功能 + 11 个云服务 + PRO 版 + 端到端加密 UI

## 5. 技术栈（PRD §4）

| 维度 | openclaw 拆解 |
|---|---|
| 语言 | TypeScript |
| 打包 | esbuild（移除 webpack） |
| 测试 | mocha（保留） |
| 保留依赖 | @aws-sdk/client-s3 / @aws-sdk/lib-storage / @aws-sdk/signature-v4-crt |
| 删除依赖 | @microsoft/microsoft-graph-client / @microsoft/microsoft-graph-types / googleapis / box-typescript-sdk-gen / koofr-api / @azure/msal-node / dropbox |
| Node target | es2016 |
| License | Apache-2.0 |

## 6. 架构设计（PRD §5）

### 6.1 文件改造分类（30 src 文件）
- **保留** ~10：main.ts（删分支）/ settings.ts（删 UI）/ fsS3.ts / fsAll.ts / localdb.ts（删 PRO 字段）/ copyLogic.ts / configPersist.ts / baseTypes.ts / i18n.ts（删云 key）/ langs/（删云 key）
- **删除** ~10：fsDropbox.ts / fsOnedrive.ts / fsWebdav.ts / fsWebdis.ts / fsEncrypt.ts / encryptOpenSSL.ts / encryptRClone.ts / encryptRClone.worker.ts / fsMock.ts / importExport.ts（部分）
- **修改** ~5：misc.ts / profiler.ts / syncAlgoV3Notice.ts / obsFolderLister.ts / debugMode.ts
- **PRO 整目录删除**：pro/（26 .ts + 459 行 langs）

### 6.2 数据流
- Obsidian → fsS3 → s3.cstcloud.cn → Bucket
- 反向同步同理
- localdb.ts 记录同步历史（仅 S3）

### 6.3 关键接口
- fsS3 类（S3 适配器，保留）
- fsAll 抽象层（保留）
- main.ts 入口（删 11 云分支）

## 7. 实施步骤（PRD §6，Checklist）

### Phase 1：基础设施改造（M1）
- [ ] Step 1: 克隆上游 / 改名 manifest.json（id/name/author）
- [ ] Step 2: 改 package.json（删 4 SDK、改名）
- [ ] Step 3: 改 esbuild.config.mjs（删 14 OAuth + 1 Dropbox = 15 → 0）

### Phase 2：核心代码裁剪（M2）
- [ ] Step 4: 删 pro/ 整目录（26 .ts + 459 langs）
- [ ] Step 5: 删 5 个云适配器文件 + 加密文件
- [ ] Step 6: 改 main.ts（删 11 云分支 + PasswordModal 引用）
- [ ] Step 7: 改 settings.ts（删 30+ UI 字段）
- [ ] Step 8: 改 fsGetter.ts（删 11 云 case）
- [ ] Step 9: 改 importExport.ts（删 11 云导入导出）
- [ ] Step 10: 改 i18n.ts + langs/（删 11 云翻译）
- [ ] Step 11: 改 localdb.ts（仅 free 字段兼容）

### Phase 3：硬编码与保留机制（M3）
- [ ] Step 12: 硬编码 6 项（serviceType/s3Endpoint/s3Region/pathStyle/currLogLevel/obfuscateSettingFile）
- [ ] Step 13: ribbon 提示词改"同步"
- [ ] Step 14: 保留命令面板同步命令
- [ ] Step 15: 保留 schedule loop
- [ ] Step 16: 保留 Status bar

### Phase 4：测试与发布（M4）
- [ ] Step 17: 删 tests/ 中 11 云测试
- [ ] Step 18: 验证编译（esbuild + tsc）
- [ ] Step 19: e2e 验证 S3 同步
- [ ] Step 20: 生成 main.js
- [ ] Step 21: BRAT 拉取测试

## 8. 里程碑与排期（PRD §7）

| 里程碑 | Phase | 完成标准 | 估时 |
|---|---|---|---|
| M1 | Phase 1 | 项目骨架就绪（manifest/package/esbuild） | 1 天 |
| M2 | Phase 2 | 核心代码裁剪完成（仅 S3 编译通过） | 3-5 天 |
| M3 | Phase 3 | 硬编码与保留机制完成 | 1 天 |
| M4 | Phase 4 | 测试与发布 | 1-2 天 |
| **合计** | | | **6-9 天** |

## 9. 风险与依赖（PRD §8）

| 编号 | 风险 | 缓解 |
|---|---|---|
| R1 | 旧 data.json 兼容不完整 | loadSettings 强制重置关键字段 |
| R2 | i18n key 残留 | 完整 grep 11 云前缀 + 测试 |
| R3 | e2e 测试覆盖不足 | 删 11 云测试后补充 S3 场景 |
| R4 | esbuild OAuth 残留 | 检查 define 块 |
| R5 | msal-browser 残留 | package.json 全面 grep |
| R6 | ribbon API 差异 | 验证 v0.5.25 API 兼容 |
| R7 | minAppVersion（0.13.21）兼容 | 验证当前 Obsidian 最低版本 |
| R8 | PRO 字段残留 | localdb 迁移规则严格 |

## 10. 验收标准（PRD §9）

| 编号 | 验收 |
|---|---|
| AC1 | main.js < 5MB（上游约 10MB） |
| AC2 | 编译无 11 云相关引用 |
| AC3 | BRAT 可从 GitHub 拉取 |
| AC4 | S3 双向同步功能正常 |
| AC5 | 旧 data.json 兼容（仅 free 字段） |
| AC6 | UI 仅显示 6 项硬编码 + 20 项可配字段 |
| AC7 | ribbon 提示词为"同步" |
| AC8 | Status bar 状态栏显示同步状态 |

## 11. 副本同步

| 路径 | 角色 |
|---|---|
| `/root/.openclaw/Project/cstcloud-sync/PRD.md` | 源 |
| `/home/WPS/ls/cstcloud-sync/PRD.md` | 副本 |
| md5 一致 | SOP 要求 |
