# PRD <u>v2.2</u>

> 项目 cstcloud-sync 计划书 <u>v2.2</u>
> 基于：remotely-save v0.5.25（Apache-2.0）+ 任务书 /home/WPS/NEW/remotely_save.md + 技术分析 tech_v1.md

**当前版本**：<u>v2.2</u>
**生成时间**：2026-10-16
**修订时间**：<u>2026-11-13</u> <u>（v2.1 修订于 2026-11-14）</u> <u>（v2.2 修订于 2026-11-15）</u>
**状态**：<u>已实施并已发布（v1.9 两轮回填版；发布版本号 0.0.6（v2.2 起收口；v1.9 口径为 0.0.5），发布仓库 studynt47/cstcloud-sync（public），代码侧两轮修复均已实施并上线）</u> <u>【v1.9 变更注：原表述为「待评审（v1.8 发布仓库回填版；发布版本号 0.0.3，发布仓库 studynt47/cstcloud-sync（public）已确定，代码侧实施完成）」。v1.9 起按已上线事实收口为 0.0.5；v1.8 及更早的「0.0.3」口径原样保留于下方修订记录与 §4.3 / §7.1 / §9 的 v1.9 变更注中，不静默删改】</u> <u>【v2.0 变更注：本版对应产品版本 **0.0.6** 的改造收口；批次 A（`9e71b14`）/ B（`b55449e`）/ C（`0f4f96e`）/ D（`c97a7ca`）**源码已提交并复核通过**；**版本号推进（0.0.5 → 0.0.6）与 `main.js` 重建尚未执行**，因此本版中凡涉及版本号落值与产物 MD5 的判据一律标 ⛔ 待回填】</u> <u>【v2.1 变更注：版本号推进（0.0.5 → 0.0.6）**已执行**（commit `4b8d6f6`，`manifest.json` / `package.json` / `package-lock.json` / `versions.json` **四处一致**为 `0.0.6`，`versions.json` **6 条**）；`main.js` **已重建**（commit `01b238d`，md5 `87fa862dc9abb869ecab1ba7eba4e2ab`、**1,038,403 字节**），相应产物类 ⛔ 已回填。**v0.0.6 分发包尚未产出、线上 Release 未发布 —— 全文不得表述为「v0.0.6 已发布 / 已上线 / 已交付」**；「已发布 / 已上线」仅指 **0.0.5 及更早**】</u> <u>【v2.2 变更注：发布版本号按已发布事实收口为 **0.0.6**（v1.9 口径 0.0.5 原样保留于下方修订记录与 §4.3 / §7.1 / §9 的历史变更注中，不静默删改）；**v0.0.6 分发包 `cstcloud-sync0.0.6.zip` 已产出** —— **310,804 字节** / md5 `122b6c075f6498e237c5779153a58b36`，目录层级 `cstcloud-sync/`，含 `main.js`(1,038,403 B) / `manifest.json`(301 B) / `versions.json`(136 B) / `README.md`(6,311 B) / `README.zh-cn.md`(5,743 B) / `LICENSE`(12,266 B) 共 **6 个文件**，**§7.1 交付物形态判据 11/11 通过**（与 v0.0.5 同一形态表，未新增 / 删减条目）；**线上 Release 已发布** —— tag `0.0.6`（指向 commit `70bedbeb34ede0b10da961aa1b072f6ee70ba186`，即当前 `origin/main` 的 HEAD）、Release `https://github.com/studynt47/cstcloud-sync/releases/tag/0.0.6`（draft=false、prerelease=false；assets：`cstcloud-sync0.0.6.zip`(310,804 B) / `main.js`(1,038,403 B) / `manifest.json`(301 B)），发布仓库 `studynt47/cstcloud-sync`（public）。**⛔ 真机验收项仍未实测** —— 桌面端 / 移动端 ribbon tooltip 两态、移动端高级设置区逐项可见性等不在本次发布范围，线上 Release `0.0.6` 的 notes 已如实声明，**本版一律保持 ⛔ 未完成**】</u>

---

## 修订记录

| 版本 | 修订时间 | 变更点 |
|---|---|---|
| v1.0 | 2026-10-16 | 初始版本，基于 remotly-save v0.5.25 改造为 cstcloud-sync <u>（已实施，对应产品版本 v0.0.1）</u> |
| <u>v1.1</u> | <u>2026-10-17</u> | <u>① 弹窗文案改 3 langs × 6 键（langs 3 文件 + §5.1.A syncAlgoV3Notice.ts / §6 Step45~47 系列 / §9 AC9）</u> <u>（已实施，对应产品版本 v0.0.2）</u> |
| | | <u>② 删除"导入导出部分设置"功能（§3.4 NI-12 删 / §5.1 A 类文件 / §6 Step48~54 / §9 AC10）</u> |
| | | <u>③ 删除"调试-删除同步计划历史"功能 + 删 debugMode.ts（§3.2 P1-13/14 删 / §3.4 NI-12 删 / §5.1 A 类文件 / §6 Step55~58 / §9 AC10）</u> |
| v1.2 | 2026-10-27 | <u>① 状态收口：v1.1 由"定稿待评审"改标"已实施（v0.0.2）"（实施 commit 4f383e6，44 步 checklist 全通过，manifest.json version=0.0.2）② 本版未新增功能条目，仅推进版本号至 v1.2 作为下一轮升级基线，升级需求待老板明确后叠加</u> |
| <u>v1.3</u> | <u>2026-10-27</u> | <u>① A 修复类（6 项）② B 质量类（5 项）③ C 瘦身类（5 项）④ 产品版本号统一 0.0.2，不升 0.0.3</u> <u>⑤ 版本号口径澄清：开发/升级阶段产品版本号沿用 0.0.2（开发基线口径，不锁发布版本）；最终发布版本号在 A/B/C 全部验收通过后由老板统一指定（须 ≥ 0.0.3，否则 Obsidian 商店无法覆盖已发布的 0.0.2）⑥ 本行为评审中修订，PRD 版本号不递增</u> |
| <u>v1.4</u> | <u>2026-10-27</u> | <u>① 新增章节「§5.4 `.obsidian` 配置目录同步（实验性）」—— 记录 `syncConfigDir` 开关的真实同步范围、14 项排除清单、3 个必知坑与使用前提（代码零改动）② 新增风险 R17「配置目录同步为全量不可调」（高）③ 新增 Step 82「补齐 `workspace-mobile.json` 排除」（2 行改动，Phase 7 之后）④ 新增验收标准 AC33（配置目录同步）⑤ AC32 的 Step 覆盖范围由 59–81 扩至 59–82</u> |
| <u>v1.5</u> | <u>2026-10-27</u> | <u>勘误版：§5.1.C ① 与 R13 的 keyEnc/sizeEnc 引用数 16→15（实测口径）、§6 例外项 Step 1.5 标记为已完成、§9 AC17 例外项 4→3</u> |
| <u>v1.6</u> | <u>2026-10-27</u> | <u>收口版：§6 例外表 Step 22 标记为已完成（例外项 3→2：Step 11/37）、i18n 键数判据 169→167（commit 31c7a30 清理 2 个孤儿键）、§9 AC17 例外项 3→2、AC19 标注已满足</u> |
| <u>v1.7</u> | <u>2026-10-28</u> | <u>① 发版号回填：§4.3 version 0.0.2 → 0.0.3（manifest.json / package.json / PRD §4.3 三处一致）② §7.1 交付物形态与 §9 AC31 判据的 versions.json 条目随发版号更新为 "0.0.3": "0.13.21" ③ §9 AC32 由「➖ 后续发版项」改为「✅ 已满足」④ §8 R9（发版号未递增）标记为已解除 ⑤ §9 AC14 增补说明：0.0.2 为开发基线、0.0.3 为发布版本号，历史判据不动</u> |
| <u>v1.8</u> | <u>2026-10-28</u> | <u>① 发布仓库地址回填：§4.3 authorUrl 由 https://github.com/cstcloud/cstcloud-sync 改为 https://github.com/studynt47/cstcloud-sync（原仓库实测 404 不存在，Obsidian 商店审核要求 authorUrl 可访问）② §6 Step 64 与 §9 AC16 增补 v1.8 变更注，历史判据文字不改 ③ 新增公开发布口径说明段：仓库为 public，归属个人账号 studynt47 ④ 本版未新增功能条目，AC1–AC33 编号不变</u> |
| <u>v1.9</u> | <u>2026-10-28</u> | <u>① 记录已实施并已上线两轮：**v0.0.4**（移动端设置项缺失修复 —— 移植时 `if (!Platform.isMobileApp)` 块边界错位，把整个高级设置区圈进移动端禁用范围，收回为 376→389 行 14 行，9 项设置恢复可见；新增 §9 AC34）② **v0.0.5**（品牌口径统一「聚沄同步 / juiyun sync」+ 修 i18n 中 6 处 404 链接 —— ribbon tooltip 与设置页标题改走 i18n，新增 2 个 i18n key，三语言各 169 键；新增 §9 AC35）③ §4.3 `version` 0.0.3 → **0.0.5**（manifest.json / package.json / versions.json / PRD 四处一致）④ §7.1 交付物形态升为 v0.0.5、versions.json 判据改为须含 `"0.0.5": "0.13.21"`（现有 5 条）⑤ §7 M10 / M11 标记已完成 ⑥ i18n 键数判据 167 → **169**（§6 Step 81 / §9 AC19 / AC30 一并更新）⑦ §9 AC31 / AC32 更新为 v0.0.5 口径 ⑧ §8 新增 R18「移植类缺陷：条件块边界错位」与 R19「品牌/仓库地址变更需全仓 grep（含 i18n）」⑨ Step 70 / Step 71 / AC22 / AC23 / AC33 五项 ⛔ 仍待老板本人实测，保持未完成状态 ⑩ 本版未新增功能条目，AC1–AC33 编号不变，新编号自 AC34 起续编</u> |
| <u>v2.0</u> | <u>2026-11-13</u> | <u>① B 类 12 项决策落定：B-2/B-3 按 D1 处置（删 UI、保留强制覆盖）；B-4 删除「保存后同步」整条死链；B-5 用户可见文案接入 i18n；B-6~B-12 行为不变清理 ② 发布版本号 0.0.5 → 0.0.6 ③ i18n 键数判据 169 → 167 ④ 新增 §9 AC36 / AC37、§8 R20 / R21、§6 Step 85 / 86 ⑤ 编号自 AC36 / R20 / Step 85 起续编</u> |
| <u>v2.1</u> | <u>2026-11-14</u> | <u>① **仅回填 v0.0.6 实测值，不新增任何功能条目**：版本号推进 0.0.5 → 0.0.6 **已执行**（`4b8d6f6`）—— `manifest.json` / `package.json` / `package-lock.json`（root `version` 与 `packages[""]` `version` 各一处）/ `versions.json` **四处一致为 `0.0.6`**；`versions.json` **6 条**（`0.3.2` / `0.3.25` / `0.0.3` / `0.0.4` / `0.0.5` / `0.0.6`），新增 `"0.0.6": "0.13.21"`；`package-lock.json` 中 `"0.0.5"` 命中 **0**；`manifest.json` 红线字段 `id` / `name` / `description` / `author` / `authorUrl` / `minAppVersion`(0.13.21) / `isDesktopOnly` **逐字节未改** ② `main.js` **已重建**（`01b238d`，`npm run build2`）—— md5 `87fa862dc9abb869ecab1ba7eba4e2ab`、**1,038,403 字节**（重建前 md5 `26105bde8e16815ead12167f12afa42c` / 1,043,812 字节，字节差 **−5,409**，沿革保留）③ 品牌计数**实测**：大写 `\u805A` = **28** / `juiyun sync` = **14**，与 v2.0 AC37⑥ 预测值**完全一致（差值 0）**；统计口径为**大写** `\uXXXX` 转义形式 ④ **AST 校验**：新产物内 `MemberExpression.isMobileApp` 命中 **0**，旧产物（`c97a7ca`）对照命中 **1**（`Ye.Platform.isMobileApp`）—— 守卫有效、非假阴性 ⑤ `npm test` → **142 passing / 0 failing**；`npx tsc -noEmit -skipLibCheck` → **exit 0**（无输出）⑥ AC36 / AC37 的**产物类 ⛔ 已回填**；**真机验收类 ⛔ 仍未完成** ⑦ ⛔ 分发包 `cstcloud-sync0.0.6.zip` **尚未产出**（属 M10，老板另行指定）、线上 Release **未发布** —— 本版**不得**表述为「v0.0.6 已发布 / 已上线 / 已交付」 ⑧ 编号未新增：AC1–AC37 / R1–R21 / Step 1–86 全部保持不变</u> |
| <u>v2.2</u> | <u>2026-11-15</u> | <u>① **仅回填 v0.0.6 分发包与线上 Release 的实测值，不新增任何功能条目、不改动 §1–§9 的章节结构与编号**：分发包 `cstcloud-sync0.0.6.zip` **已产出** —— **310,804 字节** / md5 `122b6c075f6498e237c5779153a58b36`，目录层级 `cstcloud-sync/`，含 `main.js`(1,038,403 B) / `manifest.json`(301 B) / `versions.json`(136 B) / `README.md`(6,311 B) / `README.zh-cn.md`(5,743 B) / `LICENSE`(12,266 B) 共 **6 个文件**，**§7.1 交付物形态判据 11/11 通过**（与 v0.0.5 同一形态表，未新增 / 删减条目）② **线上 Release 已发布** —— tag `0.0.6`（指向 commit `70bedbeb34ede0b10da961aa1b072f6ee70ba186`，即当前 `origin/main` 的 HEAD）、Release `https://github.com/studynt47/cstcloud-sync/releases/tag/0.0.6`（draft=false、prerelease=false），assets = `cstcloud-sync0.0.6.zip`(310,804 B) / `main.js`(1,038,403 B) / `manifest.json`(301 B)；发布仓库 `studynt47/cstcloud-sync`（public）③ **版本号与产物口径沿用 v2.1，不重复改写**：`manifest.json` / `package.json` / `package-lock.json`（root `version` 与 `packages[""]` `version` 各一处）/ `versions.json` / PRD §4.3 **五处一致为 `0.0.6`**，`versions.json` **6 条**（含 `"0.0.6": "0.13.21"`），`main.js` md5 `87fa862dc9abb869ecab1ba7eba4e2ab` / **1,038,403 字节**（`01b238d`），品牌计数 大写 `\u805A` = **28** / `juiyun sync` = **14**（统计口径为大写 Unicode 转义形式），新产物 `MemberExpression.isMobileApp` 命中 **0**，`npm test` → **142 passing / 0 failing**、`npx tsc -noEmit -skipLibCheck` → **exit 0** ④ **⛔ 真机验收类 ⛔ 一律保留**（AC37 ⑦ 桌面端 / 移动端 ribbon tooltip 两态、Step 70 / Step 71、AC22 / AC23 / AC33、AC34 ⑥ 移动端真机逐项肉眼核对）—— 线上 Release `0.0.6` 的 notes 已如实声明该项不在本次发布范围，**不得因 Release 已发布而标为通过** ⑤ 编号未新增：AC1–AC37 / R1–R21 / Step 1–86 全部保持不变</u> |

> <u>v1.2 升级需求待定：本次仅完成基线收口与版本推进，未新增功能项。需求明确后按版本迭代 SOP 继续叠加，新增内容同样用下划线标注。</u>

> <u>本版仅覆盖 A/B/C 范围；D 功能类需求待老板明确后另起版本叠加。</u>

> <u>v1.3 补充说明：本次新增条目一律用下划线标注；§1–§9 中描述 v1.0/v1.1/v1.2 已完成工作的历史内容原样保留，不做全局版本号替换。</u>

> <u>**v1.4 新增内容导航（便于快速复核）**：</u>
>
> - <u>**§5.4 `.obsidian` 配置目录同步（实验性）`** —— 新增独立章节，含 5.4.1 开关与位置 / 5.4.2 同步范围 / 5.4.3 排除清单 / 5.4.4 三个必知坑 / 5.4.5 使用前提</u>
> - <u>**§6 Phase 8** —— 新增 Step 82「补齐 `workspace-mobile.json` 排除」</u>
> - <u>**§7** —— 新增「v1.4 排期」小表（M12）</u>
> - <u>**§8** —— 新增 R17「配置目录同步为全量不可调」（等级：高）</u>
> - <u>**§9** —— 新增 AC33「配置目录同步（实验性）验收」</u>
>
> <u>**v1.4 补充说明**：本版仅新增内容与 §9 AC32 的一处范围修订（59–81 → 59–82），未改动 §1–§9 的既有章节结构、编号与 AC 编号（AC1–AC32 保持不变）。新增条目一律用下划线标注。</u>

> <u>**v1.7 补充说明**：本版仅回填老板已决策的发版事实（0.0.3），**未新增任何功能条目、未改动 §1–§9 的既有章节结构、编号与 AC 编号**（AC1–AC33 保持不变）。0.0.2 为开发基线口径、0.0.3 为发布版本号，两者并存的原因已在 §4.3 与 AC14 注释中说明。M10（发布）执行由全栈工程师 fse 承担，PM 负责副本同步。</u>

> <u>**v1.8 公开发布口径**：
> - 发布仓库：`https://github.com/studynt47/cstcloud-sync`（**public**，GitHub 个人账号 `studynt47`）。归属该账号而非 `CstCloud`，原因是 `CstCloud` 为另一独立账号且无授权凭证，原写入的 `cstcloud/cstcloud-sync` 仓库实测 404。
> - 公开范围：仅产品本体（`manifest.json` / `main.js` / `versions.json` / `README`×2 / `LICENSE` / `GUIDE_config-dir-sync.md` / `src/` / `tests/` / `assets/` / `docs/` / 构建配置）。**内部规划文档（PRD、本交付报告、`tech_v1.md`、`decomp_*`、`prd_review_*`、`_pm_survey_*`、`AGENTS.md`）与分发包 zip 不进入公开仓库**，仅保留在本机与交付副本目录。
> - 凭证处理：GitHub PAT 仅存放于 `/home/WPS/config/GitHub`，**不入库、不写入任何仓库文件**；建议老板在 GitHub 侧轮换该 PAT（本轮已用于推送）。
> - License：Apache-2.0，保留上游 fyears 署名与致谢（`LICENSE` / `README` 已含）。</u>

> <u>**v1.9 补充说明**：本版为**文档版本推进 + 已上线事实回填**，**未新增任何功能条目**，未改动 §1–§9 的既有章节结构与编号，AC1–AC33 编号与判据文字原样保留（仅在必要处加 v1.9 变更注）。新增编号自 **AC34** 起续编，风险新增 **R18 / R19**。</u>
>
> <u>**v1.9 本轮记录的两轮（均已实施、已上线、已实测）**：</u>
>
> | <u>轮次</u> | <u>产品版本</u> | <u>性质</u> | <u>一句话结论</u> | <u>本地 commit</u> | <u>线上</u> |
> |---|---|---|---|---|---|
> | <u>第一轮</u> | <u>v0.0.4</u> | <u>缺陷修复</u> | <u>移动端从 GitHub 安装后设置里看不到「同步配置文件夹」开关 —— 根因是移植时 `if (!Platform.isMobileApp)` 块的大括号错位，把整个高级设置区（`advDiv`）圈进了移动端禁用范围；已收回到 376→389 行（14 行），9 项设置在移动端恢复可见</u> | <u>`92d3b4b`（源码）/ `59e6952`（版本号）/ `54eccf0`（重建 main.js）</u> | <u>commit `72f0716d2a930e8d08d75d363182844060808549`，tag `0.0.4`</u> |
> | <u>第二轮</u> | <u>v0.0.5</u> | <u>品牌口径统一 + 链接修复</u> | <u>执行主体口径统一为「聚沄同步 / juiyun sync」，ribbon tooltip 与设置页标题改走 i18n（新增 2 个 key），并修掉 i18n 中 6 处指向 404 仓库的链接</u> | <u>`35aed42`（源码+文案）/ `978d020`（版本号）/ `55ab530`（重建 main.js）</u> | <u>commit `f0a460cd3a9c8499b56185cda2e523761c4f730d`，tag `0.0.5`</u>
>
> <u>**v1.9 已上线事实（供 §7.1 / §9 引用）**：</u>
>
> - <u>线上仓库 `https://github.com/studynt47/cstcloud-sync`（public，Apache-2.0），线上最新 commit `f0a460cd3a9c8499b56185cda2e523761c4f730d`，tree `7a93ea0f582348bea1c8e83d3fc13ef204135375`</u>
> - <u>线上 **208 个文件**，208/208 blob SHA 与本地逐个全等（字节级一致）；83 个 LFS 实体（`assets/` 11 + `docs/` 70 + `tests/` 2）已补齐，sha256 83/83 通过</u>
> - <u>线上 tag：`0.0.3` / `0.0.4` / `0.0.5`；Release `0.0.5` assets = `manifest.json`(301 B) / `main.js`(1,043,853 B) / `cstcloud-sync0.0.5.zip`(312,048 B)</u>
> - <u>线上历史保持干净 root 血统（3 个 commit），**不含任何内部文档**</u>
> - <u>当前分发包：`cstcloud-sync0.0.5.zip` **312,048 字节** / md5 `3460177d84f8cafbd56d7c4a7462f969`（目录层级 `cstcloud-sync/`，含 `main.js` / `manifest.json` / `versions.json` / `README.md` / `README.zh-cn.md` / `LICENSE` 共 6 个文件）</u>
> - <u>【v2.1 补充说明：**当前分发包仍为 `cstcloud-sync0.0.5.zip`**（312,048 字节 / md5 `3460177d84f8cafbd56d7c4a7462f969`，已上线）；**v0.0.6 分发包 `cstcloud-sync0.0.6.zip` 尚未产出** —— 其字节数 / md5 **不存在**，不得填写预测值；线上 **v0.0.6 Release 未发布**。全文不得出现「v0.0.6 已发布 / 已上线 / 已交付」的表述，「已发布 / 已上线」仅指 0.0.5 及更早】</u> <u>【v2.2 补充说明：**当前分发包已更新为 `cstcloud-sync0.0.6.zip`** —— **310,804 字节** / md5 `122b6c075f6498e237c5779153a58b36`，已上线为 Release `https://github.com/studynt47/cstcloud-sync/releases/tag/0.0.6`（tag `0.0.6`）；目录层级 `cstcloud-sync/`，含 `main.js`(1,038,403 B) / `manifest.json`(301 B) / `versions.json`(136 B) / `README.md`(6,311 B) / `README.zh-cn.md`(5,743 B) / `LICENSE`(12,266 B) 共 **6 个文件**。v0.0.5 的分发包事实（`cstcloud-sync0.0.5.zip` / 312,048 字节 / md5 `3460177d84f8cafbd56d7c4a7462f969`）作为**历史沿革原样保留**，不再作为「当前分发包」口径】</u>
>
> <u>**v1.9 仍待老板本人实测的三项 ⛔（保持未完成状态，不得标为通过）**：Step 70（B2 真实 S3 连通，需真实 cstcloud.cn 桶 + 密钥）/ Step 71（B3 双向同步 E2E，需桌面端 + 移动端双端真实对拉）/ AC33（`.obsidian` 清单 dry-run，需真实桶 + 开启「同步配置文件夹」；**v0.0.4 修复后移动端该开关已可见，实测条件已具备**）。</u>

