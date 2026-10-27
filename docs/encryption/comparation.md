# Comparation Between Encryption Formats

> [!WARNING]
> **⚠️ 已失效 —— 端到端加密能力已于 cstcloud-sync v0.0.2 / PRD v1.3 Step 75-77 移除，本文档仅作历史归档，不再描述现有行为。**
>
> - 已移除的实现文件：`src/fsEncrypt.ts` / `src/encryptOpenSSL.ts` / `src/encryptRClone.ts` / `src/encryptRClone.worker.ts`（均已不存在）
> - 当前行为：cstcloud-sync **没有密码设置项**，文件以**明文**上传到对象存储。唯一有效的说明见根 `README.md` 的「Limitations → End-to-end encryption is not available」
> - 仍然保留的行为：远端若已存在 OpenSSL 密文，插件会**中止同步并报错**（守卫见 `src/encryptedGuard.ts`）
> - 下文对两种格式的对比**仅是历史归档**，不构成任何可用的配置方案；涉及「加密 / 密码」的切换与清理指引**已失效**

## Warning（历史归档，已失效）

**ALWAYS BACKUP YOUR VAULT MANUALLY!!!**

> 已失效：cstcloud-sync 已无加密模式，"在 RClone Crypt 与 OpenSSL enc 之间切换" 这一场景不再存在，因此该手工清理远端文件的操作指引**仅作历史归档参考**。

If you switch between RClone Crypt format and OpenSSL enc format, you have to delete the cloud vault files **manually** and **fully**, so that the plugin can re-sync (i.e. re-upload) the newly encrypted versions to the cloud. **（已失效的操作指引，仅作历史归档）**

## The feature table（历史归档，已失效）

|                          | RClone Crypt                                                                               | OpenSSL enc                                                    | comments                                                                                                                                                            |
| ------------------------ | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| key generation           | scrypt with fixed salt                                                                     | PBKDF2 with dynamic salt                                       | scrypt is better than PBKDF2 from the algorithm aspect. But RClone uses fixed salt by default. Also the parameters might affect the result.                         |
| content encryption (已失效) | XSalsa20Poly1305 on chunks                                                                 | AES-256-CBC                                                    | XSalsa20Poly1305 is way better than AES-256-CBC. And encryption by chunks should require less resources.                                                            |
| file name encryption (已失效) | EME on each segment of the path                                                            | AES-256-CBC on the whole path                                  | RClone has the benefit as well as pitfall that the path structure is preserved. Maybe it's more of a design decision difference? No comment on EME and AES-256-CBC. |
| viewing decrypted result (已失效) | RClone has command that can mount the encrypted vault as if the encryption is transparent. | No convenient way except writing some scripts we are aware of. | RClone is way more convenient.                                                                                                                                      |

## Some notes（历史归档，已失效）

1. Anyway, security is a hard problem. The author of Remotely Save doesn't have sufficient knowledge to "judge" which one is the better format. **Use them at your own risk.**
2. Currently the RClone Crypt format is recommended by default in Remotely Save. Just because of the taste from the Remotely Save author, who likes RClone.
3. **Always use a long password.**
4. Both algorithms are selected deliberately to **be compatible with some well-known third-party tools** (instead of some home-made methods) and **have many tests to ensure the correctness**.
