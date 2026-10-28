# cstcloud-sync 交付报告

> **更新记录（v1.8 发布仓库回填轮次）**
> - 本轮执行范围：发布仓库地址回填 —— `manifest.json` 的 `authorUrl` 由 `https://github.com/cstcloud/cstcloud-sync` 改为 `https://github.com/studynt47/cstcloud-sync`（原仓库实测 HTTP 404 不存在；Obsidian 商店审核要求 `authorUrl` 为可访问的公开仓库地址），并据此**重新打包**。
> - 发布仓库：`https://github.com/studynt47/cstcloud-sync`（**public**，GitHub 个人账号 `studynt47`）。归属该账号而非 `CstCloud`，原因是 `CstCloud` 为另一独立账号且无授权凭证。
> - PRD 当前版本 = **v1.8**（commit `9f8a3dd`）。
> - 本轮 commit：`596a237`（manifest authorUrl）/ `df210ec`（分发包不入库）/ `9f8a3dd`（PRD v1.8）。**未改动任何 `src/` 代码**。
> - 新分发包 `cstcloud-sync0.0.3.zip`：**312,006 字节**，md5 `35ac128f6a3d378f46fdcd7b1e5149b0`；**已取消 git 跟踪**（遵循 `.gitignore` delivery archives 政策，磁盘与交付副本目录保留）。
> - 内部规划文档（PRD / 本报告 / `tech_v1.md` / `decomp_*` / `prd_review_*` / `_pm_survey_*` / `AGENTS.md`）**不进入公开仓库**，仅保留本机与交付副本目录。
>
> **更新记录（v1.7 发版轮次 · M10 发布）**
> - 本轮执行范围：PRD **v1.7**（发布版本号 0.0.3 回填、AC32 关闭、R9 解除）+ **M10（发布）** —— 产出 `cstcloud-sync0.0.3.zip`。
> - PRD 当前版本 = **v1.8**（commit `c2ada6a` / `33d1979` / `9f8a3dd`；v1.7 定稿 `c2ada6a`、v1.7 补正 `33d1979`、v1.8 回填 `9f8a3dd`，历史沿革保留）。
> - 本轮 HEAD = 本轮提交 `357fbf2` 之后的交付报告更新（其间并入 PRD v1.7 补正 commit `33d1979`）；本轮**未改动任何 `src/` 代码**。
> - 老板 2026-10-28 书面指定发布版本号 **0.0.3**，`manifest.json` / `package.json` / PRD §4.3 三处一致。
> - 旧包 `cstcloud-sync0.0.1.zip`（v0.0.1 全仓快照）**已删除**。
>
> **更新记录（v1.6 收口轮次 · Phase 7 / Phase 8 终验）**
> - 本轮执行范围：PRD v1.3/v1.4 §6 **Step 59-82**（Phase 5 修复类 + Phase 6 质量类 + Phase 7 瘦身类 C1-C5 + Phase 8 v1.4 补充）**全部收口**；PRD 后续经 v1.5 勘误、**v1.6 收口**（Step 22 已完成、例外项 3→2、i18n 判据 169→167、AC19 已满足）。**PRD 当前版本 = v1.7**（v1.6 定稿 commit `26ac812`）。
> - **版本标签口径**：本文中带版本号的条目（如 Step 82「v1.4-1」、AC33「（v1.4）」）指**该条目引入时的 PRD 版本**（历史沿革，保留原样），**不代表 PRD 当前版本**；PRD 当前版本为 **v1.7**。
> - 本轮工作：**Step 73 复检** + 交付报告全面更新 + AC 终验对账（AC1-AC33）。**未改动任何 `src/` 代码**。
> - Phase 7 / Phase 8 轮次收口时 HEAD = `f69c1da`；**本次 v1.7 对齐后 HEAD = `33d1979`**（PRD.md v1.7 定稿 commit `c2ada6a` + v1.7 补正 commit `33d1979`；v1.6 定稿 commit 为 `26ac812`，历史沿革保留；本次仅改本报告，未动代码 / PRD）。
> - Step 70（B2）/ Step 71（B3）按老板指示**未执行**，真实环境测试由老板本人做；状态一律记为「⛔ 未执行 — 按老板指示，真实环境测试由老板本人执行」，详见 §6。
> - 全文不记录 AccessKey / SecretKey 明文。
>
> **本报告章节索引**：§1 Step Checklist · §2 编译结果 · §3 文件变更清单 · §4 验收结果表（Step 59-82）· §5 已知风险 · §6 E2E 验证结果 · §7 C1/C2 实施与行为等价性 · §8 已知遗留与元数据瑕疵 · §9 AC 终验对账表 · §10 交付物清单 · §11 最终状态汇总与回滚点

## 1. Step Checklist 完成情况

> 说明：本节沿用 v1.0 实施时的分阶段清单（Step 1-44）。PRD v1.3 §6 的权威清单为 **59 条**（含 Step 1.5 及 v1.3 新增的 Step 45-73），逐条状态见 PRD §6「Step Checklist（完整 47 步 → 实为 59 条）」及本报告 **§4 验收结果表（Step 59-82）**；本节不重复维护。

### Phase 1 (Step 1-5)：文件删除
- ✅ Step 1：删除 `src/fsOnedrive.ts`
- ✅ Step 2：删除 `src/fsWebdav.ts`
- ✅ Step 3：删除 `src/fsDropbox.ts`
- ✅ Step 4：删除 `src/fsWebdis.ts`
- ✅ Step 5：删除 `tests/fsWebdis.test.ts`, `pro/` 整个目录（32 个文件）

### Phase 2 (Step 6-12)：基础代码清理
- ✅ Step 6：清理 main.ts 中 pro/cloud import
- ✅ Step 7：清理 settings.ts 中 pro import
- ✅ Step 8：清理 syncAlgoV3Notice.ts (无 pro import)
- ✅ Step 9：重写 baseTypes.ts 为 229 行 S3-only 版本（保留 password field as @deprecated）
- ✅ Step 10：改 fsS3.ts DEFAULT_S3_CONFIG 硬编码 6 项
- ✅ Step 11：重写 fsGetter.ts 为 30 行 switch case "s3"
- ✅ Step 12：重写 importExport.ts 支持 basic_and_advanced + s3

### Phase 3 (Step 13-27)：UI 清理

> **编号口径注（避免 Step 22 混淆）**：§1 的 Step 编号沿用 **v1.0 实施编号**，与 **PRD §6 的 Step 编号不是同一套**。其中 §1 的「**Step 22：删除 s3 urlstyle dropdown**」对应 **PRD §6 的 Step 42**（`settings.ts:968-987`，删除 S3 URL style dropdown、写死 forcePathStyle）；而 **PRD §6 的 Step 22** 是「删除 `settings.ts` 的 `syncOnSave` Setting」，该项已于 **Step 67 / A8（commit `f376a9f`）** 完成（PRD v1.6 例外表已标 `[x] 已完成`）。**二者不是同一项，勿混判**（PRD §6 亦有同口径注，见 PRD v1.6）。

- ✅ Step 13：清理 settings.ts 6 个 modal 类
- ✅ Step 14：清理 cloud service 区块（sed '510,1395d' 之类）
- ✅ Step 15：删除 passwordSetting
- ✅ Step 16：删除 encryptionMethodSetting
- ✅ Step 17：删除 syncOnSave dropdown
- ✅ Step 18：删除 ignorePaths/onlyAllowPaths textarea
- ✅ Step 19：删除 generateClearDupFilesSettingsPart
- ✅ Step 20：删除 s3 endpoint text input
- ✅ Step 21：删除 s3 region text input
- ✅ Step 22：删除 s3 urlstyle dropdown（**编号口径注**：本节沿用 **v1.0 实施编号**，与 PRD §6 编号不一致；本行 = **PRD §6 的 Step 42**（`settings.ts:968-987`，删除 S3 URL style dropdown、写死 forcePathStyle）；**PRD §6 的 Step 22** 指「删除 `settings.ts` 的 `syncOnSave` Setting」，二者**不是同一项**，该 Setting 已随 Step 67 / A8 完成，见 §8.8）
- ✅ Step 23：删除 s3 reverseProxyNoSignUrl 残留
- ✅ Step 24：删除 s3 useAccurateMTime dropdown
- ✅ Step 25：删除 s3 generateFolderObject dropdown
- ✅ Step 26：删除 debugDiv 区块（logLevel/obfuscate/viewconsolelog/5 export syncplans/profiler/vaultid/resetcache）
- ✅ Step 27：删除 4 个 export-sync-plans commands (main.ts)

