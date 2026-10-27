# RClone Crypt format

> [!WARNING]
> **⚠️ 已失效 —— 端到端加密能力已于 cstcloud-sync v0.0.2 / PRD v1.3 Step 75-77 移除，本文档仅作历史归档，不再描述现有行为。**
>
> - 已移除的实现文件：`src/fsEncrypt.ts` / `src/encryptOpenSSL.ts` / `src/encryptRClone.ts` / `src/encryptRClone.worker.ts`（均已不存在）；依赖包 `@fyears/rclone-crypt` 也已从 `package.json` 移除
> - 当前行为：cstcloud-sync **没有密码设置项**，文件以**明文**上传到对象存储。唯一有效的说明见根 `README.md` 的「Limitations → End-to-end encryption is not available」
> - 仍然保留的行为：远端若已存在 OpenSSL 密文，插件会**中止同步并报错**，不会把密文当明文拉取覆盖本地笔记（守卫见 `src/encryptedGuard.ts`）
> - 下面的「怎么配 RClone profile」「怎么挂载查看」等操作指引**均已失效**，请勿照做

## 历史归档：曾经的形态（已移除）

The encryption is compatible with RClone Crypt with **base64** name encryption format. **（已失效的历史描述）**

> 已失效：cstcloud-sync 已无加密模式，与 RClone Crypt 的兼容性**已移除**，此处仅作历史归档描述。

It's developed based on another js project by the same author of Remotely Save: [`@fyears/rclone-crypt`](https://github.com/fyears/rclone-crypt), which is NOT an official library from RClone, and is NOT affiliated with RClone.

Reasonable tests are also ported from official RClone code, to ensure the compatibility and correctness of the encryption. **（已失效的历史描述）**

## Warning（历史归档，已失效）

**ALWAYS BACKUP YOUR VAULT MANUALLY!!!**

> 已失效：cstcloud-sync 已无加密模式，"在 RClone Crypt 与 OpenSSL enc 之间切换" 这一场景不再存在，因此该手工清理远端文件的操作指引**仅作历史归档参考**。

If you switch between RClone Crypt format and OpenSSL enc format, you have to delete the cloud vault files **manually** and **fully**, so that the plugin can re-sync (i.e. re-upload) the newly encrypted versions to the cloud. **（已失效的操作指引，仅作历史归档）**

## Comparation between encryption formats（历史归档，已失效）

See the doc [Comparation](./comparation.md).

## Interoperability with official RClone（历史归档，已失效）

> 已失效：本节描述的 RClone Crypt 互操作方案随加密后端一并**移除**，以下 `rclone config` / `rclone mount` 步骤仅为历史归档记录，**不再是** cstcloud-sync 的可执行指引。

Please pay attention that the plugin uses **base64** of encrypted file names, while official RClone by default uses **base32** file names. **（已失效的历史描述）** The intention is purely for potentially support longer file names.

You could set up the RClone profile by calling `rclone config`. You need to create two profiles, one for your original connection and the other for RClone Crypt.

Finally, a working config file should like this:

```ini
[webdav1]
type = webdav
url = https://example.com/sharefolder1/subfolder1 # the same as the web address in Remotely Save settings.
vendor = other
user = <some webdav username>
pass = <some webdav password, obfuscated>

[webdav1crypt]
type = crypt
remote = nas1test:vaultname # the same as your "Remote Base Directory" (usually the vault name) in Remotely Save settings
password = <some encryption password, obfuscated>  # 已失效（历史归档），cstcloud-sync 无密码设置项
filename_encoding = base64 # don't forget this!!!
```

You can use the `mount` command to view and see the files in file explorer! On Windows, the command should like this (the remote vault is mounted to drive `X:`):

```bash
rclone mount webdav1crypt: X: --network-mode --vfs-cache-mode writes
```