> <u>**v2.0 补充说明**：本版为 **B 类 12 项决策落定 + 发布版本号推进（0.0.5 → 0.0.6）** 的收口版；新增编号 **AC36 / AC37**（§9）、**R20 / R21**（§8）、**Step 85 / 86**（§6）。既有 **AC1–AC35 / R1–R19 / Step 1–84** 的编号与判据文字原样保留，新增与修改内容一律用下划线标注。</u>
>
> <u>**v2.0 批次与 commit 对应**：批次 A（零行为风险的文案、日志与死字段清理）`9e71b14` / 批次 B（删除「保存后同步」整条死链）`b55449e` / 批次 C（用户可见文案接入 i18n）`0f4f96e` / 批次 D（D1：移除状态栏开关与「删除到哪」下拉）`c97a7ca` —— **源码均已提交并复核通过**。</u>
>
> <u>**v2.1 补充说明**：本版为 **纯实测回填版**，**未新增任何功能条目、未改动 §1–§9 的章节结构与编号**（AC1–AC37 / R1–R21 / Step 1–86 全部保持不变），仅把 v2.0 中因「版本号推进与 `main.js` 重建尚未执行」而标 ⛔ 的**产物类判据**替换为实测结论；**真机验收类 ⛔ 与 v0.0.6 分发包 ⛔ 一律保留**。</u>
>
> <u>**v2.1 批次与 commit 对应**：批次 6（版本号推进 0.0.5 → 0.0.6，`manifest.json` / `package.json` / `package-lock.json` / `versions.json`）`4b8d6f6` / 批次 7（`main.js` 重建，`npm run build2`）`01b238d` —— **均已提交**；批次 A–D（源码改造）沿用 v2.0 记录。</u>
>
> <u>**v2.0 ⛔ 待回填清单**（一律不得写成已通过）：① 版本号推进 0.0.5 → 0.0.6（`manifest.json` / `package.json` / `versions.json` / PRD §4.3 四处）② `main.js` 重建（**重建前** md5 `26105bde8e16815ead12167f12afa42c`）③ 重建后产物内品牌计数（`\u805A` 预计 **28** / `juiyun sync` 预计 **14** —— **预测值、尚未实测**）④ AC37 真机项 ⑤⑥⑦ ⑤ 既有 ⛔ 项 Step 70 / Step 71 / AC22 / AC23 / AC33 **保持未完成状态**。</u>
>
> <u>**v2.1 ⛔ 待回填清单（对上方 v2.0 清单逐项更新）**：① 版本号推进 0.0.5 → 0.0.6 —— ✅ **已完成**（`4b8d6f6`）：`manifest.json` / `package.json` / `package-lock.json`（root 与 `packages[""]` 各一处）/ `versions.json` **四处一致为 `0.0.6`**，`versions.json` **6 条**（含 `"0.0.6": "0.13.21"`），`package-lock.json` 中 `"0.0.5"` 命中 **0** ② `main.js` 重建 —— ✅ **已完成**（`01b238d`）：重建后 md5 `87fa862dc9abb869ecab1ba7eba4e2ab` / **1,038,403 字节**（重建前 md5 `26105bde8e16815ead12167f12afa42c` / 1,043,812 字节，字节差 **−5,409**；重建前值仅为**沿革**，**非**重建后口径）③ 重建后产物内品牌计数 —— ✅ **已实测**：大写 `\u805A` = **28** / `juiyun sync` = **14**，与 v2.0 预测值**完全一致（差值 0）**；统计口径为**大写** `\uXXXX` 转义形式（esbuild 将 JSON 内联为 ASCII 转义，UTF-8 直写「聚沄同步」命中恒为 **0**、小写 `\u805a` 命中恒为 **0**，直接 grep 中文字符会误判为「文案没进产物」）④ AC37 ⑤⑥ —— ✅ **已实测通过**；⛔ **AC37 ⑦ 桌面端 / 移动端 ribbon tooltip 两态真机仍无实测依据，保持未完成** ⑤ 既有 ⛔ 项 Step 70 / Step 71 / AC22 / AC23 / AC33 —— ⛔ **保持未完成状态** ⑥ ⛔ 分发包 `cstcloud-sync0.0.6.zip` **尚未产出**、线上 Release **未发布** ⑦ ⛔ v1.9 遗留三项 ⛔（Step 70 / Step 71 / AC33）**原样不动**。</u>
>
> <u>**v2.2 变更注（对上方 v2.1 ⛔ 待回填清单的更新）**：⑥ ⛔ 分发包 `cstcloud-sync0.0.6.zip` **尚未产出**、线上 Release **未发布** —— ✅ **已完成**（2026-11-15 实测复核）：分发包 `cstcloud-sync0.0.6.zip` **310,804 字节** / md5 `122b6c075f6498e237c5779153a58b36`，目录层级 `cstcloud-sync/`，含 `main.js`(1,038,403 B) / `manifest.json`(301 B) / `versions.json`(136 B) / `README.md`(6,311 B) / `README.zh-cn.md`(5,743 B) / `LICENSE`(12,266 B) 共 **6 个文件**，**§7.1 交付物形态判据 11/11 通过**；线上 Release `https://github.com/studynt47/cstcloud-sync/releases/tag/0.0.6`（tag `0.0.6` → commit `70bedbeb34ede0b10da961aa1b072f6ee70ba186`，draft=false、prerelease=false）已发布。上方 v2.1 清单原文**原样保留不改**。⛔ **AC37 ⑦ 桌面端 / 移动端 ribbon tooltip 两态真机** 与 ⛔ **Step 70 / Step 71 / AC22 / AC23 / AC33 / AC34 ⑥** 一律**保持未完成状态** —— 线上 Release `0.0.6` 的 notes 已如实声明真机验收项不在本次发布范围，**不得因 Release 已发布而标为通过**。</u>

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
- <u>端到端加密（后端代码已随 v1.3 移除）</u>
- 导入/导出设置（QR / URI）
- 导出同步计划
- 性能分析 profiler UI
- 调试日志级别修改
- 保存时自动触发同步（syncOnSave） <u>【v0.0.6 变更注】相关死代码已整条清除</u>
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
| P0-11 | 状态栏显示上次同步时间 | `main.ts:1180-1210`, `main.ts:1925-2031` | 30 秒轮询更新 <u>【v0.0.6 变更注】状态栏**恒显示**（`enableStatusBarInfo` 由 `loadSettings()` 强制为 `true`，用户不可关闭）</u> |
| P0-12 | 数据持久化（data.json 读写） | `src/configPersist.ts` + `main.ts:1338-1512` | 含加密混淆存储 |
| P0-13 | 强制 `serviceType="s3"` | `main.ts:129`, `baseTypes.ts:30-42` | 启动时强制覆盖旧配置 |
| P0-14 | 强制 `syncOnSaveAfterMilliseconds=-1` | `main.ts:loadSettings()` | 兼容旧配置 <u>【v0.0.6 变更注】保存后同步的**消费链已整条删除**（见 §8 R2），本项强制覆盖保留为**防旧配置复活的闸门**</u> |

### 3.2 P1 保留可配置（提供 UI 入口）

| # | 功能 | Setting ID | 代码位置 |
|---|---|---|---|
| P1-1 | 分块并行度（partsConcurrency） | `settings_s3_parts` | `settings.ts:1015-1034` |
| P1-2 | 自动运行间隔（autoRunEveryMilliseconds） | `settings_autorun` | `settings.ts:2088-2124` |
| P1-3 | 启动后自动运行（initRunAfterMilliseconds） | `settings_runoncestartup` | `settings.ts:2126-2150` |
| P1-4 | 跳过大文件（skipSizeLargerThan） | `settings_skiplargefiles` | `settings.ts:2175-2189` |
| <u>P1-5</u> | <u>**已删除（v0.0.6 · D1）**</u> 状态栏显示开关（enableStatusBarInfo） | <u>—（Setting 与 3 个 i18n 键已删除）</u> | <u>状态栏恒显示，由 loadSettings() 强制 enableStatusBarInfo=true</u> <u>【v0.0.6 变更注：原行代码位置快照为 `settings.ts:2193-2204`、Setting ID 为 `settings_enablestatusbar_info`，本行整体改写为 v0.0.6 口径，历史内容原样保留于本注】</u> |
| <u>P1-6</u> | <u>重设状态栏时间记录</u> | <u>`settings_resetstatusbar_time`</u> | <u>`settings.ts:2206-2227`（v1.3 复核：该 Setting ID 在 src/settings.ts 中已不存在，v1.0 大删时随调试区块一并移除 → 标记为已删除）</u> |
| P1-7 | 并行度（concurrency） | `settings_concurrency` | `settings.ts:2279-2298` |
| P1-8 | 同步下划线文件（syncUnderscoreItems） | `settings_syncunderscore` | `settings.ts:2300-2314` |
| P1-9 | 同步配置文件夹（syncConfigDir） | `settings_configdir` | `settings.ts:2316-2347` |
| P1-10 | 同步书签（syncBookmarks） | `settings_bookmarks` | `settings.ts:2349-2368` |
| <u>P1-11</u> | <u>**已删除（v0.0.6 · D1）**</u> 删除到系统回收站/Obsidian .trash | <u>—（Setting 与 4 个 i18n 键已删除）</u> | <u>删除目标恒为系统回收站，由 loadSettings() 强制 deleteToWhere="system"</u> <u>【v0.0.6 变更注：原行代码位置快照为 `settings.ts:2370-2385`、Setting ID 为 `settings_deletetowhere`，本行整体改写为 v0.0.6 口径，历史内容原样保留于本注】</u> |
| P1-12 | 保护修改百分比（protectModifyPercentage） | `settings_protectmodifypercentage` | `settings.ts:2428-2498` |
| <u>P1-13</u> | <u>删除同步计划历史</u> | <u>`settings_delsyncplans`</u> | <u>`settings.ts:829-835`（<u>v1.1 删除</u>）</u> |
| <u>P1-14</u> | <u>删除上次同步明细</u> | <u>`settings_delprevsync`</u> | <u>`settings.ts:840-849`（<u>v1.1 删除</u>）</u> |

<u>v1.3 与 C 类的对应关系说明：</u>

- <u>**C 类不删除本表任何 P1 项**。P1-1 ~ P1-5、P1-7 ~ P1-12 共 11 项在 v1.3 全部保留，其 Setting ID 与 UI 均不受 A/B/C 三类改动影响。</u> <u>【v0.0.6 变更注】D1 决策后，P1-5 与 P1-11 已删除，本表保留项由 11 项减为 **9 项**（P1-1~P1-4 / P1-7~P1-10 / P1-12）</u>
- <u>P1-13 / P1-14 维持 v1.1 的"已删除"状态（对应 `debugMode.ts` 与调试区块，C 类无后续动作）。</u>
- <u>P1-6 经 v1.3 实施前源码复核：Setting ID `settings_resetstatusbar_time` 在 `src/settings.ts` 中已不存在，判定为 v1.0 大删时误删而非本版删除，标注为"已删除"。</u>
- <u>本表"代码位置"列为 v1.0/v1.1 时期的行号快照；C 类删除 `src/profiler.ts` 与加密后端后会引起 `src/settings.ts` 行号漂移，<u>实施后须回填真实行号</u>，行号本身不作为验收判据。</u>
- <u>**v1.4 追加**：P1-9（同步配置文件夹 / `syncConfigDir`）在 v1.4 单独成节，见 **§5.4 `.obsidian` 配置目录同步（实验性）`**。v1.4 实测真实实现位置为 `src/settings.ts:436-457`（原快照行号已失效），默认关闭（`src/main.ts:58`）。该功能**代码零改动**，本节仅补文档与使用指引。</u>
- <u>**v1.9 追加**：v0.0.2 移植时误把 P1-7 ~ P1-12 与 P0-7 / P0-8 共 **9 项**圈进 `if (!Platform.isMobileApp)` 块，导致移动端**不可见**；v0.0.4 修复后这 9 项**恢复可见**：同步配置文件夹（P1-9 / `settings_configdir`）/ 同步书签（P1-10）/ 并发数（P1-7）/ 同步下划线文件（P1-8）/ 删除到哪（P1-11）/ 冲突处理（P0-8）/ 保护修改百分比（P1-12）/ 保护修改百分比(自定义)（P1-12 联动）/ 同步方向（P0-7）。**移动端仅 P1-5（`settings_enablestatusbar_info`，自定义状态栏项）保持禁用**，与 upstream 设计一致。详见 §9 AC34 与 §8 R18。</u> <u>【v0.0.6 变更注】P1-5 已随 D1 删除，移动端不再存在「仅此一项禁用」的情形；`if (!Platform.isMobileApp)` 守卫块在 `src/settings.ts` 中**整体消失**，桌面端与移动端设置项完全一致。</u>

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

<u>v1.3 追加（C1 联动）：NI-6 / NI-7 / NI-20 此前仅删除端到端加密的 **UI 与设置字段**，`src/fsEncrypt.ts` / `src/encryptOpenSSL.ts` / `src/encryptRClone.ts` / `src/encryptRClone.worker.ts` 后端实现仍在。v1.3 的 C1 进一步移除加密后端，使端到端加密能力整体退出本插件，对应 §2.3 新增非场景条目、§5.1.C 新增删除行、§6 Phase 7、§8 风险 R11、§9 验收 AC23。</u>

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
| <u>`@fyears/rclone-crypt`</u> | <u>加密（后端保留）→ v1.3 C1 实施后移入 §4.2 删除依赖</u> |
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
| <u>`@fyears/rclone-crypt`</u> | <u>v1.3 C1 删除 `src/encryptRClone.ts` 后失去唯一调用方，随之移除</u> |
| <u>`esbuild-plugin-inline-worker`</u> | <u>devDep，v1.3 C1 删除 `src/encryptRClone.worker.ts` 后无 worker 需要内联，可移除（须同步删 `esbuild.config.mjs` 的 `plugins: [inlineWorkerPlugin()]`）</u> |
| <u>`worker-loader`</u> | <u>devDep，仅服务 `webpack.config.js` 的 worker 打包，v1.3 C1 后无 worker 可打包，可移除</u> |

### 4.3 manifest.json 改造

| 字段 | 上游值 | 改造后 |
|---|---|---|
| `id` | `remotely-save` | `cstcloud-sync` |
| `name` | `Remotely Save` | `cstcloud-sync` |
| `version` | `0.5.25` | <u>`0.0.5`</u> <u>（发布版本号，老板 2026-10-28 书面指定；此前 0.0.2 为开发基线口径，已收口）</u> <u>【v1.9 变更注：原为 `0.0.3`（v1.7 发版口径），经 v0.0.4 / v0.0.5 两轮发版后更新为 `0.0.5`；现与 `manifest.json` / `package.json` / `versions.json` 四处一致】</u> <u>`0.0.6`</u> <u>（v0.0.6 发版口径；此前 0.0.5 为已上线版本）</u> <u>【v2.1 变更注：版本号推进**已执行**（commit `4b8d6f6`，2026-11-14 实测复核）—— `manifest.json` / `package.json` / `package-lock.json`（root `version` 与 `packages[""]` `version` 各一处）/ `versions.json` **四处一致为 `0.0.6`**；`versions.json` 共 **6 条**（`0.3.2` / `0.3.25` / `0.0.3` / `0.0.4` / `0.0.5` / `0.0.6`），新增 `"0.0.6": "0.13.21"`；`package-lock.json` 中 `"0.0.5"` 命中 **0**。`manifest.json` 红线字段 `id`(`cstcloud-sync`) / `name`(`cstcloud-sync`) / `description` / `author` / `authorUrl` / `minAppVersion`(0.13.21) / `isDesktopOnly` **逐字节未改**。⛔ **v0.0.6 分发包尚未产出、线上 Release 未发布**（见 §7 / §9 AC31）】【v2.2 变更注：该 ⛔ **已解除** —— 分发包 `cstcloud-sync0.0.6.zip` **已产出**（**310,804 字节** / md5 `122b6c075f6498e237c5779153a58b36`，目录层级 `cstcloud-sync/`，6 个文件），**§7.1 交付物形态判据 11/11 通过**；线上 Release `https://github.com/studynt47/cstcloud-sync/releases/tag/0.0.6`（tag `0.0.6` → commit `70bedbeb34ede0b10da961aa1b072f6ee70ba186`，draft=false、prerelease=false）已发布；发布版本号口径按已发布事实收口为 **0.0.6**。上方 v2.1 变更注原文**原样保留】</u> |
| `description` | `Yet another unofficial plugin...` | <u>`基于 cstcloud.cn 对象存储的 Obsidian 双向同步插件`</u> |
| `author` | `fyears` | <u>`cstcloud`</u> <u>（v1.3 A5 默认方案，author 字符串待老板最终确认）</u> |
| <u>`authorUrl`</u> | <u>`https://github.com/fyears`</u> | <u>`https://github.com/studynt47/cstcloud-sync`（v1.8 修正：v1.3 A5 原定的 cstcloud/cstcloud-sync 仓库不存在，实测 404；Obsidian 商店审核要求 authorUrl 为可访问的公开仓库地址）</u> |
| `fundingUrl` | `https://remotelysave.com` | **删除** |

<u>v1.3 A5 补充：manifest 的 `author` 改为 `cstcloud` **不构成对上游作者的除名**。Apache-2.0 §4(c) 要求保留声明，原作者 fyears 的署名与致谢统一落在 `README.md` / `README.zh-cn.md`（A4）与根 `LICENSE`（A9），manifest 只承载分发身份。</u>

### 4.4 esbuild.config.mjs 改造

- 删除 L17-33 所有 OAuth 环境变量（15 个 DEFAULT_*）
- 删除 L67-81 所有 `global.DEFAULT_*` define
- 保留 `es2016` target（L60）
- 保留 `entryPoints: ["./src/main.ts"]`（L43）

---

## 5. 架构设计

### 5.1 62 文件改造分类（<u>v1.3 C 类后：18 保留 + 1 新建 + 11 删除 + 32 pro/</u>）

#### A. 保留文件（<u>v1.3 C 类实施后为 18 个</u>）

> <u>v1.3 调整：原 A 类保留 23 个文件中，`src/profiler.ts`（C2）、`src/encryptOpenSSL.ts` / `src/encryptRClone.ts` / `src/encryptRClone.worker.ts` / `src/fsEncrypt.ts`（C1）共 5 个已移出 A 类，改列入 §5.1.C 删除文件表。剩余 A 类实际保留 18 个文件。</u>
>
> 含 2 个 v1.1 标记删除项（`importExport.ts` / `debugMode.ts`），见 §5.1.C

