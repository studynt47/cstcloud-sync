# 《.obsidian 配置目录同步（实验性）》操作指引

> 配套文档：PRD v1.4 §5.4（技术依据）、§8 R17（风险）
> 版本：v1.0 ｜ 生成时间：2026-10-27 ｜ 适用插件版本：cstcloud-sync 0.0.2
> **本指引只描述「怎么开、怎么验、怎么退」，不重复 PRD 的技术细节。**

---

## 0. 一句话结论

打开这个开关 = **你的整个 `.obsidian` 配置目录开始往 bucket 上传**（排除项除外），
包括**其他插件的配置文件**。其中可能含明文 API Key。**没有排除单个文件的能力。**

---

## 1. 开启前必做 3 件事（**一条都不能跳**）

### ✅ 1.1 bucket 必须是私有的 + 开了服务端加密

本插件 v0.0.2 **已彻底移除端到端加密能力**（PRD v1.3 Step 75-77 / R11）。
`.obsidian` 里的内容会以**明文**落到对象存储。

→ 去 cstcloud.cn 控制台确认：桶访问权限 = 私有；并开启服务端加密。

### ✅ 1.2 人工清点 `.obsidian` 内的敏感凭据

插件**不会**帮你排除任何东西，所以这一步只能靠人。

```bash
# 看所有插件的 data.json（最容易藏凭据的地方）
ls -la /root/e2e/cstcloud-sync-vault/.obsidian/plugins/*/data.json

# 逐个找疑似密钥（只打印文件名，不打印内容，避免二次泄露）
grep -l -iE "api[_-]?key|secret|token|password|apikey" \
  /root/e2e/cstcloud-sync-vault/.obsidian/plugins/*/data.json
```

**已知实测结果**：本机测试 vault 的 `.obsidian/plugins/claudian-mobile-jy/data.json`
内含**明文 API Key**。开启后它会直接进 bucket。

→ 发现的每一个，看你要不要：
- **移到别处**（最推荐，治本）
- **接受它进 bucket**（那 bucket 必须私有 + 加密 + 你自己知道）
- **不开启这个开关**

### ✅ 1.3 先在测试 vault 试，不要在主 vault 上直接开

测试 vault：`/root/e2e/cstcloud-sync-vault`
先在这里走完全流程，确认没问题再考虑主 vault。

---

## 2. 开启步骤

1. Obsidian 打开 vault → 左下齿轮 **设置**
2. 左侧栏选 **高级**
3. 找到 **「同步配置文件夹（实验性质）」**（下拉框，默认 `禁用`）
4. 下拉切到 `启用` → **弹出风险告知弹窗**，内容大意：
   > 此设置只同步（复制）整个 Obsidian 的配置文件夹……各插件的设置或许会出错，
   > 且 Obsidian 或许需要重启来重载各插件的新配置。如果您同意自行承受以上风险……
5. 点 **「再次确认开启」**（不是「返回」）→ 弹「您已开启配置目录的同步！」
6. **重启 Obsidian**（必须 —— 各插件要重载新配置）

---

## 3. 怎么验证「真的生效了」

### 3.1 静态验证（不碰网络，随时可做）

```bash
# 开关确实打开
grep -o '"syncConfigDir":[a-z]*' /root/e2e/cstcloud-sync-vault/.obsidian/plugins/cstcloud-sync/data.json
# 期望： "syncConfigDir":true
```

### 3.2 清单验证（dry-run，看同步清单对不对）

插件里有 `start-sync-dry-run` 能力。跑一次 dry-run，然后核对清单里：

| 应当**出现** | 应当**不出现** |
|---|---|
| `.obsidian/app.json` | `.obsidian/workspace.json` |
| `.obsidian/appearance.json` | `.obsidian/workspace-mobile.json`（Step 82 修完后） |
| `.obsidian/core-plugins.json` | `.obsidian/workspace/` |
| `.obsidian/community-plugins.json` | `.obsidian/plugins/cstcloud-sync/LICENSE` |
| `.obsidian/plugins/<别的插件>/**` | `.git/`、`node_modules/` |

**关键一条**：本插件目录 `.obsidian/plugins/cstcloud-sync/` **只同步 5 个文件**
（`data.json`、`main.js`、`manifest.json`、`.gitignore`、`styles.css`），
**但其他插件目录是全量放行**的。

> ⚠️ 3.2 的 dry-run 属于**真实环境测试**，由**老板本人执行**。
> PM 与子代理不代跑（`Step 70 / 71` 口径同此）。

---

## 4. 出了问题的处置

| 症状 | 原因 | 处置 |
|---|---|---|
| 同步面板列出 `.obsidian` 里一堆配置 | 开关开了 | 正常行为 |
| 某插件配置错乱 / 读不出来 | 桌面与移动端配置互相覆盖 | 关掉开关 → 重启 Obsidian → 手工修配置 |
| `workspace-mobile.json` 天天冲突 | 移动端布局文件被同步 | **已由 Step 82 修复**（插件升到含该修复的版本即消失） |
| 某插件 `data.json` 里的 key 泄露了 | 无法排除单个文件 | **立即轮换该 key** → 关开关 → 清理 bucket 内已上传对象 → 再开 |
| 同步变慢 / 冲突变多 | `.obsidian` 文件多且频繁变动 | 评估是否值得长期开启 |

---

## 5. 怎么回滚（**30 秒**）

1. `设置 → 高级 → 「同步配置文件夹（实验性质）」` → 切回 **`禁用`**
2. **重启 Obsidian**
3. 已上传到 bucket 的 `.obsidian` 对象**不会自动删除** → 需要手动清理 bucket 内对应路径
   （或用另一个 vault 反向同步覆盖回来）

---

## 6. 常见问题

**Q：能不能只同步插件目录，不同步整个 `.obsidian`？**
A：**不能。** 开关是全有全无的。PRD v1.4 §5.4.2 已写明：`syncConfigDir` 开启时
`.obsidian` 内**所有**路径都被强制放行（`src/sync.ts:207-233`）。

**Q：能不能排除某个插件的 `data.json`？**
A：**不能。** `ignorePaths` / `onlyAllowPaths` 已被 `src/main.ts:593-597` 从设置里删除，
用户侧**没有任何**微调手段。→ 这就是 R17（等级：高）。

**Q：和「同步书签」开关冲突吗？**
A：`syncConfigDir` 开启时，`syncBookmarks` 分支不生效；两者**不要同时开**。

**Q：加密后同步内容会被加密吗？**
A：**不会。** 端到端加密已在 v0.0.2 移除（R11，不可逆）。只有 bucket 的服务端加密兜底。

---

## 7. 相关文档

| 文档 | 位置 |
|---|---|
| PRD v1.4（技术依据 §5.4 / 风险 R17 / Step 82 / AC33） | `PRD.md` |
| 交付报告（实施状态） | `delivery/DELIVERY_REPORT.md` |
| 本指引 | `GUIDE_config-dir-sync.md` |
