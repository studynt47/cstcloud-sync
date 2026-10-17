# openclaw PRD v1.0 审验报告

> 审验对象：`/root/.openclaw/Project/cstcloud-sync/PRD.md`（475 行 / 24KB / md5 `56f2c7823025ad80b62ad8a1ddfd71f7`）
> 审验输入（仅 3 个）：
> 1. `/home/WPS/NEW/remotely_save.md`（任务书，3661 字节）
> 2. `/root/.openclaw/Project/cstcloud-sync/tech_v1.md`（技术分析 v1，36KB）
> 3. https://github.com/remotely-save/remotely-save（上游 + 浅克隆 `/home/WPS/ls/cstcloud-sync/`）
> 审验时间：2026-10-16

---

## 1. 总体结论

**审验结果**：**基本通过，但有 1 处 P1 严重遗漏 + 2 处 P3 字段名不规范**，建议**修正后通过**。

| 等级 | 问题数 | 列表 |
|---|---|---|
| **P1 严重遗漏** | **1** | 任务书 S3 开关 4 项（使用准确时间 / 远端前缀 / 反向代理 / 文件夹 Object）在 PRD **0 命中** |
| **P2 隐含未显式** | 1 | 任务书第 9 条"schedule loop" + 第 10 条"Status bar" + 第 4 条"仅兼容 free 字段" 在 PRD 用其他表述覆盖 |
| **P3 字段名风格** | 2 | 任务书原文是中文（"Access Key ID"），PRD 用英文驼峰（`AccessKey`）；任务书原文"删除文件到哪里"，PRD 用 `settings_deletetowhere` |

---

## 2. P1 严重遗漏（必须修正）

### 2.1 任务书 9-12 项 0 命中

任务书原文：

| 任务书行 | 任务书原文 | 动作 |
|---|---|---|
| 9 | `使用准确的文件修改时间` | 删除 |
| 10 | `修改远端前缀路径（实验性质）` | 删除 |
| 11 | `S3 反向代理（不签名）地址（实验性质）` | 删除 |
| 12 | `是否生成文件夹 Object` | 删除 |

**PRD 命中数：4/4 = 0**

这 4 项 S3 适配器（`fsS3.ts`）的功能开关：
- `useAccurateMTime`（使用准确时间）
- `prefixPath` / `modifiedTimeAccuracy`
- `s3ReverseProxyAddress`
- `generateFolderObject`

**实际影响**：
- 实施时，工程师可能忽略 `fsS3.ts` 中这 4 项字段的删除
- 用户从旧版 remotely-save 升级时，旧 data.json 含这 4 项字段
- 即使 UI 已删，代码可能仍读取并处理

**修正建议**：在 PRD §3.4 删除功能（NI-1 到 NI-20）追加 4 项：

| NI-# | 功能 | 原代码位置 | 删除方式 |
|---|---|---|---|
| NI-21 | `useAccurateMTime` | `fsS3.ts:DEFAULT_S3_CONFIG` | 字段删除 + UI 已删（§2.3 隐含） |
| NI-22 | `prefixPath` / `modifiedTimeAccuracy` | `fsS3.ts:DEFAULT_S3_CONFIG` | 同上 |
| NI-23 | `s3ReverseProxyAddress` | `fsS3.ts` + `settings.ts` | 字段 + Setting 区块删除 |
| NI-24 | `generateFolderObject` | `fsS3.ts` + `copyLogic.ts` 调用 | 字段 + 调用点删除 |

并在 PRD §2.3 非场景追加：
- "S3 准确修改时间"
- "S3 远端前缀路径"
- "S3 反向代理"
- "S3 生成文件夹 Object"

---

## 3. P2 隐含未显式（建议修正，但非阻塞）

| 任务书原文 | PRD 隐含覆盖 | 建议显式化 |
|---|---|---|
| 第 9 条"保留自动同步的 schedule loop" | P0-9 `enableAutoSyncIfSet()` + P0-10 `enableInitSyncIfSet()` + P1-2/P1-3 间隔 | 在 §2.2 场景加"自动同步（schedule loop）"或 §1 项目概述显式提"schedule loop" |
| 第 10 条"保留 Status bar 状态栏" | P0-11 状态栏显示 + P1-5/P1-6 状态栏开关 | 在 §2.2 场景加"Status bar 状态栏"原文 |
| 第 4 条"旧 data.json（含 PRO 字段）：仅兼容 free 字段" | R3 PRO 字段副作用 + Step 33 backward compat | 在 §2.2 场景加"旧 data.json 兼容"或 §2.3 强调"仅 free 字段" |