| 文件 | 改造说明 |
|---|---|
| `src/main.ts` | 改：删除 pro/src import / OAuth handler / cloud 初始化；硬编码 s3/info/true；保留 sync 核心 <u>；v1.3 C1 追加：删除 L26 / L163 / L393 / L412 的 FakeFsEncrypt 接线；v1.3 C2 追加：删除 L44 / L71 / L141-146 / L155 / L394 / L413 / L625-635 的 Profiler 接线</u> |
| `src/settings.ts` | 改：删除 80+ 云服务 Setting 区块（Dropbox/WebDAV/Webdis/OneDrive/PRO）；保留 S3 三字段 + <u>12 个 P1 Setting（v1.1 删除 P1-13/P1-14 调试功能）</u> |
| `src/fsS3.ts` | 保留（25KB）：DEFAULT_S3_CONFIG 改为 `s3Endpoint=s3.cstcloud.cn` / `region=us-east-1` / `forcePathStyle=true` |
| `src/fsAll.ts` | 保留：FakeFs 抽象基类 |
| `src/baseTypes.ts` | 改：删除 pro/src/baseTypesPro.ts import；<u>删除 `QRExportType` 类型（v1.1 随 importExport.ts 删除）</u>；保留 S3/Webdav/Dropbox/Onedrive 类型（兼容旧配置）<u>；v1.3 C1 追加：<u>勘察结论中的「清理 `password`/`encryptionMethod` @deprecated 字段」不成立——该两字段已随 v1.0 NI-7 删除，`src/baseTypes.ts` 中不存在</u>；实际残留的 @deprecated 项为 L36-42 `remotePrefix`/`useAccurateMTime`/`generateFolderObject`/`reverseProxyNoSignUrl`、L40 `bypassCorsLocally`、L92 `agreeToUploadExtraMetadata`、L97 `vaultRandomID`、L195 `FileOrFolderMixedState`，均为旧 data.json 兼容用（运行时忽略），仅做类型标注清理、不改运行时行为；v1.3 C2 追加：删除 L54 `ProfilerConfig` / L88 `profiler?` / L227 悬空 i18n 键</u> |
| `src/baseTypesObs.ts` | 保留 |
| `src/configPersist.ts` | 保留（加密配置读写） |
| `src/copyLogic.ts` | 保留（文件 diff/copy 核心）；需确认是否删除 `ignorePaths`/`onlyAllowPaths` 读取 |
| <u>`src/importExport.ts`</u> | <u>v1.1 删除（105 行）</u> |
| `src/i18n.ts` | 改：删除 `LANGS_PRO` merge（L5,8）；改为 `const LANGS = LANGS_BASIC` |
| `src/localdb.ts` | 保留（DB 操作）；<u>`SyncPlanType` 已确认（v1.0 Step 12 完成）：已删除 pro/src/sync import，`SyncPlanType` 在 `src/sync.ts:358` 重新 export</u> <u>；v1.3 C2 追加：删除 L22 `DEFAULT_TBL_PROFILER_RESULTS` / L65 字段 / L213 `createInstance` / L567-600 三个 profiler 结果读写函数（已建库中的 `profilerresults` 表成为孤儿表，不影响同步主流程）</u> |
| `src/metadataOnRemote.ts` | 保留 |
| `src/misc.ts` | 保留 |
| `src/obsFolderLister.ts` | 保留 |
| `src/syncAlgoV3Notice.ts` | 保留（删除 pro import） |
| `src/worker.d.ts` | 保留 |
| <u>`src/debugMode.ts`</u> | <u>v1.1 删除（95 行）</u> |
| `src/fsGetter.ts` | 改：switch 仅剩 s3 case + 12 case 全删（详见 Step 7） |
| `src/fsLocal.ts` | 保留：本地 vault 抽象（无改动） |
| `src/fsMock.ts` | 保留：测试 mock（无改动） |

#### B. 新建文件（1 个）

| 文件 | 说明 |
|---|---|
| `src/sync.ts` | **从 `pro/src/sync.ts` 提取核心逻辑**，替代 `main.ts` 中 `import { syncer } from "../pro/src/sync"` <u>；v1.3 C1 追加：解耦 FakeFsEncrypt 包装层（8 处签名/传参 + 7 处方法调用，须满足 §5.1.C 的 3 项行为等价性约束）；v1.3 C3 追加：清理 L54 / L65 / L76 / L87 四处 `serviceType === "dropbox"` 死分支</u> |

#### C. 删除文件（<u>v1.3 后为 11 个（v1.0/v1.1 6 个 + v1.3 C1/C2 新增 5 个）</u>）

| 文件 | 大小 |
|---|---|
| `src/fsOnedrive.ts` | 35KB |
| `src/fsWebdav.ts` | 28KB |
| `src/fsDropbox.ts` | 21KB |
| `src/fsWebdis.ts` | 8KB |
| <u>`src/importExport.ts`</u> | <u>105 行（v1.1 删除）</u> |
| <u>`src/debugMode.ts`</u> | <u>95 行（v1.1 删除）</u> |
| <u>`src/fsEncrypt.ts`</u> | <u>587 行（v1.3 C1 删除）</u> |
| <u>`src/encryptOpenSSL.ts`</u> | <u>186 行（v1.3 C1 删除）</u> |
| <u>`src/encryptRClone.ts`</u> | <u>257 行（v1.3 C1 删除）</u> |
| <u>`src/encryptRClone.worker.ts`</u> | <u>184 行（v1.3 C1 删除）</u> |
| <u>`src/profiler.ts`</u> | <u>153 行（v1.3 C2 删除）</u> |

<u>**v1.3 新增删除项的依赖清理点**（逐文件列出须连带修改的位置，缺一即编译失败）：</u>

| <u>删除文件</u> | <u>行数</u> | <u>连带清理点</u> |
|---|---|---|
| <u>`src/fsEncrypt.ts`</u> | <u>587</u> | <u>`src/sync.ts`：1 处 `import type { FakeFsEncrypt }`（L18）+ 8 处函数签名/传参（L367 / L1405 / L1717 / L1908）+ 7 处方法调用（L454 `encryptEntity`、L500 `encryptEntity`、L1569 `rm`、L1700 `rm`、L1953 `innerFs`、L1956 `isPasswordOk`、L1968 `walk`）需改为直连 `fsRemote`；`src/main.ts`：L26 import、L163 `new FakeFsEncrypt(fsRemote, "", "rclone-base64")`、L393 传给 `syncer()`、L412 `fsEncrypt.closeResources()`。<u>注意：`src/fsGetter.ts` 实际无 fsEncrypt 引用（勘察结论有误），无需改动。</u></u> |
| <u>`src/encryptOpenSSL.ts`</u> | <u>186</u> | <u>唯一调用方 `src/fsEncrypt.ts`（L2 / L40-46 / L453-454 / L521-522 / L537 / L568）；连带删除 `tests/encryptOpenSSL.test.ts`（163 行）</u> |
| <u>`src/encryptRClone.ts`</u> | <u>257</u> | <u>唯一调用方 `src/fsEncrypt.ts`（L3 / L77 / L96 / L408 / L460 / L484 / L505 / L554 / L570）；连带 `package.json` 移除运行时依赖 `@fyears/rclone-crypt`（§4.2）</u> |
| <u>`src/encryptRClone.worker.ts`</u> | <u>184</u> | <u>唯一调用方 `src/encryptRClone.ts`（L7）；连带 `esbuild.config.mjs` 移除 `inlineWorkerPlugin()` 插件与 `esbuild-plugin-inline-worker` devDep、`webpack.config.js` 移除 `worker-loader` 规则与 devDep</u> |
| <u>`src/profiler.ts`</u> | <u>153</u> | <u>`src/main.ts`：L44 import、L71 `DEFAULT_SETTINGS.profiler`、L141-146 构造、L155/L394 传参、L413 `clear()`、L625-635 `loadSettings()` 兼容块；`src/settings.ts`：L27 `import { DEFAULT_PROFILER_CONFIG }`；`src/sync.ts`：`import type { Profiler }`（L44）+ 61 处 `profiler?.insert(...)` 调用；`src/fsLocal.ts`：L7 import + 11 处 `this.profiler?.xxx(...)` 调用；`src/localdb.ts`：L22 `DEFAULT_TBL_PROFILER_RESULTS`、L65 字段、L213 `createInstance`、L567-600 三个 profiler 结果读写函数；`src/baseTypes.ts`：L54 `ProfilerConfig` 接口、L88 `profiler?` 字段、L227 i18n 键 `"profiler_results_exported_on_"`（该键在 3 个 langs 中已不存在，属悬空引用）</u> |

<u>**C1 行为等价性约束（实施时必须逐条核对）**：当前 `FakeFsEncrypt` 以空密码构造（`main.ts:163`），其行为等价于「直通 + 实体字段补齐」，因此解耦后必须保持 3 项等价性：</u>

- <u>① `walk()` 返回的每个 Entity 仍带 `keyEnc = keyRaw`、`sizeEnc = sizeRaw`（<u>原 `src/fsEncrypt.ts` 的 `copyEntityAndCopyKeyEncSizeEnc`，C1 已删除该文件，逻辑迁至 `src/encryptedGuard.ts`</u>）。`src/sync.ts` 有 <u>15 处</u>依赖 `keyEnc`/`sizeEnc` 做远端实体比对<u>（实测 15 处代码引用 + 5 处注释；解耦后逐行 diff 一致）</u>，解耦时须保留等价字段填充，不得直接改用 `fsRemote.walk()` 的裸实体。</u>
- <u>② `encryptEntity()` 在空密码分支等价于 `copyEntityAndCopyKeyEncSizeEnc()`，须以等价的本地函数替代，不得直接透传原始 Entity。</u>
- <u>③ `isPasswordOk()`（`sync.ts:1956`）是**远端已加密时的中止保护**：若远端存在 openssl 密文而本地无密码，当前实现会中止同步并抛出 `remote_encrypted_local_no_password`。<u>该保护不可随类一并删除</u>，须以等价的轻量守卫函数替代（扫描首个远端实体 keyRaw 的 openssl magic 前缀），否则将出现「把密文当明文拉取并覆盖本地」的损坏风险。</u>
- <u>回滚路径：`src/fsEncrypt.ts` 等 4 个文件可从 `_archive/upstream_v0.5.25/src/` 恢复；`src/sync.ts` 的解耦改动须以 C1 前的 git tag/branch（建议 `backup/pre-v1.3-C1`）为回滚点，`_archive/` 内无本 fork 的 `src/sync.ts`。</u>

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

### 5.4 `.obsidian` 配置目录同步（实验性）

<u>**v1.4 新增章节。** 本节内容为实测结论（源码逐行核对 + Obsidian 1.14.5 `app.asar` 实地查验），目的是把 `syncConfigDir` 开关开启后的**真实行为与风险**写清楚，避免使用者误判同步范围。**本插件代码零改动** —— 该开关是上游既有功能，本轮只补文档与使用指引。</u>

#### 5.4.1 开关与位置

| 项 | 值 |
|---|---|
| Setting ID | `settings_configdir` |
| UI 文案 | 「同步配置文件夹（实验性质）」 |
| UI 位置 | `设置 → 高级`（`src/settings.ts:392-397` 的 `advDiv` 区块） <u>【v1.9 更新：v0.0.4 修复 `if (!Platform.isMobileApp)` 块边界后，`advDiv` 实际起始行为 `src/settings.ts:394`】</u> |
| 控件形态 | 下拉（`disable` / `enable` 两项），非 checkbox |
| 实现位置 | `src/settings.ts:436-457` |
| 默认状态 | **关闭**（`src/main.ts:58` `syncConfigDir: false`） |
| 二次确认 | 有（3 个 i18n 键，见下表） |
| 弹窗类 | `SyncConfigDirModal`（`src/settings.ts:28-75`） |

<u>**二次确认弹窗**（`src/langs/en.json` / `zh_cn.json` / `zh_tw.json` 各 3 键）：</u>

| i18n 键 | 作用 |
|---|---|
| <u>`modal_syncconfig_attn`</u> | <u>选择 `enable` 后弹出的风险告知：「只同步（复制）整个 Obsidian 的配置文件夹」「各插件的设置或许会出错，且 Obsidian 或许需要重启来重载各插件的新配置」「如果您同意自行承受以上风险」</u> |
| <u>`modal_syncconfig_secondconfirm`</u> | <u>弹窗内的二次确认按钮（中文文案「再次确认开启」）。**只有点击该按钮**，下拉才真正切到 `enable`；点「返回」则维持 `disable`（`src/settings.ts:456-459` 的 `SyncConfigDirModal` 回调）</u> |
| <u>`modal_syncconfig_notice`</u> | <u>开启成功后的提示（中文文案「您已开启配置文件夹的同步！」，`src/settings.ts:63`）</u> |

<u>**代码零改动声明**：开关、二次确认弹窗、配置目录列举、排除逻辑均已存在于插件代码中且默认关闭，本节**不引入任何实现改动**。本轮唯一的代码改动是 Step 82（`workspace-mobile.json` 排除），且与本开关无耦合关系。</u>

#### 5.4.2 同步范围（实测结论：不是只同步插件目录）

<u>**结论先行**：开启 `syncConfigDir` 后，插件同步的是**整个 `.obsidian` 配置目录**，**不是**只同步 `.obsidian/plugins/` 下的插件目录。</u>

<u>**强制放行依据**：`src/sync.ts:207-233` 的 `isInsideObsFolder` 分支在 `syncConfigDir` 开启时对配置目录内路径一律置 `finalIsIgnored = false`（即「force sync everything」），不区分文件类型。</u>

| 层级 | 是否放行 | 说明 |
|---|---|---|
| <u>`.obsidian/` 顶层配置文件</u> | <u>全量放行</u> | <u>含 `app.json`、`appearance.json`、`core-plugins.json`、`community-plugins.json`、`hotkeys.json`、`bookmarks.json` 等</u> |
| <u>`.obsidian/plugins/<其他插件>/`</u> | <u>全量放行</u> | <u>其他插件目录**不做任何白名单过滤**，其全部子文件均进入同步清单</u> |
| <u>`.obsidian/plugins/cstcloud-sync/`</u> | <u>**非全量**，仅白名单 5 文件</u> | <u>仅 `data.json`、`main.js`、`manifest.json`、`.gitignore`、`styles.css` 放行</u> |
| <u>`.obsidian/plugins/cstcloud-sync/LICENSE`</u> | <u>排除</u> | <u>例：`LICENSE` 不在白名单 5 文件内，**不会**被同步</u> |
| <u>`.obsidian/workspace`、`.obsidian/workspace.json`</u> | <u>排除</u> | <u>配置目录专属排除（见 §5.4.3）</u> |
| <u>`.obsidian/workspace-mobile.json`</u> | <u>**当前未排除（缺陷）**</u> | <u>现有排除列表匹配不到 → 见 §6 Phase 8 Step 82</u> |

<u>**白名单依据**：`src/obsFolderLister.ts` 的 `isPluginDirItself`（:9-16）判定路径是否属于本插件目录，`isLikelyPluginSubFiles`（:18-32）给出上述 5 个白名单文件名。两者在 `listFilesInObsFolder`（:34 起，由 `src/fsLocal.ts:105` 调用，传入 `pluginID = this.manifest.id = "cstcloud-sync"`）中生效。</u>

<u>**`syncConfigDir` 与 `syncBookmarks` 的优先级**（`src/sync.ts:210-238` 的三分支）：`syncConfigDir` 开启时 `syncBookmarks` 分支不生效；`syncConfigDir` 关闭而 `syncBookmarks` 开启时，只同步 `bookmarks.json`（`isBookmarksFile`，`src/sync.ts:132-141`），配置目录其余内容被排除。</u>

#### 5.4.3 排除清单（14 项）

| # | 排除项 | 来源 |
|---|---|---|
| <u>1</u> | <u>`.git`</u> | <u>`src/misc.ts:445-480` `isSpecialFolderNameToSkip` 内置列表</u> |
| <u>2</u> | <u>`.github`</u> | <u>同上</u> |
| <u>3</u> | <u>`.gitlab`</u> | <u>同上</u> |
| <u>4</u> | <u>`.svn`</u> | <u>同上</u> |
| <u>5</u> | <u>`node_modules`</u> | <u>同上</u> |
| <u>6</u> | <u>`.DS_Store`</u> | <u>同上</u> |
| <u>7</u> | <u>`__MACOSX `</u> | <u>同上（含尾部空格）</u> |
| <u>8</u> | <u>`Icon\r`</u> | <u>同上（macOS 图标文件）</u> |
| <u>9</u> | <u>`desktop.ini`</u> | <u>同上</u> |
| <u>10</u> | <u>`Desktop.ini`</u> | <u>同上（大小写变体）</u> |
| <u>11</u> | <u>`thumbs.db`</u> | <u>同上</u> |
| <u>12</u> | <u>`Thumbs.db`</u> | <u>同上（大小写变体）</u> |
| <u>13</u> | <u>`workspace`</u> | <u>`src/obsFolderLister.ts:97-98` 与 `:109-110` 的 `isSpecialFolderNameToSkip(iter2, ["workspace", "workspace.json"])`（配置目录专属排除）</u> |
| <u>14</u> | <u>`workspace.json`</u> | <u>同上（桌面端布局文件）</u> |

<u>**匹配规则**（`src/misc.ts:463-472`）：`x === it`、`x === it + "/"`、`x.endsWith("/" + it)`、`x.endsWith("/" + it + "/")` 四种之一命中即排除。该规则为**精确名匹配**，不含通配与前缀匹配 —— 这正是 `workspace-mobile.json` 逃逸的原因（见 Step 82）。</u>

<u>**补充（非上述 14 项）**：`src/misc.ts:474-490` 另排除 Microsoft Office 临时文件（前缀 `~$`，后缀 `doc`/`docx`/`ppt`/`pptx`/`xls`/`xlsx`）；`src/sync.ts` 的 `isBookmarksFile` 逻辑在 `syncBookmarks` 开启时只同步 `bookmarks.json`（详见 §5.4.2 末段）。</u>

#### 5.4.4 三个必知坑

| # | 坑 | 后果 | 依据 |
|---|---|---|---|
| <u>坑 1</u> | <u>**其他插件的 `data.json` 会明文上传**</u> | <u>实测 `.obsidian/plugins/claudian-mobile-jy/data.json` 内含**明文 API Key**；开启后该等内容会直接进入 bucket。本插件目录的白名单机制**不保护其他插件目录**</u> | <u>`src/obsFolderLister.ts:18-32` 的白名单只约束本插件目录；其他插件目录全量放行（§5.4.2）</u> |
| <u>坑 2</u> | <u>**无法微调排除范围**</u> | <u>用户**没有任何手段**排除 `.obsidian` 内的单个文件 —— 想要排除某个其他插件的 `data.json` 也做不到</u> | <u>`src/main.ts:593-597` 已把 `ignorePaths` / `onlyAllowPaths` 从 settings 中 `delete` 掉（对应 §3.4 NI-9）</u> |
| <u>坑 3</u> | <u>**开启后需重启 Obsidian，且桌面端与移动端配置互相覆盖**</u> | <u>各插件配置可能出错、需重载；`workspace.json`（桌面端布局）与 `workspace-mobile.json`（移动端布局）互相覆盖 → 无意义同步 + 频繁冲突</u> | <u>`modal_syncconfig_attn` 告知文案；`src/sync.ts` 对 obs 目录的强制放行；`workspace-mobile.json` 当前未排除（Step 82）</u> |

#### 5.4.5 使用前提

1. <u>bucket 必须为**私有** + 开启**服务端加密**。本插件已无端到端加密能力（§2.3、§5.1.C 的 C1），`.obsidian` 内的明文内容会直接落到对象存储</u>
2. <u>先在**测试 vault** 开启，验证无误后再用于主 vault</u>
3. <u>开启前先**人工清点** `.obsidian` 内有无高敏凭据（重点是其他插件的 `data.json`，见坑 1）</u>
4. <u>明确告知使用者：这是**实验性**功能，**插件作者与维护者均不对其后果负责**</u>

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
| 22 | 删除 `settings.ts:2154-2173` syncOnSave Setting <u>【v0.0.6 变更注】v0.0.6 起 `src/main.ts` 侧的保存后同步实现亦已整条删除（§8 R2），本 Step 由「删 UI」升级为「删整链」</u> | `settings.ts` |
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
| 33 | 修改 `main.ts:loadSettings()`：新增 6 项强制覆盖（`s3.generateFolderObject=false` / `ignorePaths=[]` / `onlyAllowPaths=[]` / `enableStatusBarInfo=true` / `syncOnSaveAfterMilliseconds=-1` / `deleteToWhere="system"`，行 1410-1427）<u>【v0.0.6 变更注：其中 `ignorePaths` / `onlyAllowPaths` 已于 v1.x 改为 `delete` 语义；`syncOnSaveAfterMilliseconds` 的消费链已于 v0.0.6 整条删除，强制覆盖保留为防复活闸门；`enableStatusBarInfo=true` 与 `deleteToWhere="system"` 因 D1 决策**继续保留**（UI 已删除 → 能力恒定）】</u>。`serviceType="s3"` / `currLogLevel="info"` 已在 `main.ts:115-157` DEFAULT_SETTINGS 默认值（Step 31 范畴） | `main.ts:1338-1512` |
| 34 | 新建 `src/sync.ts`：从 `pro/src/sync.ts` 提取 syncer 主体；**同时新建 `src/conflictLogic.ts`（从 `pro/src/conflictLogic.ts` 提取 `isMergable / twoWayMerge / threeWayMerge / getFileRenameForDup` 4 个函数 + 依赖的 `MERGABLE_SIZE` 常量）+ 合并 `pro/src/localdb.ts` 4 个函数到 `src/localdb.ts`（upsertFileContentHistoryByVaultAndProfile / getFileContentHistoryByVaultAndProfile / clearFileContentHistoryByVaultAndProfile / clearAllFileContentHistoryByVault）+ 删除 `checkProRunnableAndFixInplace` 调用（cstcloud-sync 无 PRO）** | `src/sync.ts` + `src/conflictLogic.ts` + `src/localdb.ts` |
| 35 | 修改 `main.ts:65`：将 `import { syncer } from "../pro/src/sync"` 改为 `import { syncer } from "./sync"`（main.ts:488 是 `await syncer(...)` 调用，无需改） | `main.ts` |
| 36 | 修改 `fsGetter.ts`：switch 仅剩 s3 case，default 抛出 `cstcloud-sync only supports S3` | `fsGetter.ts` |
| 37 | 修改 `importExport.ts`：exportQrCodeUri 仅支持 basic_and_advanced<u>（v1.0 阶段）</u> | <u>v1.1 修订后被 Step 48~54 系列覆盖，不需单独执行</u> |
| 38 | 修改 `i18n.ts`：删除 LANGS_PRO merge | `i18n.ts` |
| 39 | 改造 `langs/en.json` + `zh_cn.json` + `zh_tw.json`：删除 ~194 个 PRO/cloud i18n key（13 类前缀：dropbox 36 / onedrive 34 / pro 27 / webdav 24 / syncplans 16 / webdis 14 / password 12 / remoteprefix 9 / remotebasedir 8 / encrypt 6 / chooseService 3 / export_ 3 / box 2） | `src/langs/*.json` |
| 40 | 改造 `main.ts:1171-1175`：aria-label 可改为"同步" <u>【v1.9 变更注：v0.0.5 已落地 —— `src/main.ts:462` 由硬编码中文 `同步` 改为 `t("ribbon_sync_tooltip")`。原硬编码属上游文案在移植时漏接 i18n，导致英文/繁体用户也看到中文】</u> | `main.ts` |
| 41 | 修改 `main.ts:1230-1292`：删除 4 个 export-sync-plans commands | `main.ts` |
| 42 | 修改 `settings.ts:968-987`：删除 S3 URL style dropdown，代码写死 forcePathStyle | `settings.ts` |
| 43 | 修改 `settings.ts:902-913` + `914-925`：删除 endpoint/region input，默认值改为 cstcloud.cn/us-east-1 | `settings.ts` |
| 44 | 修改 `main.ts:553`：删除 OAuth expire check（`checkIfOauthExpires()` 调用） | `main.ts` |