### Phase 4 (Step 28-44)：硬编码、强制覆盖、sync 提取、UI 调整
- ✅ Step 28：改 manifest.json（id="cstcloud-sync", version="0.0.1", description, minAppVersion）
- ✅ Step 29：改 package.json（name, version, 移除 8 个 cloud deps）
- ✅ Step 30：改 esbuild.config.mjs（移除所有 OAuth env vars, target es2020, platform browser）
- ✅ Step 31：改 i18n.ts（移除 LANGS_PRO）
- ✅ Step 32：硬编码 6 项 P2 到 DEFAULT_SETTINGS + fsS3 DEFAULT_S3_CONFIG
- ✅ Step 33：loadSettings 6 项强制覆盖（s3.generateFolderObject=false, ignorePaths=[], onlyAllowPaths=[], enableStatusBarInfo=true, syncOnSaveAfterMilliseconds=-1, deleteToWhere="system"）
- ✅ Step 34：从 pro/src/sync.ts 提取 syncer 函数到 src/sync.ts（移除了 checkProRunnableAndFixInplace 调用，重新添加 conflictLogic 和 localdb 的 import）
- ✅ Step 35：pro/src/conflictLogic.ts 整文件搬运到 src/conflictLogic.ts（顶部加 MERGABLE_SIZE=1000*1000，移除 baseTypesPro import）
- ✅ Step 36：pro/src/localdb.ts 追加 4 个函数（clearPrevSyncRecordByVaultAndProfile, getAllPrevSyncRecordsByVaultAndProfile, insertSyncPlanRecordByVault, upsertPrevSyncRecordByVaultAndProfile），改 SyncPlanType import
- ✅ Step 37：i18n key 清理（en.json 374→196, zh_cn.json 375→196, zh_tw.json 374→196，共 178-179 个 key 删除）
- ✅ Step 38：langs/index.ts 验证（已无 LANGS_PRO 引用）
- ✅ Step 39：i18n 备份 17 个误删 key 恢复（delsyncplans/protectmodifypercentage/chooseservice/...）
- ✅ Step 40：main.ts ribbon aria-label 改为"同步"
- ✅ Step 41：main.ts 删除 4 个 export-sync-plans commands + OAuth expire check
- ✅ Step 42：debugMode.ts 删除（PRO 引用）+ PRO 残留清理（simpleTransRemotePrefix/ChangeS3RemotePrefixModal/upsertLastSuccessSyncTimeByVault/upsertLastFailedSyncTimeByVault/changeMobileStatusBar）
- ✅ Step 43：settings.ts smart_conflict 选项移除（P2 改 keep_newer）
- ✅ Step 44：baseTypes.ts 添加 COMMAND_CALLBACK 保留常量 + InternalDBs 从 localdb 导入 + 4 个 @deprecated optional 字段

## 2. 编译结果

### `npm run build2`（主构建链 · esbuild）
```
> cstcloud-sync@0.0.3 build2
> tsc -noEmit -skipLibCheck && node esbuild.config.mjs production

esbuild version = 0.23.1
```
**main.js**: 1,043,555 bytes (0.996 MB)，md5 `5ffe14e9725ec80e84186e8342bf56a3`（HEAD `f69c1da` 产物，**经 `31c7a30` / `bb2886f` 重建后**）

### `npm test`（mocha + tsx）
```
142 passing (295ms)
0 failing
0 pending
```
（v1.3 轮次的「2 个 upstream OpenSSL binary 测试 `it.skip` 挂起」已随 C1 删除 `src/encryptOpenSSL.ts` + `tests/encryptOpenSSL.test.ts` 一并消失，现为 **0 pending**）

### `tsc` 类型检查
| 命令 | 结果 |
|---|---|
| `npx tsc --noEmit -skipLibCheck`（项目判据，`build2` 内置） | **0 error** |
| `npx tsc --noEmit`（裸跑） | 32 error，**全部位于 `node_modules/typescript/lib/lib.webworker.d.ts`(25) + `lib.dom.d.ts`(7)**；项目源码 0 error（`grep -v "^node_modules/"` 后为 0）。此为 `tsconfig.json` 的 `lib` 同时含 `"dom"` 与 `"webworker"` 所致，**非本次引入** |

## 3. 关键文件变更清单

### 新增文件
- `src/sync.ts` (2094 行, 从 pro/src/sync.ts 提取)
- `src/conflictLogic.ts` (394 行, 从 pro/src/conflictLogic.ts 提取)
- `main.js` (1.19 MB, build 产物)
- `delivery/DELIVERY_REPORT.md` (本文件)

### 删除文件
- `src/fsOnedrive.ts`
- `src/fsWebdav.ts`
- `src/fsDropbox.ts`
- `src/fsWebdis.ts`
- `src/debugMode.ts` (PRO 引用)
- `tests/fsWebdis.test.ts`
- `pro/` 整个目录（32 文件：sync.ts, conflictLogic.ts, localdb.ts, baseTypesPro.ts, account.ts, check*, features*, modal*, etc.）

### 修改文件
- `manifest.json`: id="cstcloud-sync", version="0.0.1", description, 移除 fundingUrl
- `package.json`: name="cstcloud-sync", version="0.0.1", 移除 8 个 cloud deps + biome 1.8.3
- `esbuild.config.mjs`: 移除 OAuth env vars, target es2020, platform browser, external 加 node:url/path/fs
- `tsconfig.json`: target "es2017", lib 加 "es2021"
- `src/main.ts` (1990→586 行): 删 OAuth2Info 接口/字段/init, 删 OAuth handlers, 删 checkIfOauthExpires, 删 4 export-sync-plans commands, 改 ribbon aria-label
- `src/settings.ts` (3029→861 行): 删 6 modal 类, 删 cloud service 区块, 删 debugDiv 区块, 删 s3 endpoint/region/urlstyle, 改 conflictAction dropdown
- `src/sync.ts` (新建): 含 syncer + 4 conflictLogic 引用 + 4 localdb 引用
- `src/conflictLogic.ts` (新建): 顶部 MERGABLE_SIZE=1000*1000
- `src/localdb.ts`: 追加 4 函数, 改 SyncPlanType import
- `src/baseTypes.ts` (重写 229 行): S3-only + InternalDBs
- `src/fsS3.ts`: DEFAULT_S3_CONFIG 硬编码 3 项 (endpoint/region/pathstyle)
- `src/fsGetter.ts` (重写 30 行): switch case 只剩 "s3"
- `src/importExport.ts` (重写 ~70 行): 只支持 basic_and_advanced + s3
- `src/i18n.ts`: 移除 LANGS_PRO
- `src/langs/en.json` (374→196): 删 178 个 i18n key
- `src/langs/zh_cn.json` (375→196): 删 179 个 i18n key
- `src/langs/zh_tw.json` (374→196): 删 178 个 i18n key
- `src/misc.ts`: bufferToArrayBuffer 返回 ArrayBuffer（cast 修 Node 24 类型变更）
- `src/encryptOpenSSL.ts`: Uint8Array<ArrayBuffer> cast

### Phase 7 / Phase 8 变更（C 类瘦身 + v1.4；PRD 现为 v1.7）
**新增文件**
- `src/encryptedGuard.ts`（130 行）：C1 加密守卫模块 —— `copyEntityAndCopyKeyEncSizeEnc()` / `isLikelyOpenSSLEncryptedName()` / `isRemoteEncrypted()` / `checkRemoteEncryption()` + `MAGIC_ENCRYPTED_PREFIX_BASE32` / `MAGIC_ENCRYPTED_PREFIX_BASE64URL`
- `tests/encryptedGuard.test.ts`（224 行）：C1 三项行为等价性的回归网

**删除文件**
- `src/fsEncrypt.ts`（587 行）、`src/encryptOpenSSL.ts`（186 行）、`src/encryptRClone.ts`（257 行）、`src/encryptRClone.worker.ts`（184 行）—— C1-a/b
- `src/profiler.ts`（153 行）—— C2
- `tests/encryptOpenSSL.test.ts`（163 行）—— 随 `src/encryptOpenSSL.ts` 一并移除（该文件此前有 2 个 `it.skip` 挂起用例）

**修改文件**
- `src/sync.ts`：解耦加密包装层（8 处签名/传参 + 7 处方法调用），删除 4 处 dropbox 死分支，删除 62 处 profiler 埋点
- `src/main.ts`：删除 `FakeFsEncrypt` 接线 + profiler 接线（32 行）
- `src/settings.ts`：删除 profiler 设置区
- `src/fsLocal.ts`：删除 13 处 profiler 埋点
- `src/localdb.ts`：删除 `profilerresults` 表定义与 3 个读写函数（48 行）
- `src/baseTypes.ts`：删除 `ProfilerConfig` / `profiler?` / 悬空 i18n 键（10 行）
- `src/obsFolderLister.ts`：两处排除数组各增 1 个字符串 `"workspace-mobile.json"`（Step 82；命中行号 L100 / L116。**逻辑改动 2 处字符串**，因数组改为多行排版，diff 为 +9/-3；同一 commit 另重建 `main.js`）
- `src/langs/{en,zh_cn,zh_tw}.json`：清理 40 处死键（Step 81）+ 2 处孤儿键（`settings_synconsave_disable/_enable`，AC19 收口），三语言各 **167** 键
- `package.json`：删除运行时依赖 `@fyears/rclone-crypt`；删除 5 个无用 devDependencies
- `esbuild.config.mjs` / `webpack.config.js`：删除 worker 接线
- `PRD.md`：**v1.7**（v1.4 → v1.5 → v1.6 → v1.7 逐版收口；v1.4 引入 §5.4 配置目录同步 + R17 + Step 82 + AC33，v1.5 勘误，v1.6 收口：Step 22 已完成、例外项 3→2、i18n 判据 169→167、AC19 已满足，v1.7 发版收口：发布版本号 0.0.3 回填、AC32 关闭、R9 解除；v1.7 补正 `33d1979`：§7 M10 / §7.1 标题 / AC31 发版包版本号口径 0.0.2→0.0.3）

## 4. 验收结果表（Step 59-82）

> 判据口径：✅ 完成 = 本轮有可复现的命令/commit/文件证据；⛔ 未执行 = 按老板指示或需真实环境，由老板本人执行；⚠️ 部分 = 主干完成但有残留或口径待确认。