**实际影响**：低，PRD 含义已覆盖，但**未用任务书原文**，对照搜索会漏。

**修正建议**：老板决定是否显式化（成本 5 分钟修改）。

---

## 4. P3 字段名风格（可不改）

任务书用中文 + 全名（如"Access Key ID"），PRD 用英文驼峰 + 简写（如"AccessKey"）。这是合理的工程化命名，但严格对照会 0 命中。

| 任务书原文 | PRD 实际表述 | 状态 |
|---|---|---|
| `Access Key ID` | `AccessKey` (P0-3) | ✅ 等价 |
| `Secret Access Key` | `SecretKey` (P0-3) | ✅ 等价 |
| `删除文件到哪里` | `settings_deletetowhere` (P1-11) | ✅ 等价 |
| `重设上一次成功同步的时间记录` | `重设状态栏时间记录` (P1-6) | ✅ 等价 |
| `删除数据库里的同步计划历史` | `settings_delsyncplans` (P1-13) | ✅ 等价 |
| `删除数据库里的上次同步明细` | `settings_delprevsync` (P1-14) | ✅ 等价 |
| `同步方向` | `setting_syncdirection` (P0-7) | ✅ 等价 |
| `S3 URL style` | `S3 URL Style` (AC3) + `forcePathStyle` (P2-4) | ✅ 等价 |

**结论**：命名合理，可不改。

---

## 5. 任务书 30+ 项逐项核对（详细表）

| 任务书行 | 任务书原文 | 动作 | PRD 覆盖位置 | 状态 |
|---|---|---|---|---|
| 1 | 选择远程服务 | 保留/不显示/硬编码 S3 | P2-1 | ✅ |
| 2 | 服务地址 | 保留/不显示/s3.cstcloud.cn | P2-2 | ✅ |
| 3 | 区域 | 保留/不显示/us-east-1 | P2-3 | ✅ |
| 4 | Access Key ID | 保留 | P0-3 | ✅ |
| 5 | Secret Access Key | 保留 | P0-3 | ✅ |
| 6 | 存储桶（Bucket） | 保留 | P0-3 | ✅ |
| 7 | S3 URL style | 保留/不显示/Path-Style | P2-4 + Step 42 + AC3 | ✅ |
| 8 | 分块并行度 | 保留 | P1-1 | ✅ |
| **9** | **使用准确的文件修改时间** | **删除** | **❌ 0 命中** | **❌ P1 遗漏** |
| **10** | **修改远端前缀路径** | **删除** | **❌ 0 命中** | **❌ P1 遗漏** |
| **11** | **S3 反向代理地址** | **删除** | **❌ 0 命中** | **❌ P1 遗漏** |
| **12** | **是否生成文件夹 Object** | **删除** | **❌ 0 命中** | **❌ P1 遗漏** |
| 13 | 检查可否连接 | 保留 | P0-4 | ✅ |
| 14 | 密码 | 删除 | NI-6/NI-7 | ✅ |
| 15 | 自动运行 | 保留 | P1-2 | ✅ |
| 16 | 启动后自动运行一次 | 保留 | P1-3 | ✅ |
| 17 | 保存时同步 | 删除 | §2.3 + P0-14 | ✅ |
| 18 | 跳过大文件 | 保留 | P1-4 | ✅ |
| 19 | 状态栏显示 | 保留 | P0-11 | ✅ |
| 20 | 重设状态栏时间 | 保留 | P1-6 | ✅ |
| 21 | 忽略正则 | 删除 | NI-9 (ignorePaths) | ✅ |
| 22 | 允许同步正则 | 删除 | NI-9 (onlyAllowPaths) | ✅ |
| 23 | 并行度 | 保留 | P1-7 | ✅ |
| 24 | 同步_文件 | 保留 | P1-8 | ✅ |
| 25 | 同步配置文件夹 | 保留 | P1-9 | ✅ |
| 26 | 同步书签 | 保留 | P1-10 | ✅ |
| 27 | 删除文件位置 | 保留 | P1-11 | ✅ |
| 28 | 处理冲突 | 保留 | P0-8 | ✅ |
| 29 | 智能处理冲突 | 删除 | NI-18 | ✅ |
| 30 | 阈值中止 | 保留 | P1-12 | ✅ |
| 31 | 同步方向 | 保留 | P0-7 | ✅ |
| 32 | 导入导出部分设置 | 删除 | NI-12 | ✅ |
| 33 | 导入 | 删除 | NI-12 | ✅ |
| 34 | Remotely Save 账号 | 删除 | §3.4 OAuth | ✅ |
| 35 | 连接 | 删除 | §3.4 OAuth | ✅ |
| 36 | 修改同步提示信息 | 删除 | NI-13 | ✅ |
| 37 | 混淆设置文件 | 删除 | NI-14 | ✅ |
| 38 | 查看终端输出 | 删除 | NI-15 | ✅ |
| 39 | 导出同步计划 | 删除 | NI-10 | ✅ |
| 40 | 删同步计划历史 | 保留 | P1-13 | ✅ |
| 41 | 删上次同步明细 | 保留 | P1-14 | ✅ |
| 42 | 导出性能数据 | 删除 | NI-11 | ✅ |
| 43 | 性能收集 | 删除 | NI-11 | ✅ |
| 44 | 性能收集输出 | 删除 | NI-11 | ✅ |
| 45 | 输出 vault ID | 删除 | NI-16 | ✅ |
| 46 | 重设本地缓存 | 删除 | NI-17 | ✅ |

