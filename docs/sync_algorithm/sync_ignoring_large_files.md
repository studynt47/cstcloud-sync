# Sync Ignoring Large Files

> [!WARNING]
> **⚠️ 下文第 1 条中关于 E2E 密码模式的描述已失效** —— 端到端加密能力已于 cstcloud-sync v0.0.2 / PRD v1.3 Step 75-77 移除，插件不再提供密码设置项。cstcloud-sync 只有“无密码”这一种情形，因此文件大小永远按**原始未加密大小**比较。

Initially, the plugin does not ignore large files.

From the new version in May 2022, it can ignore all files with some sizes. But we need some rules to make the function compatible with existing conditions.

1. If users are using E2E password mode, then the file sizes are compared on the **encrypted sizes**, rather than the original unencripted file sizes. **(历史归档，已失效：该密码模式已移除)** The reasons are: the encrypted ones are in transferations, and the encrypted sizes can be computed from unencrypted sizes but not the reverse.

2. Assuming the file A, is already synced between local device and remote service before.

   - If the local size and remote size are both below the threshold, then the file can be synced normally.
   - If the local size and remote size are both above the threshold, then the file will be ignored normally.
   - If the local size is below the threshold, and the remote size is above the threshold, then the plugin **rejects** the sync, and throws the error to the user.
   - If the local size is above the threshold, and the remote size is below the threshold, then the plugin **rejects** the sync, and throws the error to the user.
   - When it somes to deletions, the same rules apply.

   The main point is that, if the file sizes "cross the line", the plugin does not introduce any further trouble and just reject to work for this file.