| Step | 类别 | 动作 | 状态 | 依据（本轮可复现） |
|---|---|---|---|---|
| 59 | A1 | 删除残留 Webdis 测试 | ✅ 完成 | `ls tests/fsWebdis.test.ts` → No such file |
| 60 | A2-a | 统一文件权限位模式 | ✅ 完成 | `git config core.fileMode` → `false` |
| 61 | A2-b | 产出干净基线 commit | ✅ 完成 | `git diff --numstat` → 0 条目；`git status --porcelain` → 空 |
| 62 | A3 | 产品版本号统一到 0.0.2 | ✅ 完成 | `package.json` / `manifest.json` 均 `"version": "0.0.2"` |
| 63 | A4 | README 品牌化改写 | ✅ 完成 | `README.md` / `README.zh-cn.md` 首行均为 `# cstcloud-sync` |
| 64 | A5 | manifest 身份统一 | ✅ 完成 | `manifest.json` → `author=cstcloud`、`authorUrl=https://github.com/studynt47/cstcloud-sync`。<u>【v1.8 修正】原定 cstcloud/cstcloud-sync 仓库实测 404 不存在，已改为 studynt47/cstcloud-sync</u> |
| 65 | A6 | 勾选 §6 历史 checklist | ✅ 完成 | PRD §6 历史清单 59 条中 **57 条 `[x]`**、**2 条 `[ ]`**（Step 11 / 37）均同行注明原因（AC17；Step 1.5 / 22 经复核亦已完成，见 §8.8） |
| 66 | A7 | 设置页 H1 品牌残留修复 | ✅ 完成 | `grep -c "Remotely Save" src/settings.ts` → 0 |
| 67 | A8 | 设置页空壳元素清理 | ✅ 完成 | `grep -rn "settings_chooseservice\|settings_synconsave_desc" src/settings.ts src/langs/` → 0 |
| 68 | A9 | 根 LICENSE 文本更新 | ✅ 完成 | `LICENSE` → Apache License 2.0（9 处）；`grep -c PolyForm LICENSE` → 0 |
| 69 | B1 | Obsidian 桌面版加载测试 | ✅ 完成 | 详见 §6「Step 69 / B1」 |
| 70 | B2 | S3 真实连通性测试 | ⛔ 未执行-待老板实测 | 详见 §6「Step 70 / B2」 |
| 71 | B3 | 双向同步 E2E | ⛔ 未执行-待老板实测 | 详见 §6「Step 71 / B3」 |
| 72 | B4 | 核心逻辑单测补齐 | ✅ 完成 | `npm test` → 142 passing / 0 failing / 0 pending；覆盖率见 §6 |
| 73 | B5 | 打包产物自检 | ✅ 通过（本轮复检） | 详见 §6「Step 73 / B5」复检表 |
| 74 | C1-a | 建立回滚点 | ✅ 完成 | tag + branch `backup/pre-v1.3-C1` → `7badfc3`（详见 §11） |
| 75 | C1-b | 删除加密后端 | ✅ 完成 | 4 个文件均 No such file；`grep -rn "fsEncrypt\|FakeFsEncrypt" src/ tests/` → 0 |
| 76 | C1-c | 解耦 `src/sync.ts` 加密包装层 | ✅ 完成 | 3 项行为等价性均验证通过，详见 §7 |
| 77 | C1-d | 清理 `main.ts` 接线与构建依赖 | ✅ 完成 | `grep -c "rclone-crypt" package.json` → 0；`npm run build2` → exit 0 |
| 78 | C2 | 删除 profiler | ✅ 完成 | `src/profiler.ts` 不存在；`grep -rni "profiler" src/ tests/` → **0** |
| 79 | C3 | 清理 dropbox 死分支 | ✅ 完成 | `grep -n "dropbox" src/sync.ts` → 仅 L1340 历史沿革注释，无 `serviceType === "dropbox"` 条件 |
| 80 | C4 | 清理 devDependencies 残留 | ✅ 完成 | 6 个目标依赖 → 0 命中；`dotenv` / `jsdom` 保留（`package.json` L37 / L39） |
| 81 | C5 | 复核 i18n 键 | ✅ 完成 | 三语言键集合完全一致：Step 81 复检时各 **169** 键，AC19 收口再删 2 处孤儿键后现各 **167** 键（详见 §8.2）；PRD §6 Step 81 保留「清理后各为 169 键」的**历史叙述**，并补注「Step 81 时 169 键，commit `31c7a30` 后为 167 键」 |
| 82 | v1.4-1 | 补齐 `workspace-mobile.json` 排除 | ✅ 完成 | `grep -n "workspace-mobile.json" src/obsFolderLister.ts` → **2 处**（L100 / L116）；commit `43e36a1`（「v1.4-1」为该 Step 的**引入版本标签**，PRD 现为 v1.7） |

## 5. 已知风险与遗留问题

### 5.1 编译/构建
- ✅ tsc 0 错误（`npx tsc --noEmit -skipLibCheck`；裸跑 `npx tsc --noEmit` 报 32 个错误，**全部来自 `node_modules/typescript/lib/lib.webworker.d.ts`(25) 与 `lib.dom.d.ts`(7)**，源于 `tsconfig.json` 的 `lib` 同时含 `"dom"` 与 `"webworker"`，项目源码 0 错误）
- ✅ esbuild production build 成功（main.js 1,043,555 字节，md5 `5ffe14e9725ec80e84186e8342bf56a3`）
- ✅ mocha 单元测试 **142 passing / 0 failing / 0 pending**（C1 删除 `tests/encryptOpenSSL.test.ts` 后，原先 2 个 `it.skip` 的 OpenSSL binary 测试已由 `tests/encryptedGuard.test.ts` 等价覆盖）
- ✅ 核心逻辑行覆盖率（c8 实测，本轮 `npx c8@10 mocha --import=tsx 'tests/**/*.ts'`）：`src/sync.ts` **75.80%** / `src/copyLogic.ts` **100%** / `src/conflictLogic.ts` **98.72%** / `src/encryptedGuard.ts` **97.69%**，**整体（src/）70.46%**（均达到 PRD Step 72 判据：关键路径 ≥ 70%、整体 ≥ 50%；较 v1.3 轮次的 76.41% / 63.24% 变化系 C1/C2 删除文件行所致）

### 5.2 代码保留
- 保留 `wrapTextWithPasswordHide` 函数（用于 S3 accesskey/secret 密码隐藏，P1-2）
- 保留 `SyncConfigDirModal` 和 `ExportSettingsQrCodeModal`（settings.ts 行 39, 92）
- 保留 `MERGABLE_SIZE=1000*1000`（冲突合并用）
- 保留 `SmartConflict` 选项在 ConflictActionType 中但 UI dropdown 已移除（data.json 兼容）
- 保留 `remotePrefix/useAccurateMTime/generateFolderObject/reverseProxyNoSignUrl` 4 个字段在 S3Config 中作为 @deprecated optional（向后兼容老 data.json，无 UI 无行为）

### 5.3 行为说明
- `src/encryptOpenSSL.ts` / `src/encryptRClone.ts` / `src/fsEncrypt.ts` **已于 C1（Step 75）整体删除**，端到端加密在本插件中不再具备（R11 已登记为不可逆）
- 远端已加密时的中止保护**未随类删除**，已由 `src/encryptedGuard.ts` 的 `checkRemoteEncryption()` 等价替代（详见 §7）
- 删除了 `debugMode.ts`（用于 export sync plans 调试功能），5 个 export sync plans 按钮 + 4 个 export profiler buttons 都已删除

### 5.4 Obsidian 集成
- ✅ **已做** Obsidian 桌面版实际加载测试（Step 69 / B1）：真实 Obsidian 1.13.7 + Xvfb 验证通过（详见 §5）
- ⛔ **未执行** S3 真实连通测试（Step 70 / B2）——按老板指示，真实环境测试由老板本人执行
- ⛔ **未执行** E2E 双向同步测试（Step 71 / B3）——按老板指示，真实环境测试由老板本人执行

## 6. E2E 验证结果

### 已完成
- ✅ tsc 编译 0 错误（`-skipLibCheck`；裸跑的 32 个错误全在 node_modules，见 §5.1）
- ✅ esbuild production build 成功（main.js 1,043,555 字节）
- ✅ mocha 单元测试 **142 passing / 0 failing / 0 pending**
- ✅ 静态验证：所有 i18n key 与 UI 使用一致（17 个误删已恢复）

### Step 69 / B1 — E2E-1 Obsidian 桌面版加载测试：✅ 通过

真实环境：Obsidian 1.13.7（installer 1.13.7，headless Xvfb `:99`，1400x1000x24），插件产物 `main.js`（B1 测试当时的构建产物，md5 `94f2fea402196d20f5a913c55d82282c`；**C1/C2 后的当前产物 md5 为 `5ffe14e9725ec80e84186e8342bf56a3`**，1,043,555 字节）。

| 判据 | 实测结果 |
|---|---|
| manifest 校验（id / name / version / minAppVersion） | ✅ `cstcloud-sync` / `cstcloud-sync` / `0.0.3` / `0.13.21` |
| 插件可启用且无报错 | ✅ 社区插件成功加载（安全模式关闭后 `cstcloud-sync` 与对照插件 `claudian-mobile-jy` 均正常加载，console 无插件级报错） |
| 设置页可渲染（S3 三字段 + 12 个 P1） | ✅ H1 `cstcloud-sync`；H2 `S3 或兼容 S3 的服务的设置` / `基本设置` / `进阶设置`；共 18 个设置项（含 `Access Key ID`、`Secret Access Key`、`存储桶（Bucket）的名字`），`选择服务` / `保存时同步` / `Remotely Save` 均已不存在 |
| ribbon 图标可见可点 | ✅ ribbon 按钮已注册 |
| 命令面板 2 个命令 | ✅ `cstcloud-sync:start-sync`、`cstcloud-sync:start-sync-dry-run` |

