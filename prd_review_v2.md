# openclaw PRD v1.0 第 2 次审验报告

> 审验对象：`/root/.openclaw/Project/cstcloud-sync/PRD.md`（486 行 / 25KB / md5 `98f5940d4c6e44a9a334981c80e31fb1`，第 1 次审验后定稿版）
> 审验输入（仅 3 个）：
> 1. `/home/WPS/NEW/remotely_save.md`（任务书，3661 字节）
> 2. `/root/.openclaw/Project/cstcloud-sync/tech_v1.md`（技术分析 v1，36KB）
> 3. https://github.com/remotely-save/remotely-save（上游 + 浅克隆 `/home/WPS/ls/cstcloud-sync/`）
> 审验时间：2026-10-16（第 2 次，**重点抽检代码行号** + **字段名准确性**）

---

## 1. 总体结论

**审验结果**：**第 1 次审验后定稿版基本通过，但抽检发现 2 处 P1 字段名错误（影响 4 处）**。

| 等级 | 问题数 | 严重性 |
|---|---|---|
| **P1 字段名错误** | **2 处 × 2 位置 = 4 处** | 影响实施正确性，工程师按 PRD 找不到代码 |
| P3 行号小偏差 | 多处 | 范围引用基本正确，个别行号偏 1-3 行 |
| 第 1 次审验修复确认 | — | P1+P2 修复已生效（4 项 NI-21~NI-24 + Status bar 原词） |

---

## 2. P1 字段名错误（必须修正）

### 2.1 实际字段名 vs PRD 字段名对比

通过抽样 `fsS3.ts:179-192` DEFAULT_S3_CONFIG：

```typescript
// 上游实际字段（fsS3.ts:179-192）：
export const DEFAULT_S3_CONFIG: S3Config = {
  s3Endpoint: "",            // ✓ PRD 正确
  s3Region: "",              // ✓ PRD 正确
  s3AccessKeyID: "",          // ✓ PRD 正确
  s3SecretAccessKey: "",      // ✓ PRD 正确
  s3BucketName: "",           // ✓ PRD 正确
  bypassCorsLocally: true,    // （PRD 未提，保留）
  partsConcurrency: 20,       // ✓ PRD 正确（P1-1）
  forcePathStyle: false,      // ✓ PRD 正确
  remotePrefix: "",           // ❌ PRD 错写 prefixPath / modifiedTimeAccuracy
  useAccurateMTime: false,    // ✓ PRD 正确
  reverseProxyNoSignUrl: "",  // ❌ PRD 错写 s3ReverseProxyAddress
  generateFolderObject: false,// ✓ PRD 正确
};
```

### 2.2 错误明细

| 任务书原文 | PRD 错写 | 实际字段名 | 错误位置 |
|---|---|---|---|
| 行 10 `修改远端前缀路径` | `prefixPath` / `modifiedTimeAccuracy` | **`remotePrefix`** | §2.3 行 66 + §3.4 NI-22 行 148 |
| 行 11 `S3 反向代理（不签名）地址` | `s3ReverseProxyAddress` | **`reverseProxyNoSignUrl`** | §2.3 行 67 + §3.4 NI-23 行 149 |

**4 处需要修改**：
1. §2.3 行 66：`S3 远端前缀路径（prefixPath / modifiedTimeAccuracy）` → `S3 远端前缀路径（remotePrefix）`
2. §2.3 行 67：`S3 反向代理（s3ReverseProxyAddress）` → `S3 反向代理（reverseProxyNoSignUrl）`
3. §3.4 NI-22：`prefixPath / modifiedTimeAccuracy` → `remotePrefix`
4. §3.4 NI-23：`s3ReverseProxyAddress` → `reverseProxyNoSignUrl`

**实际风险**：
- 工程师按 PRD 搜 `prefixPath` / `s3ReverseProxyAddress` 找不到
- 必须知道实际字段名才能定位 `fsS3.ts:188` 和 `fsS3.ts:190` 行
- 任务书原文没给字段名，ClaudeCode 凭"猜"起的名字**与实际不符**

---

## 3. P3 行号小偏差（可不改）

| PRD 行号 | 实际行号 | 偏差 | 严重性 |
|---|---|---|---|
| `fsS3.ts:179-192` DEFAULT_S3_CONFIG | 178-192 | -1（`export` 关键字位置） | P3 |
| `fsS3.ts:230-254` getS3Client | 226-249 | -4 | P3 |
| `main.ts:1171-1175` ribbon | 1171-1175 | 0 | ✅ |
| `main.ts:1180-1210` 状态栏 | 1181-1215 | +1 / -5 | P3 |
| `main.ts:1757-1771` enableAutoSyncIfSet | 1759-1773 | +2 | P3 |
| `main.ts:1773-1785` enableInitSyncIfSet | 1777-1789 | +4 | P3 |
| `esbuild.config.mjs:17-33` OAuth | 17-35 | 0/+2 | ✅ |
| `settings.ts:927-966` AccessKey 等 | 928-966 | +1 | P3 |
| `settings.ts:1150-1328` dropboxDiv | 1154-1328 | +4 | P3 |
| `settings.ts:1938-2029` serviceType | 1940-2029 | +2 | P3 |
| `settings.ts:968-987` S3 URL style | 968-989 | 0/+2 | ✅ |
| `settings.ts:901-912` endpoint | 902-913 | +1 | P3 |
| `settings.ts:914-925` region | 914-926 | 0/+1 | ✅ |