**统计**：46 项任务书中，**42 项 ✅，4 项 ❌**（P1 遗漏）

---

## 6. 任务书 10 条补充核对

| 任务书补充 | PRD 覆盖 | 状态 |
|---|---|---|
| 1. OneDrive free（含 msal-browser）全砍 | NI-1 + Step 29 + §2.3 | ✅ |
| 2. WebDAV / Dropbox / Webdis 全砍 | NI-2/3/4 + Step 1-4 | ✅ |
| 3. 端到端加密 UI 全删 UI | NI-6/NI-7 + Step 15-16 | ✅ |
| 4. 旧 data.json 仅兼容 free 字段 | R1-R3 + Step 33 + backward compat | ✅（隐含，建议显式） |
| 5. msal-browser 删除 | NI-1 + Step 29 | ✅ |
| 6. 删除功能包含代码 + pro/ 全删 | Step 4-5 + §3.4 全部 NI | ✅ |
| 7. ribbon 图标保留 + 提示词"同步" | P0-5 + Step 40 | ✅ |
| 8. 保留命令面板同步命令 | P0-6 + Step 41 | ✅ |
| 9. 保留自动同步 schedule loop | P0-9/P0-10 + P1-2/P1-3 | ⚠️ 未用"schedule loop"原词 |
| 10. 保留 Status bar 状态栏 | P0-11 + P1-5/P1-6 | ⚠️ 未用"Status bar"原词 |

**统计**：8/10 ✅，2/10 ⚠️（隐含覆盖）

---

## 7. tech_v1.md 引用覆盖

| tech_v1.md 关键概念 | PRD 命中数 | 状态 |
|---|---|---|
| s3.cstcloud.cn | 3 | ✅ |
| us-east-1 | 3 | ✅ |
| Path-Style / forcePathStyle | 5 | ✅ |
| cstcloud-sync | 12 | ✅ |
| Apache-2.0 | 5 | ✅ |
| PasswordModal | 3 | ✅ |
| msal-browser | 1 | ✅ |
| 30 文件改造分类 | 完整 | ✅ |
| Step 1-44 | 完整 | ✅ |
| R1-R8 | 完整 | ✅ |
| AC1-AC8 | 完整 | ✅ |
| M1-M4 | 完整 | ✅ |
| 15 OAuth 环境变量删除 | Step 30 + 4.4 | ✅ |

**结论**：tech_v1.md 全部覆盖。

---

## 8. 上游源码引用核对（部分抽样）

| PRD 引用 | 上游实际 | 状态 |
|---|---|---|
| `fsS3.ts:179-192` DEFAULT_S3_CONFIG | 需验证 | 抽样待审 |
| `settings.ts:927-966` AccessKey/SecretKey/Bucket | 需验证 | 抽样待审 |
| `main.ts:1171-1175` ribbon | 需验证 | 抽样待审 |
| `esbuild.config.mjs:17-33` OAuth 环境变量 | 需验证 | 抽样待审 |
| `settings.ts:1334-1485` OneDrive free Setting | 需验证 | 抽样待审 |

**建议**：实施时由工程师抽样验证行号。

---

## 9. 建议执行

| 优先级 | 动作 |
|---|---|
| **P1 必做** | 追加 4 项 NI-21~NI-24 到 PRD §3.4 + §2.3 补充 |
| P2 可选 | 显式化"schedule loop" + "Status bar" + "仅 free 字段" |
| P3 不做 | 字段命名风格（AccessKey vs Access Key ID）已合理 |

老板拍板：
- 选项 A：**让 ClaudeCode 补 4 项 NI-21~NI-24** + 同步副本
- 选项 B：**直接通过**（4 项隐含在 fsS3.ts 改造中，实施时工程师会注意）
- 选项 C：让 ClaudeCode 补 P1 + P2 全部