> 备注：无头环境下 Obsidian 的设置弹窗不会渲染为可查询 DOM，故设置页校验改为直接调用 `app.setting.pluginTabs` 中本插件 Tab 的 `display()` 后检查其 `containerEl`。

### Step 70 / B2 — E2E-2 S3 真实连通性测试：⛔ 未执行 — 按老板指示，真实环境测试由老板本人执行

> **状态口径：未执行，不标记为通过。** 以下仅为中断前的尝试过程记录（参考信息），**不构成任何“通过”结论**。本轮已按老板指示停止一切真实凭证测试。

已跑的尝试过程（命令 / 报错 / 现象）：

| # | 尝试 | 命令 / 方式 | 观察到的现象 |
|---|---|---|---|
| 1 | 插件设置页「检查连接」 | Obsidian 1.13.7 无头实例中点击 `检查` 按钮 | 按钮无成功反馈，无明确报错；同步流程在 S3 阶段无进展 |
| 2 | SDK 直连 HeadBucket | 用项目自带 `@aws-sdk/client-s3`，endpoint `https://s3.cstcloud.cn`、region `us-east-1`、`forcePathStyle=true` | **HTTP 401**，`Unknown: UnknownError`，错误元数据 `{"httpStatusCode":401,"attempts":1,"totalRetryDelay":0}` |
| 3 | SDK 直连 ListObjectsV2 | 同上，换用 ListObjectsV2 | **HTTP 401**，同上错误 |
| 4 | 独立 SigV4 curl 复核 | 手写 SigV4 签名，curl 请求桶 | `curl: (6) Could not resolve host: ****.s3.cstcloud.cn`（虚拟主机式域名无法解析；path-style 走 `s3.cstcloud.cn/<bucket>` 则返回 **401** 空响应体） |
| 5 | 插件内 dry-run 同步 | `cstcloud-sync:start-sync-dry-run` | 状态栏长时间停在 `空跑：正在同步`，日志仅有 `startting sync.`，无后续推进（与 S3 请求未被服务端正常应答一致） |

DNS 侧：`s3.cstcloud.cn` 可解析（`223.193.44.135`），故 401 属**服务端拒绝**而非网络不通。

> **注：本节及全文均不记录 AccessKey / SecretKey 明文，仅以 `AKIA****JUVG` 形式脱敏引用；测试凭证仅存放于测试 vault 的 `.creds.json`（未入库、未提交、未打印）。**

老板自行测试步骤清单（可直接照做）：

1. **准备**：确认 cstcloud.cn 的 S3 账号可用，且拿到 `Access Key ID` / `Secret Access Key` / `Bucket` 三项；确认桶名与密钥属同一账号。
2. **装插件**：把 `main.js` + `manifest.json` 拷到目标 vault 的 `.obsidian/plugins/cstcloud-sync/`。
3. **启用**：Obsidian 设置 → 第三方插件 → 关闭安全模式 → 启用 `cstcloud-sync`。
4. **填配置**：插件设置 → `Access Key ID` / `Secret Access Key` / `存储桶（Bucket）的名字` 三项填好（Endpoint/Region 已硬编码 `s3.cstcloud.cn` / `us-east-1`，无需填）。
5. **测连通（B2）**：点「检查」按钮 → 观察是否提示连接成功（内部走 `HeadBucket` + `ListObjectsV2`）；失败时把 Obsidian 控制台日志贴回（注意先遮蔽密钥）。
6. **测双向同步（B3）**，在测试 vault 里准备 4 条用例：
   - ① 本地新增 → 远端可见：新建 `b3-1.md` → 同步 → 在 S3 控制台看到该对象。
   - ② 远端改动 → 本地拉取：改 `b3-2.md` 的远端内容 → 同步 → 本地内容被更新。
   - ③ 删除双向同步：删 `b3-3.md` → 同步 → 远端对象也被删除。
   - ④ 冲突策略生效：本地与远端同时改 `b3-4.md` → 分别用 `处理冲突 = 保留较新` / `保留较大` / 智能合并 各验一次。
7. **跑空跑**：命令面板执行 `cstcloud-sync:start-sync-dry-run`，确认状态栏与计划输出符合预期。
8. **回收**：删除测试 vault 的 `.obsidian/plugins/cstcloud-sync/data.json`（含密钥）或整包删除插件目录。

### Step 71 / B3 — E2E-3 双向同步 E2E：⛔ 未执行 — 按老板指示，真实环境测试由老板本人执行

> **状态口径：未执行，不标记为通过。** 本轮因 B2 未通（HTTP 401）且按老板指示停止真实环境测试，4 条用例均未执行。执行步骤见上方 Step 70 清单第 6 步。

### Step 72 / B4 — 核心逻辑单测补齐：✅ 通过

- 测试文件与用例数（本轮 `npm test` 实测，全量 **142 passing / 0 failing / 0 pending**）：

| 测试文件 | 职责 | 状态 |
|---|---|---|
| `tests/sync.test.ts` | `doActualSync` 全流程（push / pull / 删除 / 冲突 / 目录 / 守卫） | ✅ |
| `tests/copyLogic.test.ts` | `src/copyLogic.ts` 拷贝逻辑 | ✅ |
| `tests/conflictLogic.test.ts` | `src/conflictLogic.ts` 冲突处理 | ✅ |
| `tests/encryptedGuard.test.ts` | C1 三项行为等价性回归网（Step 76 前置） | ✅ |
| `tests/misc.test.ts` | `src/misc.ts` 工具函数（含 Dropbox 文件夹名大小写修复） | ✅ |
| `tests/helpers/inMemoryFs.ts` | 内存版 FakeFs（**辅助模块，不计入用例数**） | — |
| `tests/encryptOpenSSL.test.ts` | **已随 C1 删除**（原含 2 个 `it.skip` 挂起用例） | — |

- 覆盖率（本轮 c8 实测，非沿用旧值）：`src/sync.ts` **75.80%** / `src/copyLogic.ts` **100%** / `src/conflictLogic.ts` **98.72%** / `src/encryptedGuard.ts` **97.69%**，**整体（src/）70.46%** —— 均满足 PRD Step 72 判据（关键路径 ≥ 70%、整体 ≥ 50%）
- 覆盖 PRD §5.1.C 的 3 项加密解耦行为等价性：`walk()` 的 `keyEnc = keyRaw` / `sizeEnc = sizeRaw`、`encryptEntity()` 等价性、远端 openssl 密文中止守卫

### Step 73 / B5 — 打包产物自检：✅ 通过（本轮 Phase 7/8 后正式复检）

> 复检对象为**构建产物 `main.js`**（HEAD `f69c1da` 产物，**经 `31c7a30` / `bb2886f` 重建后**，1,043,555 字节，md5 `5ffe14e9725ec80e84186e8342bf56a3`），与 PRD §6 Step 73 的判据口径一致。

**复检表（`grep -c "<key>" main.js`）：**

| 关键字 | 期望 | v1.3 轮次实测 | **本轮复检实测** | 结论 |
|---|---|---|---|---|
| `s3.cstcloud.cn` | 存在 | 3 | **3** | ✅ |
| `dropbox` | 0 | 4 | **0** | ✅（C3 清理后已归零） |
| `webdav` | 0 | 0 | **0** | ✅ |
| `onedrive` | 0 | 0 | **0** | ✅ |
| `pro/` | 0 | 0 | **0** | ✅ |
| `qrcode` | 0 | 0 | **0** | ✅ |
| `openssl` | 0 | 8 | **0** | ✅（C1 删除加密后端后已归零） |
| `rclone` | 0 | 9 | **0** | ✅（C1 删除 `@fyears/rclone-crypt` 后已归零） |
| `profiler` | 0 | 27 | **0** | ✅（C2 删除后已归零） |
| `syncalgov3` 6 个 i18n 键存在 | 3 语言各 6 个 | en/zh_cn/zh_tw 各 6 个 | **en/zh_cn/zh_tw 各 6 个**（`grep -c '"syncalgov3_' src/langs/*.json` → 6/6/6） | ✅ |

> **口径注记（实事求是）**：PRD AC25 写的字面命令 `grep -c "syncalgov3" main.js` → **6**，实测为 **8**。原因是 `grep -c` 计的是**行数**而非键数，而 esbuild 产物为压缩行、多个键可能落在同一行；**去重后的实际 i18n 键数 = 6**（`syncalgov3_title` / `_texts` / `_button_agree` / `_button_disagree` / `_checkbox_manual_backup` / `_checkbox_requiremultidevupdate`），与判据意图一致。
>
> **另注**：`grep -rni "<key>" src/ tests/` 维度下 `openssl`/`rclone`/`dropbox`/`webdav`/`onedrive` **不为 0**（分别为 12/4/3/1/1），这**不是残留**：它们是 C1 后**应当保留**的守卫与兼容代码 —— `src/encryptedGuard.ts` 需识别 openssl 密文 magic 前缀、`src/baseTypes.ts` 保留 `rclone-base64`/`openssl-base64` 旧 `data.json` 兼容类型、`src/misc.ts` / `src/sync.ts` 保留历史沿革注释。**产物维度（`main.js`）归零才是 Step 73 的正式判据**，产物已全绿。

