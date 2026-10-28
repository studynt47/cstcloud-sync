# Encryption

> [!WARNING]
> **⚠️ 已失效 —— 端到端加密能力已于 cstcloud-sync v0.0.2 / PRD v1.3 Step 75-77 移除，本文档仅作历史归档，不再描述现有行为。**
>
> - 已移除的实现文件：`src/fsEncrypt.ts` / `src/encryptOpenSSL.ts` / `src/encryptRClone.ts` / `src/encryptRClone.worker.ts`（均已不存在）
> - 当前行为：cstcloud-sync **没有密码设置项**，文件以**明文**上传到对象存储。唯一有效的说明见根 `README.md` 的「Limitations → End-to-end encryption is not available」
> - 仍然保留的行为：远端若已存在 OpenSSL 密文，插件会**中止同步并报错**，不会把密文当明文拉取、覆盖本地笔记（守卫见 `src/encryptedGuard.ts`）
> - 本目录下所有「如何开启加密 / 加密设置项」的操作指引**均已失效**，请勿照做

## 历史归档：曾经支持过的两种格式（已移除）

以下为历史归档描述（上游 remotely-save 2024 年 3 月时的实现），**已移除**，不代表 cstcloud-sync 的现有行为：

1. [RClone Crypt](./rclone.md) format, which was the recommended way back then.
2. [OpenSSL enc](./openssl.md) format

Here is also the [comparation](./comparation.md).