### Step Checklist（完整 47 步）<u>（v1.3 A6 复核：实际条目共 59 个，含 Step 1.5）</u>

<u>**v1.3 A6 复核结果：59 个条目中 <u>57 项</u>已完成（`[x]`），<u>2 项</u>未完成或被覆盖（`[ ]`，逐条注明原因）。复核依据为 2026-10-27 实跑校验（`tsc --noEmit`、`grep`、`git diff --numstat`），非依据 `delivery/DELIVERY_REPORT.md` 的自述结论。<u>（v1.6 复核：Step 22 经实测已完成，例外项由 3 项收敛为 2 项——Step 11 / 37）</u></u>

- [x] Step 1-5：Phase 1 文件删除（<u>其中 Step 1.5 <u>已于 Step 59 补做完成</u></u>）
- [x] Step 6-14：Phase 2 import/handler 删除（<u>其中 Step 11 被 Step 48~54 覆盖，见下方例外项</u>）
- [x] Step 15-27：Phase 3 settings.ts 大删（<u>其中 Step 22 <u>已完成</u>（`src/settings.ts` 中 `syncOnSave` 零命中，Setting 已删除，PM 实测）</u>）
- [x] Step 28-30：manifest / package.json / esbuild.config.mjs（<u>Step 28 的 description/author、Step 29 的 version 待 v1.3 A3/A5 处理</u>）
- [x] Step 31-33：硬编码 + backward compat
- [x] Step 34：新建 src/sync.ts
- [x] Step 35-39：import 修复 + i18n 改造（<u>其中 Step 37 被 Step 48~54 覆盖，见下方例外项；Step 39 主体完成，残留死键由 C5 清理</u>）
- [x] Step 40-44：UI 清理 + command 删除
- [x] <u>Step 45：修改 `src/langs/en.json:191-196` 弹窗 6 个 i18n key（新文案：cstcloud-sync 同步算法说明口径、复选框 2 改为"我理解仅支持 S3 协议 + 默认端点 cstcloud.cn"、GitHub 链接占位 `https://github.com/cstcloud/cstcloud-sync`）</u> <u>【v1.9 变更注：v0.0.5 已把 `syncalgov3_texts` 中的 2 处 GitHub 链接由 `https://github.com/cstcloud/cstcloud-sync` 改为 `https://github.com/studynt47/cstcloud-sync`（前者实测 HTTP 404，后者 HTTP 200）；锚文本未动。本条历史判据文字保留不改】</u>
- [x] <u>Step 46：修改 `src/langs/zh_cn.json:191-196` 同上 6 个 key</u> <u>【v1.9 变更注：同 Step 45，v0.0.5 已修 2 处 404 链接】</u>
- [x] <u>Step 47：修改 `src/langs/zh_tw.json:191-196` 同上 6 个 key</u> <u>【v1.9 变更注：同 Step 45，v0.0.5 已修 2 处 404 链接】</u>
- [x] <u>Step 48：删除 `src/importExport.ts`（105 行）</u>
- [x] <u>Step 49：删除 `src/settings.ts:25-29`（importExport import）</u>
- [x] <u>Step 50：删除 `src/settings.ts:108`（`exportQrCodeUri` 调用）</u>
- [x] <u>Step 51：删除 `src/settings.ts:737-820`（`importExportDiv` 区段 + `ExportSettingsQrCodeModal` 整类）</u>
- [x] <u>Step 52：删除 `src/settings.ts:782-783`（`parseUriByHand` / `importQrCodeUri` 调用）</u>
- [x] <u>Step 53：删除 3 langs 中 `settings_importexport` / `settings_export` / `settings_export_desc` / `settings_export_basic_and_advanced_button` / `settings_export_s3_button` / `settings_import` / `settings_import_desc` / `modal_qr_*` / `protocol_saveqr` 键</u>
- [x] <u>Step 54：删除 `baseTypes.ts:54` `QRExportType` 类型</u>
- [x] <u>Step 55：删除 `src/debugMode.ts`（95 行）</u>
- [x] <u>Step 56：删除 `src/settings.ts:30-34`（localdb import 中的 `clearAllSyncPlanRecords` / `clearAllPrevSyncRecordByVault`，`destroyDBs` 保留）</u>
- [x] <u>Step 57：删除 `src/settings.ts:825-855`（`debugDiv` 区段 + 2 个 Setting 块：`delsyncplans` + `delprevsync`）</u>
- [x] <u>Step 58：删除 3 langs 中 `settings_debug` / `settings_delsyncplans*3` / `settings_delprevsync*3` 键</u>

<u>**<u>2 项</u>未完成 / 被覆盖条目（v1.3 处置）**</u>

| <u>Step</u> | <u>状态</u> | <u>未完成原因</u> | <u>v1.3 处置</u> |
|---|---|---|---|
| <u>1.5</u> | <u>[x] 已完成</u> | <u>已于 Phase 5 Step 59（A1）补做：`tests/fsWebdis.test.ts` 已删除（`ls tests/fsWebdis.test.ts` → No such file），`tsc --noEmit` 0 error / `npm run build2` exit 0 / `npm test` 142 passing 已恢复</u> | <u>Phase 5 Step 59（A1）补做</u> |
| <u>11</u> | <u>[ ] 被覆盖</u> | <u>v1.0 阶段动作（删除 `importExport.ts` 内的 onedrive 收缩函数），该文件已在 Step 48 整体删除</u> | <u>无需执行，保留 `[ ]` 归档</u> |
| <u>22</u> | <u>[x] 已完成</u> | <u>删除 `settings.ts` 的 `syncOnSave` Setting <u>已执行</u>：<u>`src/settings.ts` 中 `syncOnSave` 零命中（`grep -n "syncOnSave" src/settings.ts` → 0 命中，PM 实测），该空壳 Setting 已随 Step 67（A8「设置页空壳元素清理」，commit `f376a9f`）一并删除</u>。<u>v1.5 及之前版本记为「未完成」，系 PRD 文本未回填，与实际实施状态不符</u>。§2.3 已将 syncOnSave 列为非场景，§3.1 P0-14 强制 `syncOnSaveAfterMilliseconds=-1`（该项属自动同步间隔定时器，是另一功能，勿与本 Step 混判）</u> <u>【v0.0.6 变更注】v0.0.6 起 `src/main.ts` 侧的保存后同步实现亦已整条删除（§8 R2），本 Step 由「删 UI」升级为「删整链」</u> | <u>Phase 5 Step 67（A8）已补做</u> |
| <u>37</u> | <u>[ ] 被覆盖</u> | <u>v1.0 阶段动作（限制 `exportQrCodeUri` 支持范围），该函数已随 Step 48 整体删除</u> | <u>无需执行，保留 `[ ]` 归档</u> |

<u>**另记（Step 20 局部残留）**：Step 20「删除 serviceType dropdown」已完成，但 `src/settings.ts:133-134` 的 `settings_chooseservice` 标题（"选择服务"）仍在渲染，dropdown 本身已不存在，属标题孤儿。<u>（v1.6 复核：该孤儿标题亦已随 Step 67（A8）删除——`grep -n "settings_chooseservice" src/settings.ts src/langs/*.json` → 0 命中，故 Step 20 无残留，AC19 成立）</u></u>

<u>**编号口径注（v1.6 新增）**：本 PRD §6 的 **Step 22** 指「删除 `settings.ts` 的 `syncOnSave` Setting」（见 §6 Phase 3 表与上方例外项表）。`delivery/DELIVERY_REPORT.md` §1 中的「Step 22：删除 s3 urlstyle dropdown」沿用 **v1.0 实施编号**，对应本 PRD §6 的 **Step 42**（`settings.ts:968-987`，删除 S3 URL style dropdown，写死 forcePathStyle），二者**不是同一项**，勿混判。</u>

### Phase 5：A 修复类（6 项 + 3 项实施前新增发现）

| Step | 动作 | 文件位置 | 完成判据 |
|---|---|---|---|
| 59 | <u>**（A1）**</u> 删除残留 Webdis 测试 | `tests/fsWebdis.test.ts`（12 行） | 文件不存在；`npx tsc --noEmit` 输出 0 error（消除唯一的 `TS2307`）；`npm run build2` 与 `npm test` 均可执行 |
| 60 | <u>**（A2-a）**</u> 统一文件权限位模式 | 仓库根：`git config core.fileMode false`；<u>（可选）</u> 对受影响文件 `chmod 644` 归位 | `git diff --numstat` 中不再出现 mode-only 条目；<u>注意：`core.fileMode=false` 是本地仓库配置、不随 commit 分发，若需对其他克隆生效须同时做 chmod 归位</u> |
| 61 | <u>**（A2-b）**</u> 产出干净基线 commit | 全仓（<u>须包含 PRD.md 的 v1.2 内容与本 v1.3 变更</u>） | `git log --oneline -1` 为基线 commit；`git status --porcelain` 输出为空；`git show --stat` 的内容差异与预期一致 |
| 62 | <u>**（A3）**</u> <u>统一开发基线产品版本号到 0.0.2</u> | `package.json`（`version`）、`manifest.json`（`version`）、本 PRD §4.3 | `grep '"version"' package.json manifest.json` 均为 `0.0.2`；§4.3 表 version 单元格为 `0.0.2`；<u>不出现 0.0.3</u>；<u>本步骤仅锁定开发基线口径；发布版本号在 Step 81 之后由老板统一指定（见 §9 AC32），本版不预设具体发布号</u> |
| 63 | <u>**（A4）**</u> README 品牌化改写 | `README.md`、`README.zh-cn.md` | 标题为 `cstcloud-sync`；<u>必须保留 Apache-2.0 归属说明与对 fyears（上游原作者）的致谢段落</u>；无上游 star 徽章 / 赞助链接 / 商店链接 / "Remotely Save" 标题 |
| 64 | <u>**（A5）**</u> manifest 身份统一 | `manifest.json` | `author` = `cstcloud`（<u>字符串待老板最终确认</u>）、`authorUrl` = `https://github.com/cstcloud/cstcloud-sync`、`description` 不含 "fork 自 remotely-save" | <u>【v1.8 修正】authorUrl 最终取值为 https://github.com/studynt47/cstcloud-sync（原 cstcloud/cstcloud-sync 仓库实测 404 不存在），其余判据不变</u> |
| 65 | <u>**（A6）**</u> 勾选 §6 历史 58 步 checklist | 本 PRD §6 | 59 个条目逐一勾选；未完成项同行注明原因（见上方例外项表） |
| 66 | <u>**（A7）**</u> 设置页 H1 品牌残留修复 | `src/settings.ts:126`（`containerEl.createEl("h1", { text: "Remotely Save" })`） | 设置页顶部标题显示 `cstcloud-sync`，不再显示 `Remotely Save` <u>【v1.9 变更注：v0.0.5 已改为走 i18n —— `src/settings.ts:125` 的 `createEl("h1", { text: "cstcloud-sync" })` 改为 `createEl("h1", { text: t("settings_plugin_title") })`，三语言分别显示 `juiyun sync` / `聚沄同步` / `聚沄同步`】</u> |
| 67 | <u>**（A8）**</u> 设置页空壳元素清理 | `src/settings.ts:133-134`（`settings_chooseservice` 孤儿标题）、`src/settings.ts:366-368`（`settings_synconsave` 空 Setting） | 设置页不再出现"选择服务"标题与"保存时自动同步"空标签；对应 i18n 键按 C5 一并清理 |
| 68 | <u>**（A9）**</u> 根 LICENSE 文本更新 | `LICENSE` | <u>删除已失效的 `pro/` → PolyForm Strict License 条款</u>（`pro/` 已于 v1.0 整体删除）；改为 Apache-2.0 + "本项目派生自 remotely-save v0.5.25（Copyright fyears）"声明 |

### Phase 6：B 质量类（5 项）

| Step | 动作 | 文件位置 | 完成判据 |
|---|---|---|---|
| 69 | <u>**（B1）**</u> E2E-1 Obsidian 桌面版加载测试 | 产物 `main.js` + `manifest.json` | manifest 校验通过（id / name / version / minAppVersion）；插件可启用且无报错；设置页可渲染（S3 三字段 + 12 个 P1）；ribbon 图标可见可点；命令面板出现 `start-sync` 与 `start-sync-dry-run` |
| 70 | <u>**（B2）**</u> E2E-2 S3 真实连通性测试 | 设置页「检查连接」按钮 → `src/fsS3.ts` `checkConnect()` | HeadBucket + ListObjectsV2 均返回成功；<u>**依赖老板提供 cstcloud.cn 的 AccessKey / SecretKey / Bucket，凭证未到位时本 Step 标记为「阻塞」，不得以 Mock / 假凭证冒充通过**</u> <u>【v1.9 状态：⛔ 仍待老板本人实测（未完成）。截至 v1.9（2026-10-28）凭证仍未到位，本 Step 维持「阻塞」】</u> |
| 71 | <u>**（B3）**</u> E2E-3 双向同步 E2E | 同步核心 `src/sync.ts` + `src/copyLogic.ts` | 4 条用例全部通过：① 本地新增 → 远端可见 ② 远端改动 → 本地拉取 ③ 删除双向同步 ④ 冲突处理策略按设置生效 <u>【v1.9 状态：⛔ 仍待老板本人实测（未完成）—— 需桌面端 + 移动端双端真实对拉。本 Step 与 Step 70 共享同一凭证阻塞，同批解除】</u> |
| 72 | <u>**（B4）**</u> 核心逻辑单测补齐 | 新增 `tests/sync.test.ts`、`tests/copyLogic.test.ts`、`tests/conflictLogic.test.ts` | `npm test` 全绿；`src/sync.ts` / `src/copyLogic.ts` / `src/conflictLogic.ts` <u>关键路径行覆盖率 ≥ 70%</u>（建议下限），<u>整体行覆盖率 ≥ 50%</u>；测试须覆盖 §5.1.C 的 3 项加密解耦行为等价性（若 C1 先于 B4 实施） |
| 73 | <u>**（B5）**</u> 打包产物自检 | `main.js` | grep 校验：`s3.cstcloud.cn` 存在；`dropbox` / `webdav` / `onedrive` / `pro/` / `qrcode` / `openssl` / `rclone` / `profiler` 计数为 0；`syncalgov3` 6 个 i18n 键存在；<u>注意 esbuild 默认 ascii 输出，`main.js` 内不含中文字面量，中文文案须在 `src/langs/zh_cn.json` / `zh_tw.json` 源文件中校验，不可对 `main.js` 直接 grep 中文</u> |

### Phase 7：C 瘦身类（5 项）

| Step | 动作 | 文件位置 | 完成判据 |
|---|---|---|---|
| 74 | <u>**（C1-a）**</u> 建立回滚点 | 仓库 | 先创建 tag/branch `backup/pre-v1.3-C1`，`git tag`/`git branch` 列表中可见；<u>`_archive/upstream_v0.5.25/src/` 可恢复 4 个加密文件，但无本 fork 的 `src/sync.ts`，故解耦改动的回滚必须依赖此 tag</u> |
| 75 | <u>**（C1-b）**</u> 删除加密后端 | `src/fsEncrypt.ts`(587)、`src/encryptOpenSSL.ts`(186)、`src/encryptRClone.ts`(257)、`src/encryptRClone.worker.ts`(184)、`tests/encryptOpenSSL.test.ts`(163) | 5 个文件全部不存在；`grep -rn "fsEncrypt\|encryptRClone\|encryptOpenSSL" src/ tests/` 为 0 |
| 76 | <u>**（C1-c）**</u> 解耦 `src/sync.ts` 的加密包装层 | `src/sync.ts`（8 处签名/传参 + 7 处方法调用） | 所有 `fsEncrypt` 引用消除；<u>满足 §5.1.C 的 3 项行为等价性</u>：① `walk()` 结果仍带 `keyEnc = keyRaw` / `sizeEnc = sizeRaw` ② `encryptEntity()` 以等价本地函数替代 ③ 远端 openssl 密文中止守卫保留（不得随类一并删除） |
| 77 | <u>**（C1-d）**</u> 清理 `main.ts` 接线与构建依赖 | `src/main.ts`(L26/163/393/412)、`package.json`（删运行时依赖 `@fyears/rclone-crypt`）、`esbuild.config.mjs`（删 `inlineWorkerPlugin()`）、`webpack.config.js`（删 worker-loader 规则） | `grep -rn "FakeFsEncrypt" src/` 为 0；`npm run build2` 通过；产物 `main.js` 中 `openssl` / `rclone` 计数为 0 |
| 78 | <u>**（C2）**</u> 删除 profiler | `src/profiler.ts`(153)、`src/main.ts`(7 处)、`src/settings.ts`(1 处)、`src/sync.ts`(62 处)、`src/fsLocal.ts`(12 处)、`src/localdb.ts`(4 处)、`src/baseTypes.ts`(3 处) | `grep -rn "profiler\|Profiler" src/` 为 0（含悬空 i18n 键 `"profiler_results_exported_on_"`）；`npm run build2` + `npm test` 通过；<u>已建库中的 `profilerresults` 表成为孤儿表，不影响同步主流程</u> |
| 79 | <u>**（C3）**</u> 清理 dropbox 死分支 | `src/sync.ts` L54 / L65 / L76 / L87 | 4 处 `serviceType === "s3" \|\| serviceType === "dropbox"` 条件删除，仅保留 `serviceType === "s3"`；`grep -c "dropbox" src/sync.ts` 为 0（L1381 的历史沿革注释可保留，不计入） |
| 80 | <u>**（C4）**</u> 清理 devDependencies 残留 | `package.json` `devDependencies` | <u>**删除**：`webdav-server`（已删 WebDAV 的测试服务器）、`openapi-typescript`、`npm-check-updates`、`@types/chai`、`@types/chai-as-promised`（<u>全部测试只用 node 内置 `assert`，无任何 chai 引用</u>）、`esbuild-plugin-inline-worker`（C1 后无 worker）、`worker-loader`（C1 后无 worker）。<u>**保留**：`dotenv`（`esbuild.config.mjs:1` 与 `webpack.config.js:1` 仍 `import`/`require`，属仍在使用的构建链依赖）、`jsdom` + `@types/jsdom`（`tests/misc.test.ts` 使用）、`mocha` / `tsx` / `typescript` / `esbuild` / `webpack` / `ts-loader` / `cross-env` / `builtin-modules` / `tslib` / `@types/*` 其余项</u>；`npm run build2` + `npm test` 仍通过 |
| 81 | <u>**（C5）**</u> 复核 i18n 键 | `src/langs/en.json`、`src/langs/zh_cn.json`、`src/langs/zh_tw.json` | 删除下表 <u>40 处</u>死键（<u>31 处可直接删 + 9 处须待 A8 后删</u>）；<u>3 个 langs 文件的键集合完全一致</u>（当前 en.json 189 键 / zh_cn.json 179 键 / zh_tw.json 179 键，差 10 键；<u>清理后各为 169 键</u>：en 189−20 / zh_cn 179−10 / zh_tw 179−10<u>；v1.6 补注：Step 81 完成时各为 169 键，Step 81 之后 AC19 收口（commit `31c7a30`）再清理 2 个孤儿键 `settings_synconsave_disable` / `settings_synconsave_enable`（源码 0 引用），现各为 <u>167 键</u>，三语言键集合仍完全一致</u> <u>【v1.9 变更注：v0.0.5 新增 2 个键 `ribbon_sync_tooltip` / `settings_plugin_title` → 167 + 2 = **169 键**，实测三语言各 169 键、键集合完全一致（上方「现各为 167 键」为 v1.6 时点的历史记录，不回改）】</u>）；`grep -rn "settings_remoteprefix_s3\|settings_remotebasedir\|settings_s3_reverse_proxy_no_sign_url\|settings_debuglevel\|settings_obfuscatesettingfile\|settings_outputsettingsconsole\|settings_viewconsolelog\|protocol_callbacknotsupported" src/langs/` 为 0 |

<u>**C5 死键清单（40 处 = 31 处可直接删 + 9 处条件删，实施前实测）**</u>

| <u>类别</u> | <u>键</u> | <u>处数</u> | <u>分布</u> | <u>依据</u> |
|---|---|---|---|---|
| <u>已删功能的空 Setting</u> | <u>`settings_remoteprefix_s3` / `_desc`</u> | <u>6</u> | <u>3 语言</u> | <u>NI-22 已删 Setting，`src/settings.ts` 中 0 引用</u> |
| <u>已删功能的空 Setting</u> | <u>`settings_remotebasedir` / `_desc`</u> | <u>6</u> | <u>3 语言</u> | <u>NI-23 已删 Setting，0 引用</u> |
| <u>已删功能的空 Setting</u> | <u>`settings_s3_reverse_proxy_no_sign_url` / `_desc`</u> | <u>6</u> | <u>3 语言</u> | <u>NI-23 已删 Setting，0 引用</u> |
| <u>已删的协议处理提示</u> | <u>`protocol_callbacknotsupported`</u> | <u>3</u> | <u>3 语言</u> | <u>OAuth callback handler 已删（Step 14），0 引用</u> |
| <u>已删功能的空 Setting</u> | <u>`settings_debuglevel` / `_desc`</u> | <u>2</u> | <u>仅 en.json</u> | <u>NI-13 已删 UI，0 引用</u> |
| <u>已删功能的空 Setting</u> | <u>`settings_obfuscatesettingfile` / `_desc`</u> | <u>2</u> | <u>仅 en.json</u> | <u>NI-14 已删 UI，0 引用</u> |
| <u>已删功能的空 Setting</u> | <u>`settings_outputsettingsconsole` / `_button` / `_desc` / `_notice`</u> | <u>4</u> | <u>仅 en.json</u> | <u>NI-15 已删 UI，0 引用</u> |
| <u>已删功能的空 Setting</u> | <u>`settings_viewconsolelog` / `_desc`</u> | <u>2</u> | <u>仅 en.json</u> | <u>NI-15 已删 UI，0 引用</u> |
| <u>条件删除（须先做 A8）</u> | <u>`settings_chooseservice` / `settings_synconsave` / `settings_synconsave_desc`</u> | <u>9</u> | <u>3 语言</u> | <u>当前仍被 `src/settings.ts:134` / `366-368` 渲染，<u>A8 删除对应 UI 后方可删除，否则 `t()` 取不到值、UI 渲染为 undefined</u></u> |