**Step 73 结论：✅ 通过**（v1.3 轮次的「🟡 部分通过（4 项待 Phase 7 后复检）」在本轮复检后撤销，4 项残留全部归零）。

### 未做
- ❌ S3 真实连通测试（Step 70 / B2）——⛔ 按老板指示由老板本人执行
- ❌ 双向同步 E2E 测试（Step 71 / B3）——⛔ 按老板指示由老板本人执行
- ❌ AC33 配置目录同步 dry-run 比对——⛔ 待老板在测试 vault 实测

## 7. C1 / C2 实施与行为等价性

> PRD v1.3 §5.1.C 规定的 **3 项行为等价性约束**（R13 / R14 风险的对冲手段）。C1 = Step 75-77（加密后端移除 + `sync.ts` 解耦），C2 = Step 78（profiler 删除）。

### 7.1 行为等价性 ①：`walk()` 结果仍带 `keyEnc = keyRaw` / `sizeEnc = sizeRaw`

**实现**：`src/encryptedGuard.ts:60` 的 `copyEntityAndCopyKeyEncSizeEnc(entity)` 承担原 `FakeFsEncrypt.walk()` 的镜像字段填充职责；`src/sync.ts:1912` 对 `fsRemote.walk()` 的每个实体调用它。

**证据（逐行差分，base vs 新版）**：
```bash
git show 7badfc3:src/sync.ts | grep -n "keyEnc\|sizeEnc" | grep -v "//" | sed 's/^[0-9]*://' | sed 's/^ *//' > /tmp/base_refs.txt
grep -n "keyEnc\|sizeEnc" src/sync.ts              | grep -v "//" | sed 's/^[0-9]*://' | sed 's/^ *//' > /tmp/now_refs.txt
diff /tmp/base_refs.txt /tmp/now_refs.txt   # 无输出 = 逐行一致
```
结果：base 15 行 / 新版 15 行，**`diff` 无输出 —— `keyEnc`/`sizeEnc` 的 15 处代码引用逐行完全一致**（含 L111 / L117 / L745 / L757 / L761 / L767 / L794 / L842 / L904 / L960 / L985 / L1014 / L1043 / L1067 / L1114）。PRD R13 原文记为「16 处」，实际代码引用为 15 处（差异源于 R13 撰写时点与最终实现之间的注释行剔除口径），**不影响等价性结论**。

### 7.2 行为等价性 ②：`encryptEntity()` → `copyEntityAndCopyKeyEncSizeEnc()` 等价替换

**实现**：原 `FakeFsEncrypt.encryptEntity(entity)` 在空密码下为直通 + 镜像字段填充，被替换为 `src/encryptedGuard.ts:60` 的纯函数 `copyEntityAndCopyKeyEncSizeEnc(entity)`；`src/sync.ts` 共 **7 处**调用（L444 / L487 / L1475 / L1589 / L1620 / L1650 / L1912）。

**证据**：`grep -rn "fsEncrypt\|FakeFsEncrypt" src/ tests/` → **0**；`grep -rn "copyEntityAndCopyKeyEncSizeEnc" src/` → 7 处调用 + 1 处定义，签名一致。

### 7.3 行为等价性 ③：远端 openssl 密文中止守卫保留

**实现**：`src/encryptedGuard.ts` 导出 `checkRemoteEncryption()`（L110）/ `isRemoteEncrypted()`（L86）/ `isLikelyOpenSSLEncryptedName()`（L71）/ `MAGIC_ENCRYPTED_PREFIX_BASE32`（L26）/ `MAGIC_ENCRYPTED_PREFIX_BASE64URL`（L27）；中止语义 `remote_encrypted_local_no_password` **不变**（L32 类型定义 / L123 抛出点）。

**守卫在任何写操作之前**：`src/sync.ts:1899` 的 `checkRemoteEncryption(remotePartialEntityList)` 位于同步流程 **step 2 末**，而远端实体遍历（step 3）、本地遍历（step 4）与上传/下载/删除写操作（step 5+）**全部在其之后**；守卫失败即 `throw Error("remote_encrypted_local_no_password")`，**先于任何写动作**。

**证据**：`grep -rn "remote_encrypted_local_no_password\|MAGIC_ENCRYPTED_PREFIX" src/` → 5 处命中（守卫函数保留，符合 AC26 判据）；`tests/encryptedGuard.test.ts` 224 行覆盖该守卫（base32 / base64url 两种 magic 前缀 + 中止语义）。

### 7.4 差分对比：base vs 新版，同场景，归一化时间戳后 FULL EQUAL: True

**方法**：在 `7badfc3`（C1 前最后一个 commit）建立 git worktree，以**同一场景**（5 个决策分支：本地新建推送 / 远端新建拉取 / 冲突保留本地 / 远端删除回传本地 / 子目录推送）分别调用两版的 `doActualSync`，导出**本地/远端最终文件清单 + 每文件 size + 内容 SHA256 + prevSyncRecords 键集**，归一化时间戳后逐字节比对。

| 项 | base（`7badfc3`，FakeFsEncrypt 包装层） | 新版（`f69c1da`，copyEntityAndCopyKeyEncSizeEnc） |
|---|---|---|
| 同步报错 | `null` | `null` |
| 本地文件 | conflict.md / folder/inner.md / pull.md / push.md | **完全相同** |
| 远端文件 | conflict.md / folder/inner.md / pull.md / push.md / r-del.md | **完全相同** |
| 每文件 size + SHA256 | 5 个文件逐一比对 | **完全相同** |
| prevSyncRecords 键集 | 4 条 | **完全相同** |
| 归一化后 SHA256 | `5813fd53bfb3200d` | `5813fd53bfb3200d` |

**`FULL EQUAL: True`** ✅

**补充证据**：在 base worktree（`7badfc3`）内独立跑 `npx mocha --import=tsx 'tests/**/*.ts'` → **142 passing / 2 pending**（2 个 pending 为当时的 `it.skip` OpenSSL binary 测试），与 HEAD 的 **142 passing / 0 pending** **用例总数一致**（C1 删除旧 OpenSSL 测试并以 `tests/encryptedGuard.test.ts` 等价补位）。

## 8. 已知遗留与元数据瑕疵

> 本节如实登记本轮**未能完全收口**的事项，供发版前决策。

### 8.1 提交信息瑕疵：`98fd57f` 的 message 与实际改动不符

- **事实**：`98fd57f` 的 message 为 `docs: PRD v1.4（配置目录同步章节 §5.4 + R17 + Step 82 + AC33）`，但该提交**同时包含了 `src/profiler.ts`（153 行）的删除**。
  ```bash
  git show --stat 98fd57f
  #  PRD.md          | 137 ++++++++++++++++++++++++++++++++++++++++++++++++--
  #  src/profiler.ts | 153 --------------------------------------------------------
  ```
- **原因**：PM 执行 `git add PRD.md && git commit` 时**未加路径限定**，把并行任务（C2）已 `git rm` 进暂存区的删除一并提交。
- **处置**：**历史未改写** —— 为保住回滚点连续性（`backup/pre-v1.3-C1` → `7badfc3` 需保持可达且语义清晰），不做 `rebase` / `amend`；剩余引用清理由后续 `71ff8e2`（Step 78）承接。
- **影响**：**仅提交元数据不准**；代码内容本身正确，已通过 `npm test` 142 passing / `tsc` 0 error / `npm run build2` exit 0 全部验证。

### 8.2 i18n 2 个孤儿键已清理（AC19 收口）—— PRD 键数判据已在 v1.6 同步（本条遗留已关闭）

- `settings_synconsave_disable` / `settings_synconsave_enable`（原 `src/langs/{en,zh_cn,zh_tw}.json` L69 / L70）—— 「保存时自动同步」Setting 的文案；该 Setting 已由 A8/Step 67 删除，故这 2 个键成为**孤儿键**，**源码 0 引用**（`grep -rn "settings_synconsave" src/ --include=*.ts` → 0 命中）。
- **本轮已删（不再是遗留项）**：3 语言按**精确键名**同时删除（未按前缀模糊删，避免误伤同前缀键），**三语言各 169 → 167 键，键集合仍完全一致**；`grep -rn "settings_synconsave" src/langs/` → 0 命中；重建 `main.js` 后 `grep -c "settings_synconsave" main.js` → 0；`npm test` 142 passing / `npm run build2` exit 0。
- **PRD 文本遗留已关闭**：PRD v1.4 的「三语言各 169 键」判据（AC30）**已由 PRD v1.6（commit `26ac812`）同步为 167 键**；PRD §6 Step 81 亦补注「Step 81 时 169 键，commit `31c7a30` 后为 167 键」。**本条遗留关闭。** 不影响代码与验收结论（键集合一致性、构建、单测均已验证）。

### 8.3 `profilerresults` 孤儿表

- 旧库（已建库的 `data.json`）中的 `profilerresults` 表定义**保留**（兼容旧库，不做破坏性迁移）；**新库不再创建**该表。
- **不影响同步主流程**（PRD Step 78 判据已明示）。

### 8.4 旧 `data.json` 可能残留 `profiler` 键

- `src/configPersist.ts` 为**整对象序列化**，无键白名单；旧 `data.json` 中的 `profiler` 键会被原样写回。
- **运行时忽略多余键**，与 v1.0 删除 `password` 键的处理方式一致；**无功能影响**。

### 8.5 `npm run build`（webpack 备选链）损坏

- **非本次引入**（C1 之前即已损坏）。本项目**主链是 `npm run build2`**（esbuild），`exit 0`。
- webpack 链保留仅作上游兼容参考，不作为验收判据。

