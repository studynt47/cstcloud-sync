# OpenSSL enc format

> [!WARNING]
> **⚠️ 已失效 —— 端到端加密能力已于 cstcloud-sync v0.0.2 / PRD v1.3 Step 75-77 移除，本文档仅作历史归档，不再描述现有行为。**
>
> - 已移除的实现文件：`src/fsEncrypt.ts` / `src/encryptOpenSSL.ts` / `src/encryptRClone.ts` / `src/encryptRClone.worker.ts`（均已不存在）
> - 当前行为：cstcloud-sync **没有密码设置项**，文件以**明文**上传到对象存储。唯一有效的说明见根 `README.md` 的「Limitations → End-to-end encryption is not available」
> - 仍然保留的行为：远端若已存在 OpenSSL 密文，插件会**中止同步并报错**，不会把密文当明文拉取覆盖本地笔记（守卫见 `src/encryptedGuard.ts`）
> - 下面的「如何开启」「如何配置」「openssl 命令怎么跑」等操作指引**均已失效**，请勿照做

## 历史归档：曾经的形态（已移除）

If a password is set, the files are encrypted before being sent to the cloud. **（已失效的历史描述）**

> 已失效：cstcloud-sync 已无密码设置项，上述"设置密码后文件在上传前被加密"的行为**已移除**，此处仅作历史归档描述。

## Warning（历史归档，已失效）

**ALWAYS BACKUP YOUR VAULT MANUALLY!!!**

> 已失效：cstcloud-sync 已无加密模式，"在 RClone Crypt 与 OpenSSL enc 之间切换" 这一场景不再存在，因此该手工清理远端文件的操作指引**仅作历史归档参考**。

If you switch between RClone Crypt format and OpenSSL enc format, you have to delete the cloud vault files **manually** and **fully**, so that the plugin can re-sync (i.e. re-upload) the newly encrypted versions to the cloud. **（已失效的操作指引，仅作历史归档）**

## Comparation between encryption formats（历史归档，已失效）

See the doc [Comparation](./comparation.md).

## Interoperability with official OpenSSL（历史归档，已失效）

> 已失效：本节描述的算法实现（web-crypto AES-256-CBC + openssl `Salted__` 格式）随加密后端一并**移除**，以下命令仅为历史归档记录，**不再是** cstcloud-sync 的可执行指引。

This encryption algorithm is delibrately designed to be aligned with openssl format. **（已失效的历史描述）**

1. The encryption algorithm is implemented using web-crypto. Using AES-256-CBC. **（已失效的历史描述）**
2. The file content is encrypted using openssl format. Assuming a file named `sometext.txt`, a password `somepassword`, then the encryption is equivalent to the following command: **（已失效的操作指引，仅作历史归档）**

   ```bash
   # file content encryption (ignoring file path encryption)  # 已失效（历史归档），非 cstcloud-sync 可执行指引
   openssl enc -p -aes-256-cbc -pbkdf2 -iter 20000 -pass pass:somepassword -in ./sometext.txt -out ./sometext.txt.enc

   # file content decryption (ignoring file path decryption)
   openssl enc -d -p -aes-256-cbc -pbkdf2 -iter 20000 -pass pass:somepassword -in ./sometext.txt.enc -out ./sometext.txt
   ```

3. The file/directory path strings, are encrypted using openssl in binary mode and then `base64url without padding` is applied. **（已失效的历史描述）**
   Assuming the file path is `a-folder-文件夹/a-file-文件.md`, then the following commands are equivilent:

   ```bash
   # prepare the functions
   # https://unix.stackexchange.com/questions/628842
   base64url::encode () { base64 -w0 | tr '+/' '-_' | tr -d '='; }
   base64url::decode () { awk '{ if (length($0) % 4 == 3) print $0"="; else if (length($0) % 4 == 2) print $0"=="; else print $0; }' | tr -- '-_' '+/' | base64 -d; }

   # pure string encryption then base32  # 已失效（历史归档），非 cstcloud-sync 可执行指引
   echo -n 'a-folder-文件夹/a-file-文件.md' | openssl enc -aes-256-cbc -pbkdf2 -iter 20000 -pass pass:mylongpassword | base64url::encode

   # pure string base64url then decryption
   echo -n 'U2FsdGVkX19tNkdFL5rZeHxbe7FL-Pp5mkZJkDNFJWFT6lldZlfa57j0C_cKn0I3PZ9YDvOkyoKqfF6lbn0_yg' | base64url::decode | openssl enc -d -aes-256-cbc -pbkdf2 -iter 20000 -pass pass:mylongpassword
   ```

4. The directory is considered as special "0-byte" object on remote s3. So this meta infomation may be easily guessed if some third party can access the remote bucket.