<u>**必须保留（易被误判为死键）**：`settings_protectmodifypercentage*`（10 个，P1-12 保留）、`syncrun_abort_protectmodifypercentage`（P1-12 联动）、`syncalgov3_checkbox_manual_backup` / `syncalgov3_checkbox_requiremultidevupdate`（v1.1 弹窗 6 键之一，AC9）、`settings_s3_prod` / `settings_s3_prod1` / `settings_s3_prod2` / `settings_s3_prod3`（<u>虽为 AWS 文档外链、在 cstcloud 定位下不适用，但当前仍在 `src/settings.ts:168-186` 渲染中，属"残留但仍使用"，本版不删，列为后续 D 类候选</u>）。</u>

### <u>Phase 8：v1.4 补充（1 项）</u>

<u>**排期**：Phase 7（C 瘦身类）之后、终验（§9 AC32 发版前置）之前。</u>

| Step | 动作 | 文件位置 | 完成判据 |
|---|---|---|---|
| 82 | <u>**（v1.4-1）** 补齐 `workspace-mobile.json` 排除</u> | <u>`src/obsFolderLister.ts`（两处数组各加 1 个字符串，**共 2 行**）</u> | <u>`grep -n "workspace-mobile.json" src/obsFolderLister.ts` 命中 **2 处**；`npm run build2` 成功；`npm test` 全绿</u> |

<u>**Step 82 背景（已实测）**：</u>

- <u>Obsidian 1.14.5 的 `app.asar` 中确认存在两个真实文件：`workspace.json`（桌面端布局）与 `workspace-mobile.json`（移动端布局）</u>
- <u>现有排除列表 `["workspace", "workspace.json"]`（`src/obsFolderLister.ts:97` 与 `:109`）**匹配不到** `workspace-mobile.json` —— 匹配条件为 `x === it`、`x === it + "/"`、`x.endsWith("/" + it)`、`x.endsWith("/" + it + "/")`，四种条件均不命中（精确名匹配，无通配、无前缀匹配）</u>

<u>**Step 82 后果**：移动端布局文件会被同步；且移动端每次启动/退出 Obsidian 都会改写该文件 → 无意义同步 + 频繁冲突。该问题在 `syncConfigDir` 开启时暴露（§5.4.4 坑 3）。</u>

<u>**Step 82 改动**：`src/obsFolderLister.ts` 两处 `isSpecialFolderNameToSkip(iter2, ["workspace", "workspace.json"])` 的数组各增加一个字符串 `"workspace-mobile.json"` → **2 行改动**，不改匹配逻辑、不改其他排除项。</u>

### <u>Phase 9：v0.0.4 / v0.0.5 两轮已实施回填</u>

<u>**说明**：本 Phase 为 **v1.9 事实回填**，记录**已实施、已上线、已实测**的两轮工作，**不新增任何功能条目**。编号自 Step 83 起续编，**§6 历史 checklist 的 59 个条目计数与例外项（Step 11 / 37）不受影响**（AC17 判据不动）。</u>

| Step | 动作 | 文件位置 | 完成判据 |
|---|---|---|---|
| 83 | <u>**（v0.0.4）** 修正 `if (!Platform.isMobileApp)` 块边界，恢复移动端高级设置区可见</u> | <u>`src/settings.ts`（原 376→654 行 / 279 行的 if 块，收回为 **376→389 行 / 14 行**，仅含 `settings_enablestatusbar_info`；`advDiv` 及下属 9 项移出）</u> | <u>① `npm test` **142 passing / 0 failing** ② `tsc --noEmit` **0 error** ③ `npm run build2` **exit 0** ④ 编译产物经 **AST 解析**确认移动端守卫区间由 **5,448 字符缩至 347 字符**（只含状态栏项），`settings_configdir` 位于守卫外 ⑤ `git diff -w` 验证**唯一非空白改动为大括号位置**，设置项内部逻辑一字未改 <u>【v0.0.6 变更注】因块内唯一项 P1-5 随 D1 删除，该守卫块在 `src/settings.ts` 中**已整体移除**，`Platform` import 同步删除；Step 83 的历史判据原样保留不改</u> |
| 84 | <u>**（v0.0.5）** 品牌口径统一「聚沄同步 / juiyun sync」+ 修 i18n 中 6 处 404 链接</u> | <u>`src/main.ts:462`（ribbon tooltip 改走 i18n）、`src/settings.ts:125`（设置页 H1 改走 i18n）、`src/langs/en.json` / `zh_cn.json` / `zh_tw.json`（各 +4 行 / −2 行，新增 2 个 key + 品牌字样统一 + 链接修正）</u> | <u>① `npm test` **142 passing / 0 failing** ② `npm run build2` **exit 0** ③ 三语言 json 各 **171 行 / 169 key / key 集合完全一致** ④ 旧 404 链接 **0 次**、新链接每文件 **2 次** ⑤ 产物 `main.js` 内「聚沄同步」**8 次**、「juiyun sync」**4 次**</u> |

<u>**Step 83 根因与对照证据（已实测）**：</u>

- <u>**现象**：老板在移动端从 GitHub 安装后，设置里看不到「同步配置文件夹」开关（实际被藏的是**整个高级设置区**）。</u>
- <u>**根因**：`src/settings.ts` 第 376 行的 `if (!Platform.isMobileApp)` 块**从状态栏项一直包到 `display()` 末尾（第 654 行，279 行）**，把整个高级设置区（`advDiv`）圈进了移动端禁用范围。</u>
- <u>**对照 upstream 证据**：`remotely-save/remotely-save@master/src/settings.ts` 同款 if 块**仅 36 行**（2192→2227），只含 2 个状态栏项（`settings_enablestatusbar_info` / `settings_resetstatusbar_time`），`advDiv` 在块外 → **本项目属移植时引入的括号错位缺陷，非 upstream 设计**。</u>
- <u>**引入点**：commit `4f383e6`（v0.0.2 首次移植，2026-10-17）在**同一个 commit 内**新增了 if 块并把 `advDiv` 整段放入。</u>
- <u>**被误伤的 10 项**：`settings_enablestatusbar_info` / `settings_concurrency` / `settings_syncunderscore` / **`settings_configdir`** / `settings_bookmarks` / `settings_deletetowhere` / `settings_conflictaction` / `settings_protectmodifypercentage` / `settings_protectmodifypercentage_customfield` / `setting_syncdirection`。</u>
- <u>**修复前可行性核查**：隐藏区内**无任何桌面专属 API 依赖**；`syncConfigDir` 在 `src/sync.ts` 为纯路径判断（`isInsideObsFolder` / `isBookmarksFile`），与平台无关 → **移动端技术上完全可用**；i18n key 齐全 → **不是 i18n 缺失、不是文案问题、不是平台不支持**。</u>
- <u>**移动端恢复可见的 9 项**：同步配置文件夹 / 同步书签 / 并发数 / 同步下划线文件 / 删除到哪 / 冲突处理 / 保护修改百分比 / 保护修改百分比(自定义) / 同步方向。</u>
- <u>**本地 commit**：`92d3b4b`（源码修复）/ `59e6952`（版本号）/ `54eccf0`（重建 main.js）。**线上**：commit `72f0716d2a930e8d08d75d363182844060808549`，tag `0.0.4`，Release `https://github.com/studynt47/cstcloud-sync/releases/tag/0.0.4`。</u>
- <u>**Step 83 说明段的 v0.0.6 变更注**：因块内唯一项 P1-5 随 D1 删除，该守卫块在 `src/settings.ts` 中**已整体移除**（`Platform` import 同步删除，`src/settings.ts` 中 `Platform` 引用为 **0**）；本说明段中「块内唯一项 P1-5」「376→389 行 14 行」等均为 **v0.0.4 历史事实**，原样保留不改。</u>

<u>**Step 84 改动明细（5 文件 / +17 −9）**：</u>

- <u>`src/main.ts:462`：`addRibbonIcon(iconNameSyncWait, `同步`, …)` → `t("ribbon_sync_tooltip")`（**原为硬编码中文，英文/繁体用户也看到中文** —— 属上游硬编码文案在移植时漏接 i18n）。</u>
- <u>`src/settings.ts:125`：`createEl("h1", { text: "cstcloud-sync" })` → `t("settings_plugin_title")`。</u>
- <u>三语言 json 各 +4 行 / −2 行。</u>

<u>**Step 84 新增 2 个 i18n key**（`en.json` 是 TS 类型源，`TransItemType = keyof LANGS["en"]`，漏加则编译期报错）：</u>

| <u>key</u> | <u>en</u> | <u>zh_cn</u> | <u>zh_tw</u> |
|---|---|---|---|
| <u>`ribbon_sync_tooltip`</u> | <u>`juiyun sync`</u> | <u>`聚沄同步`</u> | <u>`聚沄同步`</u> |
| <u>`settings_plugin_title`</u> | <u>`juiyun sync`</u> | <u>`聚沄同步`</u> | <u>`聚沄同步`</u> |

<u>**Step 84 品牌字样统一**：`syncalgov3_title` → en `juiyun sync has HUGE updates on the sync algorithm` / zh_cn `聚沄同步 算法有重大更新` / zh_tw `聚沄同步 演算法有重大更新`；`syncalgov3_texts` 欢迎语 → `Welcome to use juiyun sync!` / `欢迎使用聚沄同步！` / `歡迎使用聚沄同步！`。</u>

<u>**Step 84 修 6 处 404 链接**：`syncalgov3_texts` 三语言各 2 处 `https://github.com/cstcloud/cstcloud-sync` → `https://github.com/studynt47/cstcloud-sync`。实测依据：`api.github.com/repos/cstcloud/cstcloud-sync` → **HTTP 404**；`studynt47/cstcloud-sync` → **HTTP 200**。链接**锚文本未动**（`doc website` / `文档网站` / `文件網站` / `visit the GitHub repo` / `访问 GitHub 页面` / `訪問 GitHub 頁面`）。**根因**：v1.8 修 `manifest.json` 的 `authorUrl` 时**漏了三份 i18n** → 升级弹窗里「文档网站」「访问 GitHub 页面」两个链接点进去全是 404。</u>

<u>**Step 84 明确不动（老板 2026-10-28 逐条拍板）**：README 标题 / `manifest.json` 的 `id`·`name` / `cstcloud.cn`·`s3.cstcloud.cn` 域名 / 链接锚文本。老板拍板原文：`1✅ 2✅ 3改 4不改 5不改 6发0.0.5 7改`。</u>

<u>**Step 84 本地 commit**：`35aed42`（源码 + 文案）/ `978d020`（版本号）/ `55ab530`（重建 main.js）。**线上**：commit `f0a460cd3a9c8499b56185cda2e523761c4f730d`（3 个干净 commit），tag `0.0.5`，Release `https://github.com/studynt47/cstcloud-sync/releases/tag/0.0.5`（assets：`manifest.json` / `main.js` / `cstcloud-sync0.0.5.zip`）。</u> <u>【v2.0 变更注：本节升为 **v0.0.6 目标交付物形态**；v0.0.5 的实际交付包事实原样保留为历史记录】</u>

### <u>Phase 10：v0.0.6 · B 类决策收口（批次 A / B / C / D）</u>

<u>**说明**：本 Phase 记录 **v0.0.6** 的 B 类 12 项决策落地，编号自 **Step 85** 起续编。既有 **Step 1~84** 的编号与判据文字原样保留；§6 历史 checklist 的 **59 个条目**计数与例外项（Step 11 / 37）**不受影响**（AC17 判据不动）。批次 A / B / C / D 的源码改动**已提交并复核通过**，对应本地 commit：A `9e71b14` / B `b55449e` / C `0f4f96e` / D `c97a7ca`。<u>【v2.1 变更注：版本号推进（0.0.5 → 0.0.6）**已执行**（`4b8d6f6`）、`main.js` **已重建**（`01b238d`，md5 `87fa862dc9abb869ecab1ba7eba4e2ab` / 1,038,403 字节），故本 Phase 内涉及版本号落值、产物 MD5 与产物计数的判据**已实测回填**（见 Step 86 与 §9 AC36 / AC37）；⛔ **真机验收类判据与 v0.0.6 分发包仍未完成**】</u></u>

| Step | 动作 | 文件位置 | 完成判据 |
|---|---|---|---|
| 85 | <u>**（v0.0.6 · B-4）** 删除「保存后同步」整条死链：`toggleSyncOnSaveIfSet` / `_checkCurrFileModified` / `_syncOnSaveEvent1` / `_syncOnSaveEvent2` / `syncOnSaveIntervalID` / `syncEvent` / `hasPendingSyncOnSave` / `auto_sync_on_save` 触发源；`syncOnSaveAfterMilliseconds` 字段保留为 `@deprecated` 兼容占位 + `loadSettings()` 强制覆盖 `-1` 防复活</u> | <u>`src/main.ts`（批次 B，commit `b55449e`）</u> | <u>① 上述 8 个符号在 `src/` 中**全部 0 命中** ② `syncOnSaveAfterMilliseconds` 仅余 3 处：`src/baseTypes.ts:62`（`@deprecated` 字段声明）/ `src/main.ts:51`（DEFAULT_SETTINGS 默认 `-1`）/ `src/main.ts:584`（`loadSettings()` 强制覆盖 `-1`）③ 旧配置**不再有任何触发路径**（§8 R2 实质消解）④ `npm test` → 142 passing、`tsc --noEmit` → 0 error、`npm run build2` → exit 0</u> |
| 86 | <u>**（v0.0.6 · D1）** 移除 `src/settings.ts` 的 `settings_enablestatusbar_info` 与 `settings_deletetowhere` 两个 Setting 及对应 7 个 i18n 键；`src/main.ts` Step 33 的 6 项强制覆盖**全部保留**</u> | <u>`src/settings.ts`（批次 D，commit `c97a7ca`）、`src/langs/en.json` / `zh_cn.json` / `zh_tw.json`</u> | <u>① `grep -n "settings_enablestatusbar\|settings_deletetowhere" src/settings.ts src/langs/*.json` → **0 命中** ② 三语言 `settings_enablestatusbar_*`（3 键）与 `settings_deletetowhere_*`（4 键）共 **7 键已删除** ③ `grep -n "Platform" src/settings.ts` → **0 命中**、`if (!Platform.isMobileApp)` 守卫块**整体移除**，桌面端与移动端设置项完全一致 ④ `src/main.ts` 中 `enableStatusBarInfo = true`（行 583）与 `deleteToWhere = "system"`（行 585）**仍在** `loadSettings()` 内，Step 33 的 6 项强制覆盖**一行未改** ⑤ `npm test` → 142 passing、`tsc --noEmit` → 0 error、`npm run build2` → exit 0 <u>【v2.1 变更注：`main.js` **已重建**（commit `01b238d`，`npm run build2`）—— 产物经 **AST 解析（acorn）**确认 `MemberExpression.isMobileApp` 命中 **0**；同法解析旧产物（`c97a7ca`）对照命中 **1**（`Ye.Platform.isMobileApp`），证明守卫**有效、非假阴性**。`npm test` → 142 passing / 0 failing、`tsc -noEmit -skipLibCheck` → exit 0、`npm run build2` → exit 0 **均为实测已通过**。⛔ **真机验收类判据仍未完成**】</u></u> |


---

## 7. 里程碑与排期

| 里程碑 | 内容 | 估时 |
|---|---|---|
| M1：干净删除 | Phase 1-3 完成，src 目录仅剩保留文件，pro/ 删除，无编译错误 | **6h**（settings.ts 总 3029 行要删 ~1500 行 + pro/src/sync.ts 提取到 src/sync.ts 含 conflictLogic） |
| M2：硬编码验证 | Step 28-33 完成，manifest.json 正确，DEFAULT_SETTINGS 硬编码验证 | 2h |
| M3：功能验证 | Step 34-39 完成，syncRun 流程通，import/export 可用，i18n 无 key 缺失 | 4h |
| M4：E2E 验证 | Obsidian 中安装插件，配置 AccessKey/SecretKey/Bucket，检查连接通过，单向同步通过，双向同步通过 | 4h |

**总估时：16h（约 2 人日）**

<u>**v1.3 排期（A/B/C 三阶段）**</u>

| <u>里程碑</u> | <u>内容</u> | <u>对应 Step</u> | <u>估时</u> |
|---|---|---|---|
| <u>M5：基线可编译</u> | <u>A1 修 tsc（Step 59）→ A2 重建 git 基线（Step 60-61）→ A3 版本号统一（Step 62）</u> | <u>59-62</u> | <u>2h</u> |
| <u>M6：身份与品牌</u> | <u>A4 README 品牌化（Step 63）+ A5 manifest 身份（Step 64）+ A6 checklist 勾选（Step 65）+ A7~A9 补充修复（Step 66-68）</u> | <u>63-68</u> | <u>4h</u> |
| <u>M7：质量验证</u> | <u>B1 加载测试 + B3 双向同步 E2E + B4 单测补齐 + B5 产物自检</u> | <u>69、71-73</u> | <u>12h</u> |
| <u>M8：瘦身</u> | <u>C1 加密后端移除 + C2 profiler 移除 + C3 dropbox 死分支 + C4 依赖清理 + C5 i18n 复核</u> | <u>74-81</u> | <u>14h</u> |
| <u>M9：阻塞项</u> | <u>B2 S3 真实连通性测试（依赖老板提供 cstcloud.cn AccessKey / SecretKey / Bucket）</u> | <u>70</u> | <u>2h</u> |
| <u>M10：发布</u> | <u>产出 v0.0.3 插件包（§7.1 交付物形态）+ 副本同步至 `/home/WPS/ls/cstcloud-sync/`</u> <u>【v1.9 状态：✅ 已完成 —— 发布版本号已推进至 **0.0.5**，分发包 `cstcloud-sync0.0.5.zip`（312,048 字节 / md5 `3460177d84f8cafbd56d7c4a7462f969`）已产出并上线为 Release `0.0.5`】</u> <u>【v2.0 状态：⛔ 发布版本号推进至 **0.0.6**、分发包 `cstcloud-sync0.0.6.zip` —— **尚未执行**，待回填；v0.0.5 交付包事实（312,048 字节 / md5 `3460177d84f8cafbd56d7c4a7462f969`）原样保留】【v2.1 状态：版本号推进部分 ✅ **已完成**（`4b8d6f6`，四处一致 `0.0.6`，`versions.json` 6 条）；`main.js` ✅ **已重建**（`01b238d`，md5 `87fa862dc9abb869ecab1ba7eba4e2ab` / 1,038,403 字节）；⛔ **分发包 `cstcloud-sync0.0.6.zip` 尚未产出、线上 Release 未发布**（属老板另行指定的 M10 执行项）—— 本版**不得**表述为「v0.0.6 已发布 / 已上线」】【v2.2 状态：✅ **已完成** —— 分发包 `cstcloud-sync0.0.6.zip` **已产出**（**310,804 字节** / md5 `122b6c075f6498e237c5779153a58b36`，目录层级 `cstcloud-sync/`，含 `main.js`(1,038,403 B) / `manifest.json`(301 B) / `versions.json`(136 B) / `README.md`(6,311 B) / `README.zh-cn.md`(5,743 B) / `LICENSE`(12,266 B) 共 6 个文件），**§7.1 交付物形态判据 11/11 通过**（与 v0.0.5 同一形态表，未新增 / 删减条目）；**线上 Release 已上线** —— tag `0.0.6` → commit `70bedbeb34ede0b10da961aa1b072f6ee70ba186`、Release `https://github.com/studynt47/cstcloud-sync/releases/tag/0.0.6`（draft=false、prerelease=false；assets：`cstcloud-sync0.0.6.zip`(310,804 B) / `main.js`(1,038,403 B) / `manifest.json`(301 B)）。上方 v2.1 状态原文**原样保留】</u> | <u>—</u> | <u>1h</u> |
| <u>M11：发版版本号统一</u> | <u>老板指定发布版本号（≥ 0.0.3）并同步 manifest.json / package.json / PRD §4.3</u> <u>【v1.9 状态：✅ 已完成 —— 老板 2026-10-28 书面指定发布版本号 **0.0.5**，`manifest.json` / `package.json` / `versions.json` / PRD §4.3 四处一致；线上 tag `0.0.4` / `0.0.5` 已发布】</u> <u>【v2.0 状态：⛔ 发布版本号推进至 **0.0.6**（`manifest.json` / `package.json` / `versions.json` / PRD §4.3 四处）—— **尚未执行**，待回填】【v2.1 状态：✅ **已完成** —— 版本号推进至 **0.0.6** 已执行（commit `4b8d6f6`），`manifest.json` / `package.json` / `package-lock.json`（root 与 `packages[""]` 各一处）/ `versions.json` / PRD §4.3 **一致为 `0.0.6`**，`versions.json` **6 条**（含 `"0.0.6": "0.13.21"`）；⛔ **分发包与线上 Release 未完成**（见 M10）】【v2.2 状态：✅ **全部完成** —— 版本号 **五处一致为 `0.0.6`**（`manifest.json` / `package.json` / `package-lock.json`（root `version` 与 `packages[""]` `version` 各一处）/ `versions.json` / PRD §4.3），`versions.json` **6 条**（含 `"0.0.6": "0.13.21"`）；分发包 `cstcloud-sync0.0.6.zip` **310,804 字节** / md5 `122b6c075f6498e237c5779153a58b36` **已产出**；线上 Release `https://github.com/studynt47/cstcloud-sync/releases/tag/0.0.6` **已发布**（tag `0.0.6` → commit `70bedbeb34ede0b10da961aa1b072f6ee70ba186`，draft=false、prerelease=false）。上方 v2.1 状态原文**原样保留】</u> | <u>—</u> | <u>0.5h</u> |