### 8.6 Step 70 / Step 71 未执行

- Step 70（B2，S3 真实连通性）与 Step 71（B3，双向同步 E2E）**待老板本人实测**；测试步骤清单见 §6。

### 8.7 AC33 未实测

- 配置目录同步（`.obsidian`）的 5 项清单比对（开关 UI 链路 / 顶层文件入清单 / 14 项排除生效 / 本插件目录仅 5 文件白名单 / 其他插件目录全量放行）**需老板在测试 vault 开启开关并 dry-run 比对清单**。
- 代码侧已完成：`grep -n "workspace-mobile.json" src/obsFolderLister.ts` → 2 处（L100 / L116），Step 82 已实施。

### 8.8 PRD 文档内的两处陈旧表述（均已由 v1.5 / v1.6 回填，非缺陷）

- **Step 1.5（PRD v1.5 已回填，PRD 现为 v1.7）**：PRD §6 历史 checklist 原写「文件仍在（12 行）」，但 `tests/fsWebdis.test.ts` 已由 Step 59 删除；PRD v1.5 已将该条改为 `[x] 已完成`，仅 v1.5 之前的版本仍留旧理由文本（v1.6 沿用该结论）。
- **Step 22（PRD v1.6 已回填，实际已完成）**：PRD §6 例外表原写「未完成」并引用 `src/settings.ts:366-368` 的 `settings_synconsave` 空壳 Setting；**PRD v1.6（commit `26ac812`）已将该例外项改为 `[x] 已完成`**。**实测该 Setting 已不存在**：`grep -n "syncOnSave" src/settings.ts` → **0 命中**，`grep -in "synconsave" src/settings.ts` → **0 命中**；该空壳已在 commit `f376a9f`（A8 / Step 67）随「设置页空壳元素清理」一并删除。**故 Step 22 实际已完成**。
  - 注：`src/` 别处仍有 20 处 `syncOnSave` 前缀命中，全部落在 `src/baseTypes.ts` / `src/main.ts`（其中 `syncOnSaveAfterMilliseconds` 7 处），那是**自动同步间隔定时器**（另一功能，AC30 强制为 `-1`），**不是** Step 22 的对象，勿混判。
- **结论**：Step 1.5 与 Step 22 **均已实际完成**，PRD §6 真实例外项只剩 **Step 11 / 37** 两项（二者均属「被 Step 48~54 覆盖，未按原描述完成」）；**PRD v1.6（commit `26ac812`）已完成收口**（例外项 3 → 2、AC17 口径 56 `[x]` + 3 `[ ]` → **57 `[x]` + 2 `[ ]`**）。PRD 文本已回填，**本条遗留关闭**，**不影响代码与验收结论**。

## 9. AC 终验对账表（AC1-AC33）

> 判定口径：**✅ 通过** = 本轮有可复现的命令 / commit / 文件证据；**⛔ 未执行（待老板实测）** = 需真实 S3 / 真实双向同步 / 真实 Obsidian 交互 / 真实 dry-run，本轮未执行；**⚠️ 部分** = 主干满足但存在残留或口径差；**➖ 后续发版项** = 依赖老板书面决策，非实施缺陷。

