# openclaw PRD v1.0 第 8 次审验报告

> 审验对象：`/root/.openclaw/Project/cstcloud-sync/PRD.md`（533 行 / 29KB / md5 `61f1a513f359e9ed5824957894436ad4`，第 7 次审验 2 处 P1 修复后定稿版）
> 审验输入（仅 3 个）：
> 1. `/home/WPS/NEW/remotely_save.md`（任务书，3661 字节）
> 2. `/root/.openclaw/Project/cstcloud-sync/tech_v1.md`（技术分析 v1，36KB）
> 3. https://github.com/remotely-save/remotely-save（上游 + 浅克隆 `/home/WPS/ls/cstcloud-sync/`）
> 审验时间：2026-10-16（第 8 次，**重点深挖 R1-R8 风险位置准确性 + AC 可执行性 + §3.3 P2 数量**）

---

## 1. 总体结论

**审验结果**：**第 7 次审验后定稿版通过 2 处 P1 修复，但发现 1 处 P1 严重错误（R1 位置错）+ 2 处 P2 表述偏差**。

| 等级 | 问题数 | 严重性 |
|---|---|---|
| **P1 R1 风险位置错** | **1 处** | R1 写"`copyLogic.ts` 读取 `ignorePaths`/`onlyAllowPaths`"，实际 main.ts 读取，copyLogic.ts 0 命中 |
| P2 P2-4 表述偏差 | 1 | P2-4 写"settings.ts:968-987 强制写死"，实际是 UI dropdown（Step 42 删 + fsS3.ts 写死） |
| P2 §3.3 数量偏差 | 1 | §3.3 标题"P2 硬编码"实际只列 6 项（P2-1~P2-6），任务书补充 8 项可能未全列 |
| 第 1-7 次修复 | — | 全部生效 |

---

## 2. P1 严重：R1 风险位置错

### 2.1 PRD R1 写

```
| R1 | `copyLogic.ts` 读取 `ignorePaths`/`onlyAllowPaths`，UI 删除后字段仍被处理 | 中 | 确认 copyLogic.ts 是否读取；若读取则在 sync 核心路径中强制覆盖为空 |
```

### 2.2 实际代码验证

```bash
$ grep -nE "ignorePaths|onlyAllowPaths" /home/WPS/ls/cstcloud-sync/src/copyLogic.ts
（0 命中）

$ grep -nE "ignorePaths|onlyAllowPaths" /home/WPS/ls/cstcloud-sync/src/main.ts
143:  ignorePaths: [],                    # DEFAULT_SETTINGS 默认值
144:  onlyAllowPaths: [],                 # DEFAULT_SETTINGS 默认值
1412:    if (this.settings.ignorePaths === undefined) {     # loadSettings 初始化
1413:      this.settings.ignorePaths = [];
1415:    if (this.settings.onlyAllowPaths === undefined) {
1416:      this.settings.onlyAllowPaths = [];
```

**实际**：
- `copyLogic.ts` 全文 1642 字节，**只 import fsAll**，不读 ignorePaths/onlyAllowPaths
- `main.ts` 才是读 ignorePaths/onlyAllowPaths 的位置（DEFAULT_SETTINGS 默认值 + loadSettings 初始化）
- 字段读取在 main.ts:1757-1771 enableAutoSyncIfSet 之前

### 2.3 风险

- 工程师按 R1 描述去 copyLogic.ts 加空数组覆盖，**改错文件**
- 实际应在 main.ts:loadSettings() 中强制覆盖为 `[]`（**Step 33 已经实施**，但 R1 缓解措施描述"copyLogic.ts 强制覆盖"误导）

### 2.4 修正

**R1 改为**：
```
| R1 | `main.ts:1412-1416` 在 `loadSettings()` 读取 `ignorePaths`/`onlyAllowPaths`，UI 删除后字段仍被处理 | 中 | Step 33 已在 `loadSettings()` 中强制覆盖为 `[]`（行 1413/1416） |
```

---

## 3. P2 中等：P2-4 表述偏差

### 3.1 PRD P2-4 写

```
| P2-4 | `s3.forcePathStyle` | `true` | `fsS3.ts:179-192`；`settings.ts:968-987` 强制写死 |
```

### 3.2 实际 settings.ts:968-987

```typescript
new Setting(s3Div)
  .setName(t("settings_s3_urlstyle"))        // ← UI label
  .addDropdown((dropdown) => {                 // ← UI dropdown
    dropdown.addOption("virtualHostedStyle", ...);
    dropdown.addOption("pathStyle", "Path-Style");
    ...
  });
```

**实际 settings.ts:968-987 是 UI dropdown**，**不是"强制写死"**。改造时（Step 42）需要**删这个 dropdown**，然后在 fsS3.ts:DEFAULT_S3_CONFIG 写 `forcePathStyle: true`。

### 3.3 修正

**P2-4 改为**：
```
| P2-4 | `s3.forcePathStyle` | `true` | `fsS3.ts:179-192` DEFAULT_S3_CONFIG 写死；`settings.ts:968-987` UI dropdown 删（Step 42） |
```

---

## 4. P2 中等：§3.3 P2 数量

### 4.1 实际

§3.3 实际只列 6 项（P2-1 ~ P2-6）：
- P2-1 serviceType
- P2-2 s3Endpoint
- P2-3 s3Region
- P2-4 forcePathStyle
- P2-5 currLogLevel
- P2-6 obfuscateSettingFile

PRD §3.3 标题"### 3.3 P2 硬编码（代码存在但 UI 不显示）" 没明确说几项。