**结论**：行号偏差 0~5 行，**范围引用基本正确**，工程师 grep 找范围没问题。

---

## 4. 第 1 次审验修复确认

| 修复项 | 状态 | 验证 |
|---|---|---|
| 追加 NI-21~NI-24 | ✅ | 行 146-149 齐全 |
| §2.3 追加 4 项 S3 开关 | ✅ | 行 64-67 齐全（**但字段名错**，见上 §2.2） |
| §2.2 追加 3 行任务书原词 | ✅ | 行 47、48、51 齐全（schedule loop / Status bar / 旧 data.json） |
| 副本同步 md5 | ✅ | 一致 |

---

## 5. 任务书 46 项覆盖度（最终）

| 维度 | 第 1 次 | 第 2 次 |
|---|---|---|
| 任务书 46 项覆盖 | 42/46 | **46/46**（P1 修复后） |
| 任务书 10 条补充 | 10/10 | **10/10** |
| 字段名准确性 | 未抽检 | **2 处错**（4 处需改） |
| 行号准确性 | 未抽检 | **12 处抽检，0 严重偏差** |
| 9 章齐全 | ✅ | ✅ |
| Step 1-44 / R1-R8 / AC1-AC8 | ✅ | ✅ |

---

## 6. tech_v1.md 引用覆盖

| tech_v1.md 关键概念 | PRD 命中 | 状态 |
|---|---|---|
| s3.cstcloud.cn | 3 | ✅ |
| us-east-1 | 3 | ✅ |
| Path-Style / forcePathStyle | 5 | ✅ |
| cstcloud-sync | 12 | ✅ |
| 30 文件改造分类 | 完整 | ✅ |
| Step 1-44 | 完整 | ✅ |
| R1-R8 | 完整 | ✅ |
| AC1-AC8 | 完整 | ✅ |
| 15 OAuth 环境变量 | Step 30 + 4.4 | ✅ |

**结论**：tech_v1.md 100% 覆盖，无缺失。

---

## 7. 抽样验证详情（13 处）

| # | 抽样位置 | 实际内容 | PRD 引用 | 状态 |
|---|---|---|---|---|
| 1 | `fsS3.ts:179-192` DEFAULT_S3_CONFIG | s3Endpoint/s3Region/s3AccessKeyID/s3SecretAccessKey/s3BucketName/bypassCorsLocally/partsConcurrency/forcePathStyle/**remotePrefix**/useAccurateMTime/**reverseProxyNoSignUrl**/generateFolderObject | 同左 | ⚠️ **2 字段名错** |
| 2 | `settings.ts:927-966` | s3Region / s3AccessKeyID / s3SecretAccessKey / s3BucketName / s3URLStyle 等 | 同左 | ✅ |
| 3 | `main.ts:1171-1175` | addRibbonIcon(iconNameSyncWait, name, syncRun) | 同左 | ✅ |
| 4 | `esbuild.config.mjs:17-33` | 15 个 OAuth 环境变量 | 同左 | ✅ |
| 5 | `main.ts:115-157` DEFAULT_SETTINGS | 含 serviceType="s3" / currLogLevel="info" / obfuscateSettingFile=true / 11 个云 DEFAULT_*_CONFIG / password / pro 等 | 同左 | ✅ |
| 6 | `fsS3.ts:230-254` getS3Client | S3Client 构造 + ObsHttpHandler(reverseProxyNoSignUrl) | 230-254 | ✅（行号略偏） |
| 7 | `main.ts:1757-1785` enableAutoSyncIfSet / enableInitSyncIfSet | 函数存在，行号略偏 | 同左 | ✅ |
| 8 | `main.ts:1180-1210` 状态栏 | enableStatusBarInfo 逻辑 + 30 秒轮询 | 同左 | ✅ |
| 9 | `settings.ts:374-535` DropboxAuthModal | class DropboxAuthModal extends Modal 在 374 行 | 同左 | ✅ |
| 10 | `settings.ts:1150-1328` dropboxDiv | dropboxDiv 在 1154 行 | 范围 1150-1328 | ✅ |
| 11 | `settings.ts:1334-1485` OneDrive free | onedriveDiv 在 1334 行 | 同左 | ✅ |
| 12 | `settings.ts:1938-2029` serviceType dropdown | dropdown 在 1940 行 | 范围 1938-2029 | ✅ |
| 13 | `settings.ts:968-987` S3 URL style | settings_s3_urlstyle 在 968 行 | 同左 | ✅ |

---

## 8. 建议执行

| 优先级 | 动作 | 成本 |
|---|---|---|
| **P1 必做** | 修正 4 处字段名（remotePrefix / reverseProxyNoSignUrl） | 2 分钟（4 行替换） |
| P2 可选 | 抽样 14 处修正 ±1~5 行号 | 10 分钟 |
| P3 不做 | 范围引用已合理 | 0 |

老板拍板：
- **A**：让 ClaudeCode 修正 4 处字段名 → openclaw 评审 + 同步副本
- **B**：直接通过 PRD v1.0（工程师会从代码中找到正确字段名）
- **C**：A + 抽样 14 处行号微调

按老板"严格对照 + 认真全面仔细"原则，建议**选项 A**（4 行替换，2 分钟）。