| AC | 简述 | 判定 | 依据 |
|---|---|---|---|
| AC1 | plugin id / name = `cstcloud-sync` | ✅ 通过 | `manifest.json` L2-L3 → `"id": "cstcloud-sync"`, `"name": "cstcloud-sync"` |
| AC2 | 设置页仅 3 个 S3 必填 + P1 可选，无其他云服务 | ✅ 通过 | Step 69/B1 桌面版实测渲染 **18 项设置**（3 S3 + 11 P1 + 1 P1 子字段 + 检查连接/冲突处理/同步方向 3 控件），无任何云服务选择器；`src/settings.ts` 19 个 `setName` 中 `settings_s3_bypasscorslocally` 仅在旧 URL 兼容分支渲染（正常路径不渲染）。**口径注记**：AC2 文字写「12 个 P1」，PRD §3.2 v1.3 复核口径为 **11 项**（P1-6 不存在、P1-13/14 已删），实现与 §3.2 一致 |
| AC3 | Endpoint / Region / URL Style / Log Level / Obfuscate 不在 UI | ✅ 通过 | `src/settings.ts` 中 `settings_s3_endpoint` / `settings_s3_region` / `settings_s3_urlstyle` / `settings_debuglevel` / `settings_obfuscatesettingfile` / `settings_logLevel` 命中均为 **0** |
| AC4 | 「检查连接」按钮验证 S3 连通性 | ⛔ 未执行（待老板实测） | 按钮存在（`settings_checkonnectivity`，`src/settings.ts` 第 6 个 Setting，Step 69 已验证渲染），但**真实连通性需老板在有凭证环境执行**（见 §6 Step 70） |
| AC5 | Ribbon 触发 start-sync + 命令面板 2 命令可用 | ✅ 通过 | Step 69/B1 实测：ribbon 按钮已注册；命令面板 `cstcloud-sync:start-sync` + `cstcloud-sync:start-sync-dry-run` 均可执行 |
| AC6 | `npm run build2` 无错误生成 `main.js` | ✅ 通过 | `npm run build2` → **exit 0**；main.js 1,043,555 字节，md5 `5ffe14e9725ec80e84186e8342bf56a3` |
| AC7 | `npm test` 无新增失败 | ✅ 通过 | `npm test` → **142 passing / 0 failing / 0 pending** |
| AC8 | 加载后 6 项关键字段被强制覆盖 | ✅ 通过 | `src/settings.ts` `loadSettings()` 强制覆盖 6 项（`s3.generateFolderObject=false` / `ignorePaths=[]` / `onlyAllowPaths=[]` / `enableStatusBarInfo=true` / `syncOnSaveAfterMilliseconds=-1` / `deleteToWhere="system"`），本轮未改动该逻辑 |
| AC9 | 同步算法说明弹窗 3 语言 6 键 | ✅ 通过 | `grep -c '"syncalgov3_' src/langs/{en,zh_cn,zh_tw}.json` → **6 / 6 / 6**；键名齐备（`_title` / `_texts` / `_button_agree` / `_button_disagree` / `_checkbox_manual_backup` / `_checkbox_requiremultidevupdate`） |
| AC10 | 导入/导出设置区块与调试区块消失 | ✅ 通过 | `ls src/importExport.ts src/debugMode.ts` → **均 No such file**；`src/settings.ts` 中相关 Setting 0 命中 |
| AC11 | `src/syncAlgoV3Notice.ts` 结构未被修改 | ✅ 通过 | `git diff 53f8062..HEAD -- src/syncAlgoV3Notice.ts` → 无改动（弹窗触发/同意行为原样保留） |
| AC12 | `tests/fsWebdis.test.ts` 不存在；tsc 0 error | ✅ 通过 | `ls tests/fsWebdis.test.ts` → No such file；`npx tsc --noEmit -skipLibCheck` → **0 error**（项目判据）；裸跑的 32 个 error 全部在 `node_modules/typescript/lib/*` |
| AC13 | git 基线干净 | ✅ 通过 | `git status --porcelain` → **空**；`git diff --numstat` → **0** 条目；`git config core.fileMode` → `false` |
| AC14 | 产品版本号三处统一 0.0.2，全仓不出现 0.0.3 | ✅ 通过 | （A3 开发基线验收时的历史证据）`package.json` L3 / `manifest.json` L4 均 `"version": "0.0.2"`；PRD §4.3 同口径。**注**：`0.0.3` 字样仅出现在 PRD.md 的 AC32/R9 **需求描述**中，以及 `package-lock.json` 的第三方依赖 `@fyears/eme@0.0.3` —— **产品版本字段无一处为 0.0.3**。**注：0.0.2 为开发基线；发版版本号已由老板指定为 0.0.3（manifest.json / package.json / PRD §4.3），"0.0.3" 字样出现在版本字段属预期，非违反本条判据。** |
| AC15 | README 品牌化 + 保留 Apache-2.0 归属与上游致谢 | ✅ 通过 | `README.md` / `README.zh-cn.md` 首行均为 `# cstcloud-sync`；两份 README 均含 Apache-2.0 与 fyears 上游致谢段 |
| AC16 | manifest 身份为 cstcloud 口径 | ✅ 通过 | `manifest.json` L7-L8 → `author = "cstcloud"`、`authorUrl = "https://github.com/studynt47/cstcloud-sync"`。<u>【v1.8 修正】仓库归属改为 studynt47（public），author / description 不变</u> |
| AC17 | §6 历史 checklist 59 条完成，2 条例外保留 `[ ]` 并注明原因 | ✅ 通过 | PRD §6 历史清单 **57 条 `[x]` + 2 条 `[ ]`**（Step 11 / 37）均同行注明原因，与 AC17 口径一致。**计数口径**：§6 共 59 个条目（Step 1-44 含 Step 1.5 计 45 条 + Step 45-58 计 14 条）；PRD v1.5 例外表 4 行中 Step 1.5 已标 `[x] 已完成`，余 `[ ]` 为 11 / 22 / 37（故 v1.5 记为 56 + 3）；本轮复核 Step 22 实际已完成（`grep -n "syncOnSave" src/settings.ts` → 0 命中，空壳已于 A8/Step 67 删除），故实为 **57 + 2**。**PRD v1.6 口径（commit `26ac812`；v1.7 未修订本条）**：§6 例外表 Step 22 已标 `[x] 已完成`，例外项仅剩 **Step 11 / 37**，AC17 判据为 **57 条 `[x]` + 2 条 `[ ]` = 59 条**，与 PRD §9 AC17 逐字一致 |
| AC18 | 设置页 H1 不再显示 `Remotely Save` | ✅ 通过 | `grep -c "Remotely Save" src/settings.ts` → **0** |
| AC19 | 无「选择服务」孤儿标题与「保存时自动同步」空标签 | ✅ 通过 | `grep -rn "settings_chooseservice\|settings_synconsave_desc" src/settings.ts src/langs/` → **0**（键已随 Step 67 / 81 删除）。**已满足（commit `31c7a30`）**：PRD v1.6 §9 AC19 判据保留并补注实测结论——清理 2 个孤儿键 `settings_synconsave_disable` / `settings_synconsave_enable` 后，三语言各 167 键、键集合完全一致，`grep -rn "settings_synconsave" src/langs/` → 0 命中，`grep -c "settings_synconsave" main.js` → 0 |
| AC20 | LICENSE 改为 Apache-2.0 + 派生声明 | ✅ 通过 | `LICENSE` 首部为 Apache License 2.0（`grep -c "Apache License"` → 9）；`grep -c PolyForm LICENSE` → **0**；含 remotely-save v0.5.25 / Copyright fyears 派生声明 |
| AC21 | **（B1）** Obsidian 桌面版加载测试通过 | ✅ 通过 | Step 69 实测：Obsidian 1.13.7 + Xvfb `:99`，manifest 校验通过、插件可启用无报错、设置页可渲染（18 项）、ribbon 可见、命令面板 2 命令。见 §6 |
| AC22 | **（B2）** S3 真实连通性通过（HeadBucket + ListObjectsV2） | ⛔ 未执行（待老板实测） | 按老板指示停止一切真实凭证测试；此前尝试均 **HTTP 401**（服务端拒绝，非网络不通）。步骤清单见 §6 |
| AC23 | **（B3）** 双向同步 E2E 4 条用例全通过 | ⛔ 未执行（待老板实测） | B2 未通 + 按老板指示停止真实环境测试，4 条用例均未执行。步骤清单见 §6 |
| AC24 | **（B4）** 核心逻辑单测补齐，覆盖率达标 | ✅ 通过 | `npm test` → **142 passing / 0 failing / 0 pending**；c8 实测 `src/sync.ts` **75.80%** / `src/copyLogic.ts` **100%** / `src/conflictLogic.ts` **98.72%** / `src/encryptedGuard.ts` **97.69%**，整体 **70.46%**（判据：关键路径 ≥70%、整体 ≥50%） |
| AC25 | **（B5）** 打包产物自检 | ✅ 通过 | `main.js`：`s3.cstcloud.cn` → **3**（≥1）；`dropbox`/`webdav`/`onedrive`/`qrcode`/`openssl`/`rclone`/`profiler`/`pro/` → **全部 0**；`syncalgov3` 去重键数 → **6**。**口径注记**：字面 `grep -c "syncalgov3" main.js` = **8**（`grep -c` 计行数，压缩产物多键同行），去重键数 6 与判据意图一致。详见 §6 Step 73 |
| AC26 | **（C1）** 加密后端确已移除 + 3 项行为等价性成立 | ✅ 通过 | `ls src/fsEncrypt.ts src/encryptOpenSSL.ts src/encryptRClone.ts src/encryptRClone.worker.ts tests/encryptOpenSSL.test.ts` → **全部 No such file**；`grep -rn "fsEncrypt\|FakeFsEncrypt" src/ tests/` → **0**；`grep -c "rclone-crypt" package.json` → **0**；`grep -rn "remote_encrypted_local_no_password\|MAGIC_ENCRYPTED_PREFIX" src/` → **5 处命中**（守卫保留）；3 项等价性见 §7（含 **FULL EQUAL: True**）；`npm run build2` → exit 0 |
| AC27 | **（C2）** profiler 确已移除 | ✅ 通过 | `ls src/profiler.ts` → No such file；`grep -rni "profiler" src/ tests/` → **0**；`npm run build2` exit 0 + `npm test` 142 passing |
| AC28 | **（C3）** `src/sync.ts` 4 处 dropbox 死分支已清理 | ✅ 通过 | `grep -n "dropbox" src/sync.ts` → **仅 L1340** 历史沿革注释，无 `serviceType === "dropbox"` 条件（符合 Step 79 判据「L1381 历史沿革注释可保留」） |
| AC29 | **（C4）** devDependencies 残留已清理 | ✅ 通过 | `webdav-server` / `openapi-typescript` / `npm-check-updates` / `@types/chai` / `@types/chai-as-promised` / `esbuild-plugin-inline-worker` / `worker-loader` → `package.json` 命中 **0**；`dotenv`（L37）/ `jsdom`（L39）/ `@types/jsdom` **保留**；`npm run build2` exit 0 + `npm test` 142 passing |
| AC30 | **（C5）** i18n 复核：40 处死键已删，3 语言键集合一致 | ✅ 通过 | 三语言键集合完全一致：Step 81 复检时各 **169** 键，AC19 收口再删 2 处孤儿键（`settings_synconsave_disable` / `_enable`，源码 0 引用）后现各 **167** 键（详见 §8.2）。**PRD v1.6（commit `26ac812`）已将 AC30 判据同步为 167 键**（PRD §6 Step 81 保留「清理后各为 169 键」的**历史叙述**，并补注「Step 81 时 169 键，commit `31c7a30` 后为 167 键」） |
| AC31 | **（发布）** v0.0.3 交付包形态符合 §7.1 | ✅ 通过 | 产出 `cstcloud-sync0.0.3.zip`（312,006 B / md5 `35ac128f6a3d378f46fdcd7b1e5149b0` / commit `357fbf2`），目录层级 `cstcloud-sync/`，含 6 个文件；**11 条形态判据逐条实测全通过**，明细见 §9.1。<u>【v1.8】因 manifest authorUrl 修正，发布包已重建（312,006 字节 / md5 35ac128f6a3d378f46fdcd7b1e5149b0）；§7.1 形态判据 11/11 仍全部通过（层级 cstcloud-sync/、6 文件、main.js 未变）</u> |
| AC32 | 发版前置：老板统一指定版本号 ≥ 0.0.3 且三处一致 | ✅ 已满足 | 老板 2026-10-28 书面指定发布版本号 **0.0.3**；`manifest.json` / `package.json` / PRD §4.3 三处一致；分发包 `cstcloud-sync0.0.3.zip` 已产出（commit `357fbf2`）。**本条已关闭。** |
| AC33 | **（v1.4）** 配置目录同步 5 项清单比对 | ⛔ 未执行（待老板实测） | 代码侧已完成：`grep -n "workspace-mobile.json" src/obsFolderLister.ts` → **2 处**（L100 / L116，Step 82 已实施）；`src/obsFolderLister.ts` L100 / L116 的排除数组各增 `"workspace-mobile.json"`。**但 5 项清单比对需老板在测试 vault 开启 `syncConfigDir` 开关并执行一次 dry-run 逐条核对**，本轮未做真实 dry-run |

### 9.1 v0.0.3 交付包解包核对（✅ 全部通过）

核对对象：仓库根目录 `cstcloud-sync0.0.3.zip`（312,006 字节，md5 `35ac128f6a3d378f46fdcd7b1e5149b0`，commit `357fbf2`）—— 包内 **7 个条目**（1 目录 + 6 文件），目录层级 `cstcloud-sync/`。

| # | 判据 | 期望 | 实测 | 结论 |
|---|---|---|---|---|
| 1 | 条目总数 | 7（1 目录 + 6 文件） | 7 | ✅ |
| 2 | 目录层级 | 全部 `cstcloud-sync/` 前缀，无扁平条目 | 扁平条目 0 | ✅ |
| 3 | 必需文件 | main.js / manifest.json / LICENSE / README.md | 4/4 | ✅ |
| 4 | 推荐文件 | README.zh-cn.md / versions.json | 2/2 | ✅ |
| 5 | 禁止项 | 不含 node_modules/ src/ tests/ package.json manifest-beta.json esbuild.config.mjs webpack.config.js tsconfig.json | 命中 0 | ✅ |
| 6 | manifest version | 0.0.3 | 0.0.3 | ✅ |
| 7 | manifest author | cstcloud | cstcloud | ✅ |
| 8 | versions.json | 含 "0.0.3": "0.13.21"，保留 0.3.2 / 0.3.25 | 3 条全在 | ✅ |
| 9 | LICENSE | 12,266 B（Apache-2.0 全文，非旧 432 B） | 12,266 B | ✅ |
| 10 | main.js | 与仓库根字节一致 | md5 均 `5ffe14e9725ec80e84186e8342bf56a3` | ✅ |
| 11 | 旧包 | `cstcloud-sync0.0.1.zip` 不存在 | 已删除 | ✅ |

**结论：§7.1 形态判据 11/11 全部通过，AC31 由「⚠️ 部分」升为「✅ 通过」。**

#### 9.1.1 历史对照（已被本轮取代）

> 以下为 **v0.0.1 全仓快照** 的历史核对结果，**已被本轮 v0.0.3 交付包取代**，仅保留作沿革记录。旧包 `cstcloud-sync0.0.1.zip`（634,628 字节，278 个条目）**已从磁盘删除**（该包从未被 git 跟踪，因 `.gitignore` 含 `*.zip`）。