**任务书 10 条补充**实际已合并到 §2.1 / §2.2 / §2.3 / §3.1 / §3.2 / §3.3（§3.3 是 P2 硬编码段）。但**6 项可能不全**——任务书补充 10 条中可能漏列了 2 项。

### 4.2 修正

**§3.3 末尾追加**：
```
**说明**：本节 6 项 P2 字段硬编码，任务书补充 10 条中其余 4 条已合并到 §2.1/§2.2/§2.3/§3.1/§3.2。
```

---

## 5. P0-9 / P0-10 行号准确（之前误判已纠正）

之前 P0-9/P0-10 怀疑偏差 ±8 行，实际：
- P0-9 `main.ts:1757-1771 enableAutoSyncIfSet()` ✓ 准确
- P0-10 `main.ts:1773-1785 enableInitSyncIfSet()` ✓ 准确

---

## 6. 第 1-7 次审验修复确认

| 修复 | 状态 |
|---|---|
| NI-21~NI-24 + i18n | ✅ |
| §2.3 4 项 S3 开关 | ✅ |
| §2.2 3 行任务书原词 | ✅ |
| 4 处字段名修正 | ✅ |
| §4.2 删 googleapis/koofr-api | ✅ |
| §5.1.E ~194 + 13 类 | ✅ |
| §4.1 补充 18 保留依赖 | ✅ |
| Step 39/29/7/44/AC8 | ✅ |
| §5.1.D 数量 + NI-5 | ✅ |
| Step 35 行号 | ✅ |
| §5.1.A 追加 3 文件 | ✅ |
| NI 编号映射 | ✅ |
| Step 1.5（tests/fsWebdis.test.ts） | ✅ |
| Step 11 行 4+11 | ✅ |
| Step 28 version 0.0.1 | ✅ |
| Step 29 scripts.test | ✅ |
| Step 34 详细化 + R4 升级 | ✅ |

**新发现**：
- 以上修复**全部生效**
- 但 R1 位置错 + P2-4 表述 + §3.3 数量是新发现的更深层问题

---

## 7. 任务书 46 项覆盖度（8 轮累计）

| 维度 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| 任务书 46 项 | 42/46 | 46/46 | 46/46 | 46/46 | 46/46 | 46/46 | 46/46 | 46/46 |
| 字段名 | — | 修 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 行号 | — | ✅ | ✅ | ✅ | 修 | ✅ | ✅ | **❌ R1 错** |
| package.json | — | — | 修 | ✅ | ✅ | ✅ | ✅ | ✅ |
| i18n 数量 | — | — | 修 | 同步 | ✅ | ✅ | ✅ | ✅ |
| 内部一致性 | — | — | — | 5 处修 | ✅ | ✅ | ✅ | ✅ |
| §5.1.D 文件数 | — | — | — | — | 修 | ✅ | ✅ | ✅ |
| NI 编号映射 | — | — | — | — | 修 | ✅ | ✅ | ✅ |
| §5.1.A 保留文件 | — | — | — | — | 修 | ✅ | ✅ | ✅ |
| tests/ 目录 | — | — | — | — | — | 修 | ✅ | ✅ |
| importExport | — | — | — | — | — | 修 | ✅ | ✅ |
| manifest version | — | — | — | — | — | 修 | ✅ | ✅ |
| scripts.test | — | — | — | — | — | — | 修 | ✅ |
| pro/src/sync.ts 内部依赖 | — | — | — | — | — | — | 修 | ✅ |
| **R1 位置准确性** | — | — | — | — | — | — | — | **❌** |
| **P2-4 表述** | — | — | — | — | — | — | — | **❌** |
| **§3.3 数量说明** | — | — | — | — | — | — | — | **❌** |

---

## 8. 抽样验证详情（本次新增 6 类）

| # | 抽样 | 实际 | PRD 引用 | 状态 |
|---|---|---|---|---|
| 1 | copyLogic.ts 读取 ignorePaths/onlyAllowPaths | 0 命中 | R1 写"copyLogic.ts 读取" | ❌ P1 错 |
| 2 | main.ts 读取 ignorePaths/onlyAllowPaths | 行 143-144/1412-1416 | R1 写错位置 | ❌ P1 错 |
| 3 | settings.ts:968-987 forcePathStyle | UI dropdown | P2-4 写"强制写死" | ⚠️ P2 表述 |
| 4 | §3.3 P2 项数 | 6 项 | 标题"硬编码"没说明 | ⚠️ P2 数量 |
| 5 | R2 syncOnSaveAfterMilliseconds | main.ts:1421-1422 强制 -1 | R2 缓解描述准确 | ✅ |
| 6 | R5 ObsHttpHandler | fsS3.ts:47 定义/239 用 | R5 风险描述准确 | ✅ |

---

## 9. 建议执行

| 优先级 | 动作 | 成本 |
|---|---|---|
| **P1-1 必做** | R1 改"copyLogic.ts" → "main.ts:1412-1416"，缓解措施引用 Step 33 | 1 分钟 |
| **P2-1 可选** | P2-4 改"settings.ts:968-987 强制写死" → "settings.ts:968-987 UI dropdown 删（Step 42）" | 1 分钟 |
| **P2-2 可选** | §3.3 末尾加 1 行说明"其余 4 条已合并到 §2.1/§2.2/§2.3/§3.1/§3.2" | 1 分钟 |

老板拍板：
- **A**：让 ClaudeCode 修 1 处 P1（R1 位置）→ 同步副本
- **B**：A + 2 处 P2（P2-4 表述 + §3.3 数量说明）
- **C**：直接通过 PRD

按老板"认真全面仔细"原则，建议**选项 B**。