<u>**v1.3 总估时：35h（约 4.5 人日）**，不含 B2 阻塞等待时间与 D/E 类（待定/暂缓）。</u>

<u>**关键路径与依赖关系**</u>

- <u>A1（Step 59）必须早于 A2（Step 60-61）</u>：基线 commit 要么包含"构建链已修复"这一事实，要么包含一个已知断裂的构建链。<u>先修 tsc 再建基线</u>，基线 commit 才是可用的起点；反之则基线一落地就是坏的，后续所有 diff 都要额外排除 P0-1 噪声。</u>
- <u>A2（Step 61）必须早于 C 类全部步骤</u>：C 类要删 5 个文件、改 3 个核心文件，没有干净基线就无法做真实 diff、无法确认"只删了该删的"、无法回滚。
- <u>B4（Step 72）建议早于 C1（Step 74-77）</u>：`src/sync.ts` 的加密解耦是全项目风险最高的一次改动，若先有 `sync.ts` / `copyLogic.ts` / `conflictLogic.ts` 的单测兜底，解耦的回归可被自动捕获；反之只能靠 E2E 人工兜底。<u>若工期紧张，B4 可后置，但 C1 之后必须补做。</u>
- <u>B5（Step 73）必须最后做</u>：它是 C 类成果的终检。
- <u>B2（Step 70）不受其他步骤阻塞，但受凭证阻塞</u>：可与 M5~M8 并行推进，凭证到位前保持「阻塞」状态。

<u>**v1.4 排期（配置目录同步文档化 + Step 82）**</u>

| <u>里程碑</u> | <u>内容</u> | <u>对应 Step</u> | <u>估时</u> |
|---|---|---|---|
| <u>M12：v1.4 补充</u> | <u>Step 82 补齐 `workspace-mobile.json` 排除（2 行改动）+ §5.4 配置目录同步文档化落地到 README / 插件设置说明（**代码零改动**）+ §9 AC33 验收</u> | <u>82</u> | <u>1h</u> |

<u>**v1.4 总估时：1h**，排在 Phase 7（M8）之后、终验（§9 AC32）之前。§5.4 的文档化工作不含代码改动，不占用实施工时。</u>

<u>**v1.4 依赖关系**：Step 82 依赖 Phase 7 已完成（`src/obsFolderLister.ts` 在 C 类中未被改动，但依赖 A/C 两类的 `npm test` 基线全绿作为前置）；Step 82 完成后须由 AC33 复核 §5.4 所述排除清单的最终生效状态。</u>

<u>### 7.1 v0.0.6 目标交付物形态</u> <u>【v1.9 变更注：原标题为「7.1 v0.0.3 目标交付物形态」（v1.7 发版口径），v0.0.4 / v0.0.5 两轮发版后升为 v0.0.5】</u>

<u>Obsidian 插件分发包（zip）应包含下列文件，目录层级为插件 id `cstcloud-sync/`：</u>

| <u>文件</u> | <u>必需</u> | <u>说明</u> |
|---|---|---|
| <u>`main.js`</u> | <u>必需</u> | <u>esbuild 产物，C1/C2/C3 完成后重新构建</u> |
| <u>`manifest.json`</u> | <u>必需</u> | <u>version = 0.0.5，author = cstcloud（待确认）</u> <u>【v1.9：原为 version = 0.0.3】</u> <u>【v2.0 变更注：v0.0.6 口径 → version = **0.0.6**】【v2.1 变更注：版本号推进**已执行**（commit `4b8d6f6`）—— 实际 `manifest.json` 落值 **version = 0.0.6**；红线字段 `id`(`cstcloud-sync`) / `name`(`cstcloud-sync`) / `description` / `author` / `authorUrl` / `minAppVersion`(0.13.21) / `isDesktopOnly` **逐字节未改**；⛔ v0.0.6 分发包尚未产出、线上 Release 未发布】【v2.2 变更注：该 ⛔ **已解除** —— 分发包 `cstcloud-sync0.0.6.zip` **已产出**（**310,804 字节** / md5 `122b6c075f6498e237c5779153a58b36`），包内 `manifest.json` **301 字节**、落值 **version = 0.0.6**，红线字段 `id` / `name` / `description` / `author` / `authorUrl` / `minAppVersion` / `isDesktopOnly` **逐字节未改**；线上 Release `https://github.com/studynt47/cstcloud-sync/releases/tag/0.0.6` 已发布（assets 含 `manifest.json`(301 B)）。上方 v2.1 变更注原文**原样保留】</u> |
| <u>`LICENSE`</u> | <u>必需</u> | <u>A9 更新后的 Apache-2.0 文本 + 派生自 remotely-save v0.5.25（Copyright fyears）声明</u> |
| <u>`README.md`</u> | <u>必需</u> | <u>A4 品牌化后的英文 README，含 Apache-2.0 归属与上游致谢</u> |
| <u>`README.zh-cn.md`</u> | <u>推荐</u> | <u>A4 品牌化后的中文 README</u> |
| <u>`versions.json`</u> | <u>推荐</u> | <u>BRAT / 手动安装用户依赖；<u>当前仅有上游 `0.3.2` / `0.3.25` 两条，须补 `"0.0.3": "0.13.21"`</u> <u>【v1.9 变更注：v0.0.4 / v0.0.5 发版后，`versions.json` 须含 `"0.0.5": "0.13.21"`，现有 **5 条**（`0.3.2` / `0.3.25` / `0.0.3` / `0.0.4` / `0.0.5`）；原「须补 `"0.0.3"`」为 v1.7 口径，保留不改】</u><u>【v2.0 变更注：v0.0.6 发版口径 —— `versions.json` 追加 `"0.0.6": "0.13.21"` 后为 **6 条**（现状 **5 条**：`0.3.2` / `0.3.25` / `0.0.3` / `0.0.4` / `0.0.5`，追加 `"0.0.6": "0.13.21"` 1 条后为 6 条）】【v2.1 变更注：追加动作**已执行**（commit `4b8d6f6`）—— `versions.json` 现为 **6 条**（`0.3.2` / `0.3.25` / `0.0.3` / `0.0.4` / `0.0.5` / `0.0.6`），含 `"0.0.6": "0.13.21"`；⛔ v0.0.6 分发包尚未产出、线上 Release 未发布】【v2.2 变更注：该 ⛔ **已解除** —— 分发包 `cstcloud-sync0.0.6.zip` **已产出**（**310,804 字节** / md5 `122b6c075f6498e237c5779153a58b36`），包内 `versions.json` **136 字节**、**6 条**（含 `"0.0.6": "0.13.21"`）；线上 Release `https://github.com/studynt47/cstcloud-sync/releases/tag/0.0.6` 已发布。上方 v2.1 变更注原文**原样保留】</u></u> |
| <u>`styles.css`</u> | <u>不适用</u> | <u>manifest 未声明 `styles` 字段，本插件不使用自定义样式</u> |

<u>不需要包含：`node_modules/`、`src/`、`tests/`、`package.json`（Obsidian 运行时不需要）、`manifest-beta.json`（上游遗留、内容仍为 remotely-save 0.5.25，<u>应在本轮删除或同步更新，避免误装</u>）。</u>

<u>**v1.9 实际交付包（v0.0.5）**：分发包 `cstcloud-sync0.0.5.zip`，**312,048 字节**，md5 `3460177d84f8cafbd56d7c4a7462f969`，目录层级 `cstcloud-sync/`，含 `main.js`(1,043,853 B) / `manifest.json`(301 B) / `versions.json` / `README.md` / `README.zh-cn.md` / `LICENSE` 共 **6 个文件**；**§7.1 形态判据 11/11 通过**。已上线为 GitHub Release `https://github.com/studynt47/cstcloud-sync/releases/tag/0.0.5`（assets：`manifest.json` / `main.js` / `cstcloud-sync0.0.5.zip`）。</u>

<u>**v2.0 目标交付包（v0.0.6）· ⛔ 部分回填（v2.1）· ✅ 全部回填（v2.2）**：分发包 `cstcloud-sync0.0.6.zip`，形态同 §7.1 表（6 个文件）；<u>【v2.1 回填 —— 已完成项】① **版本号推进已执行**（commit `4b8d6f6`）—— `manifest.json` 的 `version` 落值 **0.0.6** ② **`versions.json` 追加已执行** —— 现 **6 条**，含 `"0.0.6": "0.13.21"` ③ **`main.js` 已重建**（commit `01b238d`，`npm run build2`）—— 重建后 md5 `87fa862dc9abb869ecab1ba7eba4e2ab`、**1,038,403 字节**（重建前 md5 `26105bde8e16815ead12167f12afa42c` / 1,043,812 字节，字节差 **−5,409**；重建前 md5 仅作**沿革**保留，**非**重建后口径）。**仍 ⛔ 待回填**：④ 分发包字节数与 md5 ⑤ 上线 tag / Release 地址 —— 分发包 `cstcloud-sync0.0.6.zip` **尚未产出**（属 M10，老板另行指定）、线上 Release **未发布**；分发包的字节数 / md5 **不存在**，不得填写预测值。**全文不得表述为「v0.0.6 已发布 / 已上线 / 已交付」**。【v2.2 回填 —— ④⑤ 已完成】：④ **分发包字节数与 md5 已实测** —— `cstcloud-sync0.0.6.zip` **310,804 字节** / md5 `122b6c075f6498e237c5779153a58b36`，目录层级 `cstcloud-sync/`，含 `main.js`(1,038,403 B) / `manifest.json`(301 B) / `versions.json`(136 B) / `README.md`(6,311 B) / `README.zh-cn.md`(5,743 B) / `LICENSE`(12,266 B) 共 **6 个文件**，**§7.1 形态判据 11/11 通过**（与 v0.0.5 同一形态表）；⑤ **上线 tag / Release 地址已实测** —— tag `0.0.6` → commit `70bedbeb34ede0b10da961aa1b072f6ee70ba186`、Release `https://github.com/studynt47/cstcloud-sync/releases/tag/0.0.6`（draft=false、prerelease=false；assets：`cstcloud-sync0.0.6.zip`(310,804 B) / `main.js`(1,038,403 B) / `manifest.json`(301 B)）。**v0.0.6 分发包与线上 Release 均已产出 / 已发布** —— v2.1 阶段「全文不得表述为已发布 / 已上线 / 已交付」的约束**自 v2.2 起解除**（v2.1 原文原样保留，不静默删改）。⛔ **真机验收类 ⛔ 不受本版影响**：桌面端 / 移动端 ribbon tooltip 两态、移动端高级设置区逐项可见性等仍未实测，保持 ⛔ 未完成】</u>

---

## 8. 风险与依赖

| ID | 风险 | 等级 | 缓解 |
|---|---|---|---|
| R1 | `main.ts:1412-1416` 在 `loadSettings()` 读取 `ignorePaths`/`onlyAllowPaths`，UI 删除后字段仍被处理 | 中 | Step 33 已在 `loadSettings()` 中强制覆盖为 `[]`（行 1413/1416） <u>【v0.0.6 变更注】现行源码 `src/main.ts:577-578` 已改为 `delete (this.settings as any).ignorePaths;` / `delete (this.settings as any).onlyAllowPaths;`，行号与语义均已变化</u> |
| R2 | `syncOnSaveAfterMilliseconds` 逻辑已保留但无 UI，旧配置可能触发意外行为 <u>**（已消解 · v0.0.6）** `syncOnSaveAfterMilliseconds` 的消费链已整条删除（`toggleSyncOnSaveIfSet` / `_checkCurrFileModified` / `_syncOnSaveEvent1` / `_syncOnSaveEvent2` / `syncOnSaveIntervalID` / `syncEvent` / `hasPendingSyncOnSave` / `auto_sync_on_save` 触发源），旧配置**不再有任何触发路径**；仅保留字段声明（`@deprecated`）、DEFAULT_SETTINGS 默认 `-1` 与 `loadSettings()` 强制覆盖 `-1` 作为**防复活闸门**</u> | <u>低</u> <u>【v0.0.6 变更注：原等级为「中」，随消费链整条删除下调为「低」】</u> | <u>~~`loadSettings()` 中强制覆盖为 `-1`~~ → 消费链已删，R2 实质消解</u> |
| R3 | 旧 data.json 含 PRO 字段，`loadSettings()` backward compat 可能产生副作用 | 低 | 验证 `loadSettings()` 不对 PRO 字段进行任何填充/读取 |
| R4 | `pro/src/sync.ts` 提取到 `src/sync.ts` 时遗漏 pro 内部依赖（account/conflictLogic/localdb × 3 个 import） | **高** | Step 34 详细化：新建 `src/conflictLogic.ts` + 合并 `src/localdb.ts` 类型 + 删除 PRO 校验调用；提取后编译验证 |
| R5 | `fsS3.ts` 保留完整，但 `ObsHttpHandler`（Obsidian requestUrl 封装）可能在 S3 cstcloud.cn 上有兼容问题 | 低 | M4 E2E 验证时重点测试连接 |
| R6 | i18n key 大面积删除，可能导致 `mustache.render` 报错（missing key） | 低 | 英文 fallback 会兜底；确认 `t()` 函数对 missing key 的容错 |
| <u>R7</u> | <u>v1.1 已删</u>：`qrcode` / `ExportSettingsQrCodeModal` / `importExport.ts` 均已删除，此风险消除 | 低 | —（v1.1 修订后消除） |
| R8 | `localdb.ts:9` SyncPlanType import 删除可能影响 `clearAllSyncPlanRecords()` 功能 | 低 | 确认 SyncPlanType 是否定义在 src 层，或需要在 src/sync.ts 中保留 |
| <u>R9</u> | <u>**发布版本号未递增导致已装用户收不到更新推送**：若最终发布版本号仍停留在 `0.0.2`，Obsidian 商店按 `id + version` 判重，同版本号的第二次提交**不会触发商店的更新推送**，已装 0.0.2 的用户**收不到更新推送**；社区插件审核侧也可能以"同版本号重复发布"为由驳回或要求重发</u> | <u>**高**</u> | <u>① 开发/升级阶段沿用 0.0.2 作为开发基线口径，不阻塞 A/B/C 实施 ② Step 81 全部完成后、正式发版前，由老板统一指定发布版本号（≥ 0.0.3）③ §9 AC32 固化"发版前必须完成版本号指定"这一前置动作</u> <u>④ 已解除：老板 2026-10-28 书面指定发布版本号 0.0.3（≥ 0.0.3 门槛已满足），商店更新推送前提达成</u> <u>【v1.9 变更注：发布版本号此后已随两轮修复推进至 **0.0.5**（tag `0.0.4` / `0.0.5` 均已上线），风险持续处于「已解除」状态】</u> |
| <u>R10</u> | <u>A2 git 基线重建期间的变更丢失风险：重建基线需把当前 54 个 mode-only 文件 + PRD.md 的 v1.2 内容一并纳入一个 commit。若期间有人并行改动工作区、或误用 `git checkout -- .` / `git reset --hard` 归零 mode 变更，可能连带丢弃未提交的实质改动</u> | <u>中</u> | <u>① 重建前先 `git stash list` 与 `git diff --numstat` 快照，确认除 PRD.md 外无内容差异（本次已实测确认）② 重建基线**只做 `git add` 具体文件 + `git commit`，不用 `git add -A` / `git add .`** ③ <u>更稳的替代路径：先 `git config core.fileMode false` 让 54 个 mode-only 条目直接归零，此时工作区只剩 PRD.md 一处实质变更，基线 commit 天然干净，无需任何 `chmod` / `checkout` 操作</u> ④ 禁止使用 `git checkout -- .`、`git reset --hard`</u> |
| <u>R11</u> | <u>**C1 不可逆：加密能力移除**。删除 `src/fsEncrypt.ts` 等 4 个文件 + 解耦 `src/sync.ts` 后，<u>端到端加密在本插件中不再具备</u>；若未来需重新提供该能力，须重做解耦并重新验证，不可简单回退（`_archive/upstream_v0.5.25/src/` 可提供 4 个原始文件，但本 fork 的 `src/sync.ts` 解耦改动只能靠 git tag 回滚）</u> | <u>**高**</u> | <u>① C1 实施前强制创建 tag/branch `backup/pre-v1.3-C1`（Step 74）② 实施中逐条满足 §5.1.C 的 3 项行为等价性约束，<u>特别是保留"远端已加密则中止同步"的守卫</u>（缺失该守卫会把远端密文当明文拉取，损坏本地笔记）③ B4 单测覆盖 3 项等价性 ④ §2.3 明确登记为非场景，§9 AC23 固化"加密后端确已移除"</u> |
| <u>R12</u> | <u>**B2 凭证依赖阻塞**：S3 真实连通性测试（HeadBucket + ListObjectsV2）依赖老板提供 cstcloud.cn 的 AccessKey / SecretKey / Bucket。凭证未到位时该项无法执行，<u>但 B3 双向同步 E2E 同样依赖真实凭证</u>，二者会一并阻塞，导致 M7 无法收口</u> | <u>中</u> | <u>① 凭证到位前，B2/B3 在 §6 中保持「阻塞」标记，<u>不得以 Mock / 假凭证 / 本地 minio 冒充通过</u> ② 优先向老板申请一个最小权限的测试账号（仅 1 个 bucket 的读 + 写）③ 若凭证长期无法到位，M7 降级为「B1 + B4 + B5 通过，B2/B3 留待有凭证后补测」，并在发布说明中显式标注该缺口</u> |
| <u>R13</u> | <u>C1 解耦 `src/sync.ts` 时破坏实体字段契约：`FakeFsEncrypt` 在空密码下并非纯粹直通，它会把 `keyEnc = keyRaw`、`sizeEnc = sizeRaw` 补进 Entity，而 `src/sync.ts` 有 <u>15 处</u>依赖 `keyEnc`/`sizeEnc` 做远端实体比对。解耦时若直接改用 `fsRemote.walk()` 的裸实体，<u>远端变更判定将失准，可能导致漏同步或重复同步</u></u> | <u>**高**</u> | <u>§5.1.C 的 3 项行为等价性约束 + Step 76 完成判据 + Step 72（B4）单测兜底；<u>建议 B4 优先于 C1</u>（见 §7 依赖关系）<u>（C1 已实施完毕，base vs 新版 worktree 差分对比 FULL EQUAL: True，15 处引用逐行一致）</u></u> |
| <u>R14</u> | <u>C2 删除 profiler 波及面超预期：`src/profiler.ts` 虽无 UI 入口，但仍被 `src/sync.ts`（62 处）、`src/fsLocal.ts`（12 处）、`src/localdb.ts`（4 处）、`src/main.ts`（7 处）调用，且 `src/main.ts:142` 仍依据 `settings.profiler.enable` 在运行时启用。删除时若漏改任一处即编译失败</u> | <u>中</u> | <u>§5.1.C 的依赖清理点已逐文件列出；完成判据为 `grep -rn "profiler\|Profiler" src/` 为 0 + `npm run build2` + `npm test` 通过。<u>注意 `src/localdb.ts` 的 `profilerresults` 表会成为孤儿表，已建库不受影响</u></u> |
| <u>R15</u> | <u>C4 误删仍在使用的依赖：`dotenv` 被勘察列为残留，但 `esbuild.config.mjs:1` 与 `webpack.config.js:1` 仍在 import/require，删除后构建链直接断裂；`jsdom` 被 `tests/misc.test.ts` 使用</u> | <u>中</u> | <u>Step 80 完成判据中已逐项标注「删除 / 保留」及判定依据；C4 完成后必须跑通 `npm run build2` + `npm test`</u> |
| <u>R16</u> | <u>C5 误删仍在渲染的 i18n 键：`settings_chooseservice` / `settings_synconsave` / `settings_synconsave_desc` 当前仍被 UI 引用，若先于 A8 删除，设置页将渲染出 undefined</u> | <u>低</u> | <u>§6 Step 81 已把这 3 键列为「条件删除（须先做 A8）」；执行顺序固定为 A8（Step 67）→ C5（Step 81）</u> |
| <u>R17</u> | <u>**配置目录同步为全量不可调**：`src/main.ts:593-597` 已将 `ignorePaths` / `onlyAllowPaths` 从 settings 中 `delete`，用户无法排除 `.obsidian` 内任何单个文件（例如其他插件含明文凭据的 `data.json`）。一旦开启，`.obsidian` 内全部内容（排除项除外）均会进入 bucket</u> | <u>**高**</u> | <u>① 仅在测试 vault 开启 ② bucket 私有 + 服务端加密 ③ 开启前人工清点 `.obsidian` 内高敏凭据 ④ 若需精细化排除，须新开 D 类需求实现白名单机制 ⑤ 开启后需重启 Obsidian，并留意桌面/移动端配置互相覆盖</u> |
| <u>R18</u> | <u>**移植类缺陷：条件块边界错位**。从 upstream 移植代码时，大括号位置被改动，使 `if (!Platform.isMobileApp)` 块从「仅含 2 个状态栏项（36 行）」膨胀到「从状态栏项一直包到 `display()` 末尾（279 行）」，把整个高级设置区（`advDiv`）圈进移动端禁用范围 → **移动端用户看不到「同步配置文件夹」等 9 项设置**。该缺陷在 v0.0.2（commit `4f383e6`）移植时引入，**编译期与单测均无法发现**（语法完全合法、142 项单测全绿），属**静默功能性缺陷**，直到移动端真机安装才暴露</u> | <u>**高**</u> | <u>① **从 upstream 移植后必须用 AST / 括号配平核对条件块的归属范围**，不得依赖肉眼看 diff 或字符串 grep ② **编译产物用 acorn 解析守卫区间**，而非对 `main.js` 做字符串 grep —— v0.0.4 即以 AST 确认移动端守卫区间由 5,448 字符缩至 347 字符 ③ 条件块内只允许保留**确属平台专属**的调用（如自定义状态栏项），任何"该平台不支持"的判断必须逐条给出 API 级依据 ④ 移植类改动统一用 `git diff -w` 验证「唯一非空白改动为预期的那一处」 ⑤ 见 §6 Step 83 与 §9 AC34 <u>【v0.0.6 变更注】v0.0.6 起该守卫块在 `src/settings.ts` 中**整体不存在**（块内唯一项 P1-5 已删），R18 的缓解措施②③④（AST 核对守卫区间）随块消失而不再适用；本风险条目保留为历史记录</u> |
| <u>R19</u> | <u>**品牌/仓库地址变更需全仓 grep（含 i18n）**。v1.8 修 `manifest.json` 的 `authorUrl` 时只改了 manifest，**漏掉三份 i18n**（`src/langs/en.json` / `zh_cn.json` / `zh_tw.json`），导致升级弹窗里「文档网站」「访问 GitHub 页面」共 **6 处链接点进去全是 404**（`https://github.com/cstcloud/cstcloud-sync` 实测 HTTP 404）。i18n 中的品牌字样与链接散落三份语言文件，逐份手改极易漏改或改得不一致</u> | <u>中</u> | <u>① 任何仓库地址 / 品牌口径变更，必须**全仓 grep 覆盖 `manifest.json` + `package.json` + `versions.json` + 三份 i18n + README×2**，并以 `grep -o \| wc -l` 逐文件计数核对 ② 地址变更后须**实测 HTTP 状态码**（`api.github.com/repos/<owner>/<repo>` → 404 即为不存在），不能凭「应该是这个地址」的推测 ③ 三语言 key 集合须**完全一致**（现各 169 键），新增/删除 key 必须三份同改 ④ 品牌字样改动后核对编译产物（v0.0.5 实测 `main.js` 内「聚沄同步」8 次、「juiyun sync」4 次）⑤ 见 §6 Step 84 与 §9 AC35</u> |
| <u>R20</u> | <u>**R20 · 界面与能力不一致（D1 决策）**：`enableStatusBarInfo` 与 `deleteToWhere` 的 UI 控件在 0.0.5 中可见但**无效**（`loadSettings()` 每次启动强制覆盖），用户操作后重启即失效，属静默功能性缺陷（编译期与单测均无法发现）。v0.0.6 按 D1 决策**移除 UI、保留强制覆盖**，使界面与能力一致</u> | <u>中</u> | <u>① 同步更新 §3.2 P1-5 / P1-11 为「已删除」② 删除对应的 7 个 i18n 键 ③ 新增 AC36 固化「设置页不再出现状态栏开关与删除到哪下拉」④ 状态栏恒显示、删除恒走系统回收站的行为写入 §3.1 P0-11 / P0-14</u> |
| <u>R21</u> | <u>**R21 · 品牌 / tooltip 文案漂移与孤儿键长期积压**：`ribbon` tooltip 的 `aria-label` 在 `src/main.ts` 里有**三处写入点**（注册处、同步结束回写处、同步中回写处），**后写者胜**；v0.0.5 的品牌改造只改了注册处、漏改回写处，导致同步完成后桌面端显示仓库 id `cstcloud-sync`、移动端显示品牌名「聚沄同步」，两端不一致。根因与三处写入点位置见技术勘察报告 `_pm_survey_2026-11-13-tooltip.md`</u> | <u>中</u> | <u>① 回写处改取 `t("plugin_display_name")`，与注册处**取值同源**（批次 C `0f4f96e` 已落地：同步结束回写处 `src/main.ts:330-331`、同步中回写处 `src/main.ts:318-323` 现均取 `t("plugin_display_name")`）② 三个品牌键 `ribbon_sync_tooltip` / `settings_plugin_title` / `plugin_display_name` 在**每种语言中取值必须完全一致** ③ 验收口径定为「**取值一致**」，而非「两端渲染完全相同」——Obsidian 桌面端与移动端对同一属性的**读取时机**存在平台差异，该差异本机无法验证 ④ 真机 ⑤⑥⑦ 由老板实测，未完成前标 ⛔ ⑤ 后续任何品牌文案变更须**同时复核三处写入点**，不得只改其一 ⑥ `src/localdb.ts:161` 仍有 **1 处** `Remotely Save`（迁移指引文案），属**保留项**、本轮不改 ⑦ 另有 **40 个孤儿 i18n 键**（含 `modal_sizesconflict_title`）另开批次清理，**不在本轮 0.0.6 范围**</u> |

