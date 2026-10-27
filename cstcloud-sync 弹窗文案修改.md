# 老板拍板 A+ 简化文案 - cstcloud-sync 弹窗文案修改

**来源**: pm Agent (Feishu 卡片消息)
**发送时间**: 2026-10-17 10:44 GMT+8
**消息标题**: pm

---

## 一、修改位置总览

**只改 2 个 i18n 文件**（不需要改 `src/syncAlgoV3Notice.ts`，因为它通过键读取文案，键不变，结构不变）。

| 文件 | 弹窗相关键的行号 |
| -------- | -------- |
| `src/langs/en.json` | 191-196（6 键） |
| `src/langs/zh_cn.json` | 191-196（6 键） |

## 二、6 键逐一说明（精确行号 + 原文 + 新文）

### 键 1：（弹窗 标题）

| 文件 | 行号 | 原文 | 新文（推荐） |
| -------- | -------- | -------- | -------- |
| `en.json` | 191 | `Remotely Save has HUGE updates on the sync algorithm` | `cstcloud-sync: Sync Algorithm Notice` |
| `zh_cn.json` | 191 | `Remotely Save 的同步算法有重大更新` | `cstcloud-sync 同步算法说明` |

**改因**：fork 后产品名错位（原"Remotely Save"→"cstcloud-sync"），语气从"重大更新"软化为"说明"（因为 cstcloud-sync v0.0.1 是新基线，不是"协议变更"）。

### 键 2：（弹窗正文 列表，最长一段）

| 文件 | 行号 | 原文核心问题 | 新文（推荐） |
| -------- | -------- | -------- | -------- |
| `en.json` | 192 | 6 条上游特性介绍 + 2 个 GitHub 链接 | 精简为 4 条 cstcloud-sync 特性 + 1 个占位链接 |
| `zh_cn.json` | 192 | 同上 | 同上 |

**新文（zh_cn 推荐版）**：

```
欢迎使用 cstcloud-sync！
本插件基于 S3 / S3 兼容协议（默认 cstcloud.cn）双向同步您的笔记：
- 更稳健的删除同步
- 最小化冲突处理
- 不强制上传元数据
- 删除/修改保护

详细说明请参阅[项目主页](https://github.com/cstcloud/cstcloud-sync)。
如果您同意使用本插件，请阅读和勾选两个勾选框，然后点击"同意"按钮。
如果您不同意，请点击"不同意"按钮，插件将自动停止运行（unload）。
```

**关键修改**：
- "Remotely Save" → "cstcloud-sync"
- 6 条特性 → 4 条（删"备份模式""新加密方式"——cstcloud-sync v0.0.1 未启用）
- 2 个 GitHub 链接 → 1 个占位 `https://github.com/cstcloud/cstcloud-sync`（老板若未建 repo，可换 `#` 或删 `<a>` 标签）
- 删"buy me a coffee""star ⭐"等捐赠/导流语（fork 不沿用上游商业呼吁）

### 键 3：（复选框 1）— 保留

| 文件 | 行号 | 原文 | 新文 |
| -------- | -------- | -------- | -------- |
| `en.json` | 193 | `I will backup my vault manually firstly.` | **不改**（已贴合场景） |
| `zh_cn.json` | 193 | `我将会首先手动备份我的库（Vault）。` | **不改** |

**改因**：复选框 1 "我已手动备份"是合理安全门槛，保留。

### 键 4：（复选框 2）— 改文案贴合单 S3 场景

| 文件 | 行号 | 原文 | 新文（推荐） |
| -------- | -------- | -------- | -------- |
| `en.json` | 194 | `I understand I need to update the plugin ACROSS ALL DEVICES to make them work properly.` | `I understand the sync only supports the S3 protocol and the default endpoint is s3.cstcloud.cn.` |
| `zh_cn.json` | 194 | `我理解，我需要在所有设备上都更新此插件使之正常运行。` | `我理解，本插件仅支持 S3 / S3 兼容协议，默认端点为 s3.cstcloud.cn。` |

**改因**：
- 原复选框 2 "我需要在所有设备上更新"——单 S3 服务场景下没意义（不需要多设备协调升级）
- 新复选框 2 改为"我理解仅支持 S3 协议 + 默认端点 cstcloud.cn"——把 fork 的核心约束**前置到用户首次启动确认**，减少后续客诉

### 键 5：（同意按钮）

| 文件 | 行号 | 原文 | 新文 |
| -------- | -------- | -------- | -------- |
| `en.json` | 195 | `Agree` | **不改**（"Agree" 简洁通用） |
| `zh_cn.json` | 195 | `同意` | **不改** |

### 键 6：（不同意按钮）

| 文件 | 行号 | 原文 | 新文 |
| -------- | -------- | -------- | -------- |
| `en.json` | 196 | `Do Not Agree` | **不改** |
| `zh_cn.json` | 196 | `不同意` | **不改** |

## 三、不需要改的位置

| 文件 | 行号 | 原因 |
| -------- | -------- | -------- |
| `src/syncAlgoV3Notice.ts` 全文（128 行） | — | TS 文件**只引用 i18n 键**，不改键就无需改 TS |
| `src/main.ts:570-578`（弹窗触发） | — | 触发逻辑不变 |
| `src/main.ts:903-907`（同意后行为） | — | 行为不变 |
| `src/main.ts:66, 631-633`（`agreeToUseSyncV3` 默认值/兼容） | — | 数据结构不变 |

## 四、关键提示

⚠️ **复选框逻辑代码**（`syncAlgoV3Notice.ts:55-103`）**保持不变**——`agreeBtn` 仍需 2 个 checkbox 都勾选才解锁。这是上游设计的安全门。

⚠️ **若老板不想改复选框 2 文案**（只想改名字），**可降级为"仅改 5 键"**（删键 4 那一行，复选框 2 仍显示原文，但其他 5 键全改 cstcloud-sync 口径）—— 但这等于"半改"，不推荐。

## 五、GitHub 链接占位

老板拍的"链到空路径或占位"——给 3 个备选：

| 选项 | 链接 | 适用 |
| -------- | -------- | -------- |
| 占位 | `https://github.com/cstcloud/cstcloud-sync` | 老板后续会建 repo（推荐） |
| 空锚 | `#` | 老板明确不要外链（最简） |
| 老板指定 URL | `<老板给的实际 URL>` | 老板已建好 repo |

---

## 待老板确认

1. **6 键新文案是否采纳**？（尤其键 2 正文 + 键 4 复选框 2 的措辞）
2. **GitHub 链接用占位/空锚/老板指定？**

确认后我立刻走 PRD v1.1 修订流程。

---

*Agent: pm | Model: MiniMax-M3 | Provider: minimax*