核对对象（历史）：当时的仓库根目录唯一存在的 zip —— `cstcloud-sync0.0.1.zip`（634,628 字节，278 个条目）。

| §7.1 判据 | 期望 | 实测 | 结论 |
|---|---|---|---|
| `main.js` | 必需 | 存在，但为 **2026-10-17 的旧产物**（1,252,769 字节；当前产物为 1,043,555 字节 / md5 `5ffe14e9725ec80e84186e8342bf56a3`） | ❌ 内容过期 |
| `manifest.json` | 必需，version = 0.0.2 | 存在，但 `"version": "0.0.1"` | ❌ 版本号不符 |
| `LICENSE` | 必需（Apache-2.0） | 存在，但为 432 字节的旧版（当前根 LICENSE 为 12,266 字节的 Apache-2.0 全文） | ⚠️ 内容过期 |
| `README.md` | 必需 | 存在，但为 15,882 字节旧版（当前 6,311 字节） | ⚠️ 内容过期 |
| `README.zh-cn.md` | 推荐 | 存在（旧版 15,210 字节） | ⚠️ 内容过期 |
| `versions.json` | 推荐，含 `"0.0.2": "0.13.21"` | 存在，但内容为 `{"0.3.2": "0.12.15", "0.3.25": "0.13.21"}` —— **缺 `"0.0.2"` 条目** | ❌ 不满足 |
| **不含** `node_modules/` | 禁止 | **含**（1 个顶层条目） | ❌ 违反 |
| **不含** `src/` | 禁止 | **含**（36 个条目） | ❌ 违反 |
| **不含** `tests/` | 禁止 | **含**（13 个条目） | ❌ 违反 |
| **不含** `manifest-beta.json` | 禁止 | **含** | ❌ 违反 |
| 目录层级为 `cstcloud-sync/` | §7.1 | **扁平结构**（无 `cstcloud-sync/` 前缀目录） | ❌ 违反 |

**历史结论（已被本轮取代）**：该 zip 是 **v0.0.1 时期的开发全仓快照**，**不是** §7.1 定义的 v0.0.2 分发包 —— 形态判据 **5 处硬性违反**（含 `node_modules/` / `src/` / `tests/` / `manifest-beta.json` / 扁平层级）、**2 处内容过期**（main.js / manifest.json 版本号）、**1 处内容缺失**（`versions.json` 缺 `"0.0.2": "0.13.21"`）。根因是 **M10（发布）当时尚未执行** —— 产出插件包并同步副本至 `/home/WPS/ls/cstcloud-sync/` 属发版阶段动作。**该待办已于 v0.0.3 发版轮次（M10）完成**：产出 `cstcloud-sync0.0.3.zip`，§7.1 形态判据 11/11 全通过（见本节主表），旧包已删除。

## 10. 交付物清单

### 源码（`/home/WPS/ls/cstcloud-sync/` 或 `/root/Projects/cstcloud-sync/`）
- `main.js` (1,043,555 字节, build 产物, md5 `5ffe14e9725ec80e84186e8342bf56a3`)
- `manifest.json` (id=cstcloud-sync, version=0.0.3, author=cstcloud, authorUrl=https://github.com/studynt47/cstcloud-sync, minAppVersion=0.13.21)
- `package.json` (name=cstcloud-sync, version=0.0.3)
- `esbuild.config.mjs`
- `tsconfig.json`
- `src/` (**21** 个 .ts 文件，含新增 `sync.ts` + `conflictLogic.ts` + `encryptedGuard.ts`)
- `tests/` (**7** 个 test 文件 + `tests/helpers/inMemoryFs.ts` + `tests/static_assets/`)
- `assets/`, `styles.css`, `versions.json`, `LICENSE`, 等
- 无 `pro/` 目录；无 `src/profiler.ts`；无加密后端文件

### 分发包（v0.0.3）
- `cstcloud-sync0.0.3.zip`（312,006 字节，md5 `35ac128f6a3d378f46fdcd7b1e5149b0`，commit `357fbf2`）
- 目录层级 `cstcloud-sync/`，含 main.js / manifest.json / LICENSE / README.md / README.zh-cn.md / versions.json 共 6 个文件
- 副本同步至 `/home/WPS/ls/cstcloud-sync/`（由 PM 执行，不写 `/home/WPS/NEW/`）
- **不入库**：分发包已从 git 跟踪中移除（commit `df210ec`），遵循 `.gitignore` 的 delivery archives 政策；文件仅存于本机与 `/home/WPS/ls/cstcloud-sync/`
- ~~`cstcloud-sync0.0.1.zip`~~（v0.0.1 全仓快照，**已删除**）

### 公开仓库内容（2026-10-28 推送口径）
- **仓库**：`https://github.com/studynt47/cstcloud-sync`（**public**，GitHub 个人账号 `studynt47`）
- **公开文件范围**：`manifest.json` / `main.js` / `versions.json` / `README.md` / `README.zh-cn.md` / `LICENSE` / `GUIDE_config-dir-sync.md` / `package.json` / `package-lock.json` / `biome.json` / `esbuild.config.mjs` / `esbuild.injecthelper.mjs` / `tsconfig.json` / `src/` / `tests/` / `assets/` / `docs/` / `CLA.md` / `CONTRIBUTING.md` / `.github/` / `.env.example.txt`
- **不公开**：内部规划文档 **14 份**（`PRD.md` / `delivery/DELIVERY_REPORT.md` / `tech_v1.md` / `decomp_claudecode_v1.md` / `decomp_openclaw_v1.md` / `prd_review_v1.md` ~ `prd_review_v8.md` / `_pm_survey_2026-10-27.md`）+ `AGENTS.md` + `manifest-beta.json` + `webpack.config.js` + 分发包 zip
- **凭证**：GitHub PAT 仅存于 `/home/WPS/config/GitHub`，**不入库、不写入任何仓库文件**

### 文档
- `delivery/DELIVERY_REPORT.md` (本文件)

### 备份
- `/root/.openclaw/Project/cstcloud-sync/_archive/upstream_v0.5.25/` (原始 upstream v0.5.25 完整备份)

### 致谢
- 上游 fyears/remotely-save, Apache-2.0 License, 见 LICENSE 文件
- cstcloud-sync 二次开发 © 2024

## 11. 最终状态汇总与回滚点

### 11.1 最终状态汇总（一句话）

**代码侧 A + B + C 三类（Step 59-81）与 Phase 8（Step 82）已全部完成并验证通过** —— `npm test` **142 passing / 0 failing / 0 pending**、`tsc`（项目判据）**0 error**、`npm run build2` **exit 0**、Step 73 产物自检 **全绿**、C1 的 3 项行为等价性经差分对比确认 **FULL EQUAL: True**；**发布：✅ v0.0.3 已产出**（`cstcloud-sync0.0.3.zip`，312,006 字节 / md5 `35ac128f6a3d378f46fdcd7b1e5149b0` / commit `357fbf2`），**AC31 ✅ 通过**（§7.1 形态判据 11/11 全通过）、**AC32 ✅ 已满足**（老板 2026-10-28 书面指定 0.0.3，`manifest.json` / `package.json` / PRD §4.3 三处一致，PRD R9 已解除）；**剩余待老板实测项为 Step 70（B2 真实 S3 连通）/ Step 71（B3 双向同步 E2E）/ AC33（配置目录同步 dry-run 清单比对）** —— 三项**仍为 ⛔ 未执行**，按老板指示由老板本人执行。

- **发布仓库**：`https://github.com/studynt47/cstcloud-sync`（public）；发布包 `cstcloud-sync0.0.3.zip` 312,006 字节 / md5 `35ac128f6a3d378f46fdcd7b1e5149b0`，形态判据 11/11 通过

### 11.2 回滚点

| 名称 | 指向 | 含义 |
|---|---|---|
| tag + branch `backup/pre-v1.3-C1` | `7badfc3` (`refactor(i18n): 清理 40 处死键…`) | **C1 前最后一个 commit**，加密后端尚在、profiler 尚在的完整可回滚点（R11 强制要求，已验证 tag 与 branch 均可达） |
| tag `backup/pre-v1.3-C1-old` | `53f8062` (`docs: 交付报告 §1 标题口径校正…`) | 更早的备份点，C1 实施前的旧快照 |

### 11.3 本轮 commit 链（12 个，Step 59 → HEAD）

```
f69c1da docs: 新增《.obsidian 配置目录同步（实验性）》操作指引
c4efefa docs: 标注加密能力已移除（历史归档）
43e36a1 fix(config): 补齐 workspace-mobile.json 排除（Step 82）
71ff8e2 refactor(C2): 删除 profiler 接线与埋点（Step 78）
98fd57f docs: PRD v1.4（配置目录同步章节 §5.4 + R17 + Step 82 + AC33）
2b8ef6c refactor(C1): 删除加密后端、清理接线与构建依赖（Step 75 + 77）
f93c6db refactor(C1): 解耦 src/sync.ts 的加密包装层（Step 76）
a74c5e0 feat(C1): 新增加密守卫模块 encryptedGuard.ts（Step 76 前置）
7badfc3 refactor(i18n): 清理 40 处死键，三语言键集合统一（Step 81）
cd14242 chore(deps): 清理 5 个无用 devDependencies（Step 80）
7f39c5d test(B4): 补齐 2 个变异存活分支的断言
7f77785 refactor(C3): 清理 dropbox 死分支（Step 79）
```

> 注：`98fd57f` 的提交信息与实际改动不符（同时含 `src/profiler.ts` 删除），详见 §8.1。