---

## 9. 验收标准

| ID | AC | 验证方式 |
|---|---|---|
| AC1 | 插件安装后 plugin id 为 `cstcloud-sync`，名称为 `cstcloud-sync` | 读取 manifest.json 验证 |
| AC2 | 设置页面仅显示 AccessKey / SecretKey / Bucket 三个 S3 必填字段 + <u>12 个 P1 可选字段（v1.1 删除 P1-13/P1-14）</u>，无其他云服务 <u>【v0.0.6 变更注】v0.0.6 起 P1 可选字段为 **10 个 P1 可选字段**（v1.1 删除 P1-13/P1-14；<u>**v0.0.6 D1 再删 P1-5 / P1-11**</u>）；上方「12 个」为 v1.1 历史判据、原样保留不回改。建议把硬编码数字判据改为「按 §3.2 表逐条核对仍在 UI 中的 P1 项」，避免数字随实现漂移</u> | 手动检查 UI |
| AC3 | Endpoint / Region / S3 URL Style / Log Level / Obfuscate 均不在 UI 中显示 | 手动检查 UI |
| AC4 | "检查连接"按钮点击后成功验证 S3 连通性（或返回明确错误） | E2E 测试 |
| AC5 | Ribbon 图标点击触发 `start-sync`，命令面板两个命令均可用 | E2E 测试 |
| AC6 | `npm run build2` 无错误完成，生成 `main.js` | CI / 本地构建 |
| AC7 | `npm test` 无新增测试失败（上游 mocha 测试） | CI / 本地测试 |
| AC8 | 插件加载后 `data.json` 中 6 项关键字段被强制覆盖（`loadSettings()` 行 1410-1427）：`s3.generateFolderObject=false` / `ignorePaths=[]` / `onlyAllowPaths=[]` / `enableStatusBarInfo=true` / `syncOnSaveAfterMilliseconds=-1` / `deleteToWhere="system"`。`serviceType="s3"` / `currLogLevel="info"` 已在 `main.ts:115-157` DEFAULT_SETTINGS 默认值（Step 31 范畴，旧 data.json 加载后即覆盖为 "s3"/"info"） <u>【v0.0.6 变更注：6 项强制覆盖全部保留、一行未改；`ignorePaths` 与 `onlyAllowPaths` 已删除（现行源码 `src/main.ts:577-578` 用 `delete` 语义移除，行号与语义均已变化）；`enableStatusBarInfo` 与 `deleteToWhere` 因 D1 决策改为「UI 已删、能力恒定」】</u> | 首次加载后读取 data.json |
| <u>AC9</u> | <u>同步算法说明弹窗在 3 个 langs（en / zh_cn / zh_tw）中均正确显示对应语言文案，6 个 key（`syncalgov3_title` / `syncalgov3_texts` / `syncalgov3_checkbox_manual_backup` / `syncalgov3_checkbox_requiremultidevupdate` / `syncalgov3_button_agree` / `syncalgov3_button_disagree`）均有值；复选框 2 文案包含"仅支持 S3 协议 + 默认端点 cstcloud.cn"语义；GitHub 链接占位为 `https://github.com/cstcloud/cstcloud-sync`</u> <u>【v1.9 变更注：v0.0.5 已把 `syncalgov3_texts` 中的 2 处链接占位由 `https://github.com/cstcloud/cstcloud-sync` 改为 `https://github.com/studynt47/cstcloud-sync`（前者实测 404），锚文本未动；本条历史判据文字保留不改】</u> | <u>E2E 测试：分别切换 3 种语言触发弹窗，肉眼核对文案</u> |
| <u>AC10</u> | <u>Settings 页面中"导入/导出设置"区块和"调试"区块均已消失；`src/importExport.ts` 和 `src/debugMode.ts` 文件不存在</u> | <u>Step 48~54（importExport）/ Step 55~58（debugMode）后检查文件存在性 + 手动检查 Settings UI</u> |
| <u>AC11</u> | <u>`src/syncAlgoV3Notice.ts` TS 结构未被修改（弹窗触发/同意行为保持不变）</u> | <u>代码审查 `src/syncAlgoV3Notice.ts` + `main.ts:570, 903-907`</u> |

<u>**v1.3 新增验收项（AC12 起）**</u>

<u>v1.1 的 AC11 保持原编号不变；v1.3 的新增条目自 AC12 起编号，避免改动历史条目编号。</u>

<u>**v1.4 新增验收项：AC33**（配置目录同步（实验性））。v1.4 的新增条目自 AC33 起编号，AC1–AC32 全部保持不变；AC32 仅将 Step 覆盖范围由「59–81」修订为「59–82」，编号与语义不变。</u>

| ID | AC | 验证方式 |
|---|---|---|
| <u>AC12</u> | <u>**（A1）** `tests/fsWebdis.test.ts` 不存在；`npx tsc --noEmit` 输出 0 error（`TS2307: Cannot find module '../src/fsWebdis'` 消除）；`npm run build2` 与 `npm test` 均可执行完毕</u> | <u>`ls tests/fsWebdis.test.ts` → No such file；`npx tsc --noEmit` → 无 error 行；`npm run build2` → exit 0 且 `main.js` 时间戳更新</u> |
| <u>AC13</u> | <u>**（A2）** git 基线干净：`git status --porcelain` 输出为空；`git diff --numstat` 无 mode-only 条目；基线 commit 已产出</u> | <u>`git config core.fileMode` → `false`（或文件权限位已归位为 644）；`git status --porcelain` → 空；`git log --oneline -1` → 基线 commit；`git show --stat HEAD` → 内容差异与预期一致</u> |
| <u>AC14</u> | <u>**（A3）** 产品版本号三处统一为 `0.0.2`：`package.json` / `manifest.json` / PRD §4.3；<u>全仓不出现 `0.0.3`</u></u> | <u>`grep '"version"' package.json manifest.json` → 两处均为 `0.0.2`；`grep -rn "0\.0\.3" package.json manifest.json PRD.md` → 无输出（PRD 中仅版本号口径相关条目——修订记录 v1.3 行 / §6 Step 62 / §7 M11 / §8 R9 / §9 AC14 与 AC32——的文字提及"0.0.3"允许存在）</u> <u>注：0.0.2 为开发基线；发版版本号已由老板指定为 0.0.3（manifest.json / package.json / PRD §4.3），"0.0.3" 字样将出现在版本字段中，属预期，非违反本条判据</u> |
| <u>AC15</u> | <u>**（A4）** `README.md` / `README.zh-cn.md` 标题为 `cstcloud-sync`；<u>保留 Apache-2.0 归属说明与对 fyears（上游原作者）的致谢段落</u>；无上游 star 徽章 / 赞助链接 / 商店链接残留</u> | <u>`grep -n "^# " README.md README.zh-cn.md` → 均为 `# cstcloud-sync`；`grep -n "Apache-2.0\|Apache License\|fyears" README.md README.zh-cn.md` → 有命中；`grep -n "img.shields.io\|remotelysave.com\|fyears/remotely-save" README.md README.zh-cn.md` → 无命中</u> |
| <u>AC16</u> | <u>**（A5）** `manifest.json` 身份为 cstcloud 口径：`author` = `cstcloud`（<u>待老板确认</u>）、`authorUrl` = `https://github.com/cstcloud/cstcloud-sync`、`description` 不含 "fork 自 remotely-save"</u> | <u>读 `manifest.json` 三字段逐一比对；`grep -n "fork" manifest.json` → 无命中</u> <u>【v1.8 修正】authorUrl 最终为 https://github.com/studynt47/cstcloud-sync；`author` = `cstcloud` 不变，description 不含 "fork" 不变</u> |
| <u>AC17</u> | <u>**（A6）** §6 历史 checklist 59 个条目全部完成勾选，<u>2 个例外项（Step 11 / 37）保留 `[ ]` 并注明原因</u>（<u>Step 1.5 已于 Step 59 补做完成；Step 22 亦已完成——`src/settings.ts` 中 `syncOnSave` 零命中，Setting 已随 Step 67（A8）删除</u>）。<u>计数口径：57 条 `[x]` + 2 条 `[ ]` = 59 条</u> <u>【v1.9 变更注：本条「历史 checklist 59 个条目」计数口径**不变**；§6 新增的 Phase 9（Step 83 / 84）为已实施事实回填，不计入该 59 条。i18n 键数判据随 v0.0.5 新增 2 键由 167 更新为 **169**，详见 AC30】</u></u> | <u>通读 §6 checklist 区块，确认无未处理项</u> |
| <u>AC18</u> | <u>**（A7）** 设置页顶部标题为 `cstcloud-sync`，不再显示 `Remotely Save`</u> | <u>`grep -n '"Remotely Save"' src/settings.ts` → 无命中；Obsidian 设置页肉眼核对 H1</u> |
| <u>AC19</u> | <u>**（A8）** 设置页不再出现"选择服务"孤儿标题与"保存时自动同步"空标签；对应 i18n 键已清理</u> | <u>`grep -n "settings_chooseservice\|settings_synconsave" src/settings.ts src/langs/*.json` → 全部无命中。<u>已满足（2026-10-27 实测）：commit `31c7a30` 清理 2 个孤儿键 `settings_synconsave_disable` / `settings_synconsave_enable` 后，三语言各 167 键、键集合完全一致，`grep -rn "settings_synconsave" src/langs/` → 0 命中，`grep -c "settings_synconsave" main.js` → 0</u> <u>【v1.9 变更注：i18n 键数判据随 v0.0.5 新增 2 键（`ribbon_sync_tooltip` / `settings_plugin_title`）由 167 更新为 **169**，实测三语言各 169 键、键集合完全一致；`settings_synconsave*` 仍为 0 命中】</u> <u>【v0.0.6 变更注：i18n 键数判据由 169 更新为 **167**（沿革：169 − 1（批次 B 删 `statusbar_sync_source_auto_sync_on_save`）+ 6（批次 C 新增 6 键：`plugin_display_name` / `syncstatus_running` / `synctriggersource_auto` / `synctriggersource_auto_once_init` / `synctriggersource_dry` / `synctriggersource_manual`）− 7（批次 D 删 7 键）= **167**）；实测三语言各 **167** 键、键集合完全一致；`settings_synconsave*` 仍为 0 命中】</u></u> |
| <u>AC20</u> | <u>**（A9）** 根 `LICENSE` 已删除失效的 `pro/` → PolyForm Strict License 条款，改为 Apache-2.0 + 派生自 remotely-save v0.5.25（Copyright fyears）声明</u> | <u>`grep -n "PolyForm\|pro" LICENSE` → 无 PolyForm 相关命中；文件中含 "Apache"、"remotely-save"、"fyears"</u> |
| <u>AC21</u> | <u>**（B1）** Obsidian 桌面版加载测试通过：manifest 校验通过、插件可启用无报错、设置页可渲染、ribbon 图标可见可点、命令面板出现 `start-sync` 与 `start-sync-dry-run`</u> | <u>Obsidian 内加载 `main.js` + `manifest.json`；开发者控制台无报错；命令面板搜索 `sync` 见 2 条命令</u> |
| <u>AC22</u> | <u>**（B2）** S3 真实连通性通过：设置页「检查连接」按钮 → HeadBucket + ListObjectsV2 均成功。<u>**凭证未到位时本条状态为「阻塞」，不计为通过**</u> <u>【v1.9 状态：⛔ 仍待老板本人实测（未完成）—— 需真实 cstcloud.cn 桶 + AccessKey / SecretKey，截至 v1.9 凭证仍未到位】</u></u> | <u>填入老板提供的 AccessKey / SecretKey / Bucket → 点击「检查连接」→ UI 提示成功且控制台无 S3 错误码</u> |
| <u>AC23</u> | <u>**（B3）** 双向同步 E2E 4 条用例全通过：① 本地新增 → 远端可见 ② 远端改动 → 本地拉取 ③ 删除双向同步 ④ 冲突处理策略按设置生效 <u>【v1.9 状态：⛔ 仍待老板本人实测（未完成）—— 需桌面端 + 移动端双端真实对拉，与 AC22 共享同一凭证阻塞】</u></u> | <u>Obsidian + 真实 bucket 逐条执行，每条记录远端对象列表与本地文件状态</u> |
| <u>AC24</u> | <u>**（B4）** 核心逻辑单测补齐：`src/sync.ts` / `src/copyLogic.ts` / `src/conflictLogic.ts` 关键路径行覆盖率 ≥ 70%，整体行覆盖率 ≥ 50%；`npm test` 全绿</u> | <u>`npm test` → 0 failing；覆盖率报告（c8 / nyc）核对三文件关键路径行覆盖率；<u>若 C1 已实施，测试须覆盖 §5.1.C 的 3 项行为等价性</u></u> |
| <u>AC25</u> | <u>**（B5）** 打包产物自检：`main.js` 含 `s3.cstcloud.cn`；不含 `dropbox` / `webdav` / `onedrive` / `pro/` / `qrcode` / `openssl` / `rclone` / `profiler` 关键字；含 6 个 `syncalgov3` 弹窗键</u> | <u>`grep -c "s3.cstcloud.cn" main.js` → ≥ 1；`grep -c "dropbox\|webdav\|onedrive\|qrcode\|openssl\|rclone\|profiler" main.js` → 0；`grep -c "syncalgov3" main.js` → 6；<u>中文文案在 `src/langs/zh_cn.json` / `zh_tw.json` 中核对（esbuild ascii 输出，main.js 内无中文字面量）</u></u> |
| <u>AC26</u> | <u>**（C1）** 加密后端确已移除：`src/fsEncrypt.ts` / `src/encryptOpenSSL.ts` / `src/encryptRClone.ts` / `src/encryptRClone.worker.ts` / `tests/encryptOpenSSL.test.ts` 均不存在；`src/` 内 `fsEncrypt` 引用为 0；`package.json` 不含 `@fyears/rclone-crypt`；<u>且 §5.1.C 的 3 项行为等价性成立（`keyEnc`/`sizeEnc` 填充、encryptEntity 等价替换、远端 openssl 密文中止守卫保留）</u></u> | <u>`ls src/fsEncrypt.ts src/encryptOpenSSL.ts src/encryptRClone.ts src/encryptRClone.worker.ts tests/encryptOpenSSL.test.ts` → 全部 No such file；`grep -rn "fsEncrypt\|FakeFsEncrypt" src/ tests/` → 0；`grep -n "rclone-crypt" package.json` → 0；`grep -rn "remote_encrypted_local_no_password\|MAGIC_ENCRYPTED_PREFIX" src/` → <u>仍有命中（守卫函数保留）</u>；`npm run build2` → exit 0</u> |
| <u>AC27</u> | <u>**（C2）** profiler 确已移除：`src/profiler.ts` 不存在；`src/` 内 `profiler` / `Profiler` 引用为 0（含 `baseTypes.ts` 的 `ProfilerConfig` 与悬空 i18n 键 `"profiler_results_exported_on_"`）</u> | <u>`ls src/profiler.ts` → No such file；`grep -rni "profiler" src/` → 0；`npm run build2` + `npm test` → exit 0</u> |
| <u>AC28</u> | <u>**（C3）** `src/sync.ts` 中 4 处 `serviceType === "dropbox"` 死分支已清理，仅保留 `serviceType === "s3"`</u> | <u>`grep -n "dropbox" src/sync.ts` → 仅命中 L1381 的历史沿革注释，<u>无 `serviceType === "dropbox"` 条件</u>；`npm run build2` → exit 0</u> |
| <u>AC29</u> | <u>**（C4）** devDependencies 残留已清理：`webdav-server` / `openapi-typescript` / `npm-check-updates` / `@types/chai` / `@types/chai-as-promised` / `esbuild-plugin-inline-worker` / `worker-loader` 已从 `package.json` 移除；<u>`dotenv` / `jsdom` / `@types/jsdom` 保留</u></u> | <u>`grep -n "webdav-server\|openapi-typescript\|npm-check-updates\|@types/chai\|esbuild-plugin-inline-worker\|worker-loader" package.json` → 0；`grep -n "\"dotenv\"\|\"jsdom\"" package.json` → 有命中；`npm run build2` + `npm test` → exit 0</u> |
| <u>AC30</u> | <u>**（C5）** i18n 复核完成：40 处死键已删（31 处直接删 + 9 处随 A8 删）；3 个 langs 文件键集合完全一致，各 <u>169 键</u> <u>【v0.0.6 变更注：键数判据由 169 更新为 **167**（v0.0.6 口径）；沿革：169 − 1（批次 B 删 `statusbar_sync_source_auto_sync_on_save`）+ 6（批次 C 新增 6 键）− 7（批次 D 删 7 键）= **167**，实测三语言各 167 键、键集合完全一致；上方「169」为 v1.9 历史判据，原样保留】</u></u> | <u>`python3 -c "import json;print(len(json.load(open('src/langs/en.json'))))"` 等 → 三个文件均输出 <u>169</u> <u>【v0.0.6：三个文件均输出 **167**】</u>；`grep -rn "settings_remoteprefix_s3\|settings_remotebasedir\|settings_s3_reverse_proxy_no_sign_url\|settings_debuglevel\|settings_obfuscatesettingfile\|settings_outputsettingsconsole\|settings_viewconsolelog\|protocol_callbacknotsupported" src/langs/` → 0；<u>`settings_protectmodifypercentage*` / `syncalgov3_*` / `settings_s3_prod*` 仍在（AC9 相关键不得误删）</u>。<u>计数沿革：Step 81（C5）复检时各 169 键 → AC19 收口（commit `31c7a30`）再删 2 个孤儿键（`settings_synconsave_disable` / `_enable`，源码 0 引用）→ 现各 167 键 <u>【v1.9 变更注：v0.0.5 新增 2 键 `ribbon_sync_tooltip` / `settings_plugin_title` → 现各 **169 键**，键集合仍完全一致】</u></u></u> |
| <u>AC31</u> | <u>**（发布）** v0.0.3 交付包形态符合 §7.1：含 `main.js` / `manifest.json` / `LICENSE` / `README.md`（+ `README.zh-cn.md` / `versions.json`），不含 `node_modules/` / `src/` / `tests/` / `manifest-beta.json`；<u>`versions.json` 含 `"0.0.3": "0.13.21"`</u></u> <u>（v1.7 发版口径：发布版本号为 0.0.3，0.0.2 为开发基线；本轮将由 M10（发布）执行产出 `cstcloud-sync0.0.3.zip`，目录层级 `cstcloud-sync/`，含 main.js / manifest.json / LICENSE / README.md / README.zh-cn.md / versions.json 共 6 个文件）</u> <u>【v1.9 变更注：v0.0.4 / v0.0.5 两轮发版后，当前发布版本号为 **0.0.5**，交付包为 `cstcloud-sync0.0.5.zip`（**312,048 字节** / md5 `3460177d84f8cafbd56d7c4a7462f969`），目录层级 `cstcloud-sync/`，含 `main.js`(1,043,853 B) / `manifest.json`(301 B) / `versions.json` / `README.md` / `README.zh-cn.md` / `LICENSE` 共 6 个文件；**§7.1 形态判据 11/11 通过**；`versions.json` 现有 5 条（`0.3.2` / `0.3.25` / `0.0.3` / `0.0.4` / `0.0.5`），含 `"0.0.5": "0.13.21"`。已上线为 Release `https://github.com/studynt47/cstcloud-sync/releases/tag/0.0.5`。上方 v0.0.3 历史判据文字原样保留】</u> <u>【v2.0 变更注：当前发布版本号 **0.0.6**；`versions.json` 追加 `"0.0.6": "0.13.21"` 后为 **6 条**（现状 **5 条** + 追加 1 条）；分发包 `cstcloud-sync0.0.6.zip` —— ⛔ **版本号推进与分发包产出尚未执行，待回填**；v0.0.5 的交付包事实原样保留】【v2.1 变更注：版本号推进 ✅ **已执行**（`4b8d6f6`，四处一致 `0.0.6`，`versions.json` 现 **6 条**，含 `"0.0.6": "0.13.21"`）；`main.js` ✅ **已重建**（`01b238d`，md5 `87fa862dc9abb869ecab1ba7eba4e2ab` / 1,038,403 字节）。⛔ **分发包 `cstcloud-sync0.0.6.zip` 尚未产出、线上 Release 未发布** —— 本条「交付包形态符合 §7.1」对 v0.0.6 **仍未通过**，不得记为已满足】【v2.2 变更注：该 ⛔ **已解除** —— v0.0.6 交付包形态**已通过**（**11/11**，与 v0.0.5 同一形态表，未新增 / 删减条目）：分发包 `cstcloud-sync0.0.6.zip` **310,804 字节** / md5 `122b6c075f6498e237c5779153a58b36`，目录层级 `cstcloud-sync/`，含 `main.js`(1,038,403 B) / `manifest.json`(301 B) / `versions.json`(136 B) / `README.md`(6,311 B) / `README.zh-cn.md`(5,743 B) / `LICENSE`(12,266 B) 共 **6 个文件**；`versions.json` **6 条**（`0.3.2` / `0.3.25` / `0.0.3` / `0.0.4` / `0.0.5` / `0.0.6`），含 `"0.0.6": "0.13.21"`；已上线为 Release `https://github.com/studynt47/cstcloud-sync/releases/tag/0.0.6`（tag `0.0.6` → commit `70bedbeb34ede0b10da961aa1b072f6ee70ba186`，draft=false、prerelease=false；assets：`cstcloud-sync0.0.6.zip`(310,804 B) / `main.js`(1,038,403 B) / `manifest.json`(301 B)）。上方 v2.1 变更注原文**原样保留】</u> | <u>解包 zip 逐文件核对；`cat versions.json` → 含 <u>`"0.0.3": "0.13.21"`</u> <u>（v1.9：同时含 `"0.0.5": "0.13.21"`）</u>；副本仅同步至 `/home/WPS/ls/cstcloud-sync/`，<u>不写 `/home/WPS/NEW/`</u></u> |
| <u>AC32</u> | <u>**✅ 已满足**（v1.7）：老板 2026-10-28 书面指定发布版本号 **0.0.3**；`manifest.json` / `package.json` / PRD §4.3 三处一致；分发包 `cstcloud-sync0.0.3.zip`。</u> <u>（原判据保留：发版前置——A/B/C 全部 Step（<u>59–82</u>）执行完毕并验收通过后，正式发版前必须由老板统一指定发布版本号（须 ≥ 0.0.3），且 manifest.json / package.json / PRD §4.3 三处版本号一致；未完成本条不得对外发布）</u> <u>【v1.9 变更注：当前发布版本号已推进至 **0.0.5**，`manifest.json` / `package.json` / `versions.json` / PRD §4.3 **四处一致**；线上 tag `0.0.3` / `0.0.4` / `0.0.5` 均已发布，最新 commit `f0a460cd3a9c8499b56185cda2e523761c4f730d`。本条「已满足」结论不变】</u> <u>【v2.0 变更注：当前发布版本号 **0.0.6**；`versions.json` 追加 `"0.0.6": "0.13.21"` 后为 **6 条**（现状 **5 条** + 追加 1 条）；分发包 `cstcloud-sync0.0.6.zip` —— ⛔ **版本号推进与分发包产出尚未执行，待回填**；v0.0.5 的「已满足」结论原样保留】【v2.1 变更注：版本号推进 ✅ **已实测确认四处一致为 `0.0.6`**（commit `4b8d6f6`：`manifest.json` / `package.json` / `package-lock.json` root 与 `packages[""]` / `versions.json` / PRD §4.3；`versions.json` **6 条**，含 `"0.0.6": "0.13.21"`；`package-lock.json` 中 `"0.0.5"` 命中 **0**）。⛔ **v0.0.6 分发包尚未产出、线上 Release 未发布** —— v0.0.6 的「已满足」结论**尚未成立**，不得据此对外发布】【v2.2 变更注：该 ⛔ **已解除** —— v0.0.6 **已满足**：版本号 **五处一致为 `0.0.6`**（`manifest.json` / `package.json` / `package-lock.json`（root `version` 与 `packages[""]` `version` 各一处）/ `versions.json` / PRD §4.3），`versions.json` **6 条**（含 `"0.0.6": "0.13.21"`）；分发包 `cstcloud-sync0.0.6.zip` **310,804 字节** / md5 `122b6c075f6498e237c5779153a58b36` **已产出**；线上 Release `https://github.com/studynt47/cstcloud-sync/releases/tag/0.0.6` **已发布**（tag `0.0.6` → commit `70bedbeb34ede0b10da961aa1b072f6ee70ba186`，draft=false、prerelease=false）。本条「已满足」结论**自 v2.2 起对 v0.0.6 成立**。上方 v2.1 变更注原文**原样保留**】</u> | <u>老板书面确认 + grep 三处版本号一致 <u>（v1.9：四处一致，含 `versions.json`）</u></u> |
| <u>AC33</u> | <u>**（v1.4 · 配置目录同步（实验性））** ① `syncConfigDir` 开关可在 `设置 → 高级` 正常开启（走 `modal_syncconfig_attn` → `modal_syncconfig_secondconfirm` → `modal_syncconfig_notice` 三键二次确认链路）；② 开启后 `.obsidian` **整个配置目录**进入同步清单（顶层 `app.json` / `appearance.json` / `core-plugins.json` / `community-plugins.json` / `hotkeys.json` / `bookmarks.json` 与各插件目录均可见）；③ §5.4.3 的 14 项排除项**确实被排除**（尤其 `workspace` / `workspace.json` / `workspace-mobile.json` / `.git` / `node_modules`）；④ 本插件目录 `.obsidian/plugins/cstcloud-sync/` **只同步白名单 5 文件**（`data.json` / `main.js` / `manifest.json` / `.gitignore` / `styles.css`），`plugins/cstcloud-sync/LICENSE` **不被同步**；⑤ 其他插件目录为全量放行</u> | <u>在测试 vault 中开启开关并执行一次 dry-run（`start-sync-dry-run`），逐条比对同步清单：① 开关 UI 链路可走通 ② `.obsidian` 顶层文件均在清单内 ③ 14 项排除项均不在清单内 ④ 本插件目录仅 5 文件在清单内、`LICENSE` 不在 ⑤ 其他插件目录文件均在清单内。<u>另：`grep -n "workspace-mobile.json" src/obsFolderLister.ts` 命中 2 处（Step 82 已实施）</u> <u>【v1.9 状态：⛔ 仍待老板本人实测（未完成）—— 需真实桶 + 开启「同步配置文件夹」开关后执行一次 dry-run。**v0.0.4 修复移动端守卫块边界后，移动端该开关已恢复可见（见 AC34），实测条件已具备**，但仍缺真实桶与凭证】</u></u> |

<u>**v1.9 新增验收项：AC34 / AC35**（对应已实施并已上线的 v0.0.4 / v0.0.5 两轮）。v1.9 的新增条目自 **AC34** 起编号，AC1–AC33 全部保持不变；既有条目的判据文字原样保留，仅在必要处加 v1.9 变更注。</u>

<u>**v2.0 新增验收项：AC36 / AC37**（对应 v0.0.6 的 **D1 界面与能力一致** 与 **用户可见文案 i18n**）。v2.0 的新增条目自 **AC36** 起编号，**AC1–AC35 全部保持不变**；既有条目的判据文字原样保留，仅在必要处加 v0.0.6 变更注。</u>

| ID | AC | 验证方式 |
|---|---|---|
| <u>AC34</u> | <u>**（v0.0.4 · 移动端设置项可见性）** ① 移动端从 GitHub 安装后，`设置 → 高级` 区域**完整可见**，下列 **9 项**均能正常显示与操作：同步配置文件夹（`settings_configdir`）/ 同步书签（`settings_bookmarks`）/ 并发数（`settings_concurrency`）/ 同步下划线文件（`settings_syncunderscore`）/ 删除到哪（`settings_deletetowhere`）/ 冲突处理（`settings_conflictaction`）/ 保护修改百分比（`settings_protectmodifypercentage`）/ 保护修改百分比(自定义)（`settings_protectmodifypercentage_customfield`）/ 同步方向（`setting_syncdirection`）；② `src/settings.ts` 的 `if (!Platform.isMobileApp)` 块收回到 **376→389 行（14 行）**，其内**只含** `settings_enablestatusbar_info`（本项目无 upstream 的 `settings_resetstatusbar_time`），`advDiv` 及其下属 9 项**均在守卫之外**；③ 上述 9 项**不含任何桌面专属 API 依赖**，在移动端功能上完全可用（`syncConfigDir` 在 `src/sync.ts` 为纯路径判断，与平台无关）；④ 移动端**仅**自定义状态栏项（`settings_enablestatusbar_info`）保持禁用，与 upstream 设计一致 <u>【v0.0.6 变更注（D1）】① 移动端高级设置区可见项由 **9 项减为 8 项**（删除「删除到哪」，其 Setting 与 4 个 i18n 键已删）；② `src/settings.ts` 的 `if (!Platform.isMobileApp)` 守卫块**已整体移除**（其内唯一项 P1-5 已删），`Platform` import 同步移除，桌面端与移动端设置项完全一致；③ AC34 原文作为 **v0.0.4 的历史判据原样保留不改**</u> | <u>① 编译产物经 **AST 解析**（acorn）确认移动端守卫区间由 **5,448 字符缩至 347 字符**，且 `settings_configdir` 位于守卫外 —— **禁止用字符串 grep 判定守卫边界**（见 §8 R18）② `npm test` → **142 passing / 0 failing** ③ `tsc --noEmit` → **0 error** ④ `npm run build2` → **exit 0** ⑤ `git diff -w` 验证唯一非空白改动为大括号位置，设置项内部逻辑一字未改 ⑥ 移动端真机安装 v0.0.4 后逐项肉眼核对设置页 9 项可见（**⛔ 该真机项仍待老板本人实测**）</u> |
| <u>AC35</u> | <u>**（v0.0.5 · 品牌口径统一与链接有效性）** ① 执行主体口径全仓统一为「聚沄同步 / juiyun sync」：ribbon tooltip（`src/main.ts:462`）与设置页标题（`src/settings.ts:125`）**均走 i18n**，不再有硬编码中文；② 新增 2 个 i18n key —— `ribbon_sync_tooltip` 与 `settings_plugin_title`，三语言取值分别为 en `juiyun sync` / zh_cn `聚沄同步` / zh_tw `聚沄同步`；③ `syncalgov3` 系列品牌字样已统一（`syncalgov3_title` 与 `syncalgov3_texts` 欢迎语）；④ `syncalgov3_texts` 三语言各 2 处、共 **6 处** GitHub 链接指向 `https://github.com/studynt47/cstcloud-sync` 且**实测可访问（HTTP 200）**，旧地址 `https://github.com/cstcloud/cstcloud-sync` 出现 **0 次**（实测 HTTP 404）；⑤ 链接**锚文本未动**；⑥ 明确不动：README 标题 / `manifest.json` 的 `id`·`name` / `cstcloud.cn`·`s3.cstcloud.cn` 域名；⑦ 三语言 json 键集合**完全一致**，各 **169 键** <u>【v0.0.6 变更注：本条为 v0.0.5 历史判据，原样保留；键数演进见 AC19 / AC30 与 AC36 / AC37】</u> | <u>① `grep -n "ribbon_sync_tooltip" src/main.ts` → 命中 `t("ribbon_sync_tooltip")`；`grep -n "settings_plugin_title" src/settings.ts` → 命中 `t("settings_plugin_title")` ② `python3 -c "import json;print(len(json.load(open('src/langs/en.json'))))"` 等 → 三个文件均输出 **169**，键集合完全一致 ③ `grep -o "github.com/cstcloud/cstcloud-sync" src/langs/*.json \| wc -l` → **0**；`grep -o "github.com/studynt47/cstcloud-sync" src/langs/*.json` → **每文件 2 次** ④ `curl -sI https://api.github.com/repos/studynt47/cstcloud-sync` → **HTTP 200**；`.../repos/cstcloud/cstcloud-sync` → **HTTP 404** ⑤ 产物 `main.js` 内「聚沄同步」**8 次**、「juiyun sync」**4 次** ⑥ `npm test` → **142 passing / 0 failing**；`npm run build2` → **exit 0**</u> |
| <u>AC36</u> | <u>**AC36 ·（v0.0.6 · D1 界面与能力一致）** ① `src/settings.ts` 设置页**不再出现**「在状态栏显示上一次成功的同步」开关（`settings_enablestatusbar_info`）与「删除文件到哪里」下拉（`settings_deletetowhere`）；② 桌面端与移动端**均无** `if (!Platform.isMobileApp)` 守卫块，`src/settings.ts` 中 `Platform` 导入为 0；③ 状态栏**恒显示**上次成功同步时间（`enableStatusBarInfo` 由 `loadSettings()` 强制为 `true`）；④ 同步删除本地文件**恒走系统回收站**（`deleteToWhere` 强制为 `"system"`）；⑤ 三语言 `settings_enablestatusbar_*`（3 键）与 `settings_deletetowhere_*`（4 键）共 7 键**已删除**；⑥ `src/main.ts` 中 `loadSettings()` 的 6 项强制覆盖**一行未改**</u> | <u>① `grep -n "settings_enablestatusbar\|settings_deletetowhere" src/settings.ts src/langs/*.json` → 0 命中 ② `grep -n "Platform" src/settings.ts` → 0 命中 ③ `npm test` → 142 passing ④ `tsc --noEmit` → 0 error ⑤ `npm run build2` → exit 0 ⑥ 编译产物经 **AST 解析**确认 `settings.ts` 内不再存在 `Platform.isMobileApp` 守卫（**禁止用字符串 grep 判定**，见 §8 R18）<u>【v2.1 变更注：**产物已重建**（commit `01b238d`，`npm run build2`）—— 产物经 **AST 解析（acorn）**确认 `MemberExpression.isMobileApp` 命中 **0**；同法解析旧产物（`c97a7ca`）对照命中 **1**（`Ye.Platform.isMobileApp`），证明守卫**有效、非假阴性**。`npm test` → **142 passing / 0 failing**、`tsc -noEmit -skipLibCheck` → **exit 0**、`npm run build2` → **exit 0** 三项**均为实测已通过**。⛔ **真机验收类判据仍未完成**】</u></u> |
| <u>AC37</u> | <u>**AC37 ·（v0.0.6 · 用户可见文案 i18n）** ① 同步中 / 同步结束 / 「已在运行」三类提示中**不出现**英文仓库 id `cstcloud-sync`；② `src/main.ts` 中 `this.manifest.name` 引用为 **0**；③ 新增 i18n 键 `plugin_display_name`（en `juiyun sync` / zh_cn `聚沄同步` / zh_tw `聚沄同步`）与 `syncstatus_running`（en `running` / zh_cn `运行中` / zh_tw `執行中`）；④ `manifest.json` 的 `id` / `name` **保持 `cstcloud-sync` 不变**（红线）<u>【v2.1 实测确认：批次 6（`4b8d6f6`）逐字段比对，红线字段 `id`(`cstcloud-sync`) / `name`(`cstcloud-sync`) / `description` / `author` / `authorUrl` / `minAppVersion`(0.13.21) / `isDesktopOnly` **一字未改**】</u>；⑤ 品牌三键 `ribbon_sync_tooltip` / `settings_plugin_title` / `plugin_display_name` 在**每种语言中取值完全一致**；⑥ **✅ 已实测**：重建后产物 `main.js` 内品牌计数 —— 大写 `\u805A` = **28** / `juiyun sync` = **14**，**与 v2.0 预测值完全一致（差值 0）**；统计口径为**大写** `\uXXXX` 转义形式（esbuild 将 JSON 内联为 ASCII 转义，UTF-8 直写「聚沄同步」命中恒为 **0**、小写 `\u805a` 命中恒为 **0**，直接 grep 中文字符会误判为「文案没进产物」）；重建前对照值为 `\u805A` = **8** / `juiyun sync` = **4** / `Remotely Save` = **31** / `cstcloud-sync` = **7**，重建后为 **28** / **14** / **4** / **6**；⑦ **⛔ 待老板真机实测**：桌面端跑完一次同步后 ribbon tooltip 仍为「聚沄同步」；移动端「未跑同步 / 跑完同步」两态一致<u>【v2.1 状态：⛔ **仍未完成** —— 无任何真机实测依据，不得记为通过】</u>；⑧ 验收口径为「**取值一致**」，而非「两端渲染完全相同」——Obsidian 桌面端与移动端对同一属性的**读取时机**存在平台差异，该差异本机无法验证</u> | <u>① `grep -n "this.manifest.name" src/main.ts` → 0 ② 三语言键集合完全一致、各 **167** 键 ③ `npm test` → 142 passing ④ `npm run build2` → exit 0 ⑤ 逐语言核对 `plugin_display_name` / `syncstatus_running` / `ribbon_sync_tooltip` / `settings_plugin_title` 取值三语言一致 ⑥ ✅ **已实测通过**：重建后 `grep -o '\u805A' main.js \| wc -l` → **28**、`grep -o 'juiyun sync' main.js \| wc -l` → **14**，与 v2.0 预测值**完全一致（差值 0）**（**必须按大写 Unicode 转义形式统计，禁止直接用中文字符 grep**——esbuild 产物内为转义形式，小写 `u805a` 命中恒为 0，UTF-8 直写「聚沄同步」命中恒为 0）⑦ ⛔ 真机：桌面端 / 移动端同步前后 tooltip 肉眼核对 ⑧ ✅ **已实测**：`main.js` **重建后** MD5 = `87fa862dc9abb869ecab1ba7eba4e2ab`、**1,038,403 字节**（重建前 md5 `26105bde8e16815ead12167f12afa42c` / 1,043,812 字节，字节差 **−5,409** —— 重建前值仅为**沿革**，**非**重建后口径）<u>【v2.1 补充实测：`npm test` → **142 passing / 0 failing**；`npx tsc -noEmit -skipLibCheck` → **exit 0**（无输出）；`npm run build2` → **exit 0**】</u></u> |
| <u>（编号映射说明）</u> | <u>**v2.0 编号映射（供与勘察报告对账）**：技术勘察报告 `_pm_survey_2026-11-13-tooltip.md` 中出现的临时编号「AC36 / AC37」是**定稿前的临时占位**，在 v2.0 定稿中的映射为：**品牌三键逐语言取值完全一致** + **产物层与真机项 ⑤⑥⑦** → 归入 **AC37**（文案 i18n 条目）；**界面与能力一致（设置页不再出现状态栏开关与「删除到哪」下拉、状态栏恒显示、删除恒走系统回收站）** → 归入 **AC36**</u> | <u>避免两份文档编号对不上</u> |
