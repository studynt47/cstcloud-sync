# docs —— cstcloud-sync 文档范围说明

本目录只保留**与本插件实际支持能力相关**的文档。

## 保留内容

| 路径 | 说明 |
|---|---|
| `sync_algorithm/` | 同步算法（v1 / v2 / v3）说明，与实现直接相关。 |
| `how_to_debug/` | 通用排障方法（控制台、vConsole、同步计划导出、日志工具），与服务无关。 |
| `browser_env*.md` / `code_design.md` / `minimal_intrusive_design.md` / `linux.md` / `import_export_some_settings.md` | 浏览器环境限制、代码组织约定、Linux 注意事项等通用设计文档。 |

## 已移出的内容（归档于本地 `_archive/upstream_v0.5.25/docs/`，不进入公开仓）

以下为上游 `remotely-save` 的内容，本 fork **不支持**相应服务或功能，留存于公开仓会误导使用者与贡献者：

- `remote_services/` **整个目录**（**29 个服务目录 / 143 个文件**）：
  - 其中 **22 个非 S3 服务目录**（azureblobstorage / box / googledrive / koofr / onedrive / onedrivefull / pcloud / webdav_alist / webdav_apache / webdav_caddy / webdav_dufs / webdav_general / webdav_infinicloud_teracloud / webdav_jianguoyun / webdav_nextcloud / webdav_nginx / webdav_openmediavault / webdav_owncloud / webdav_synology_webdav_server / webdav_thegoodcloud / webdis / yandexdisk）；
  - 以及 `s3_*` **7 个目录 / 35 个文件**（s3_backblaze_b2 / s3_cloudflare_r2 / s3_general / s3_minio / s3_storj_io / s3_tencent_cloud_cos / s3_upyun）—— 详见下方「服务兼容范围」；
- `pro/`（上游 PRO 功能，本 fork 无此功能）；
- `dropbox_review_material/`（Dropbox 专项评审材料）；
- `encryption/`（rclone 加密链路，本 fork 不使用 rclone）；
- `check_performance/`（上游 profiler 截图，本插件设置页无 profiler 入口）；
- `services_connectable_or_not.md`（上游多服务连通性总表）；
- `browser_env_oauth2_pkce.md`（OAuth2 PKCE，本插件只用 S3 密钥鉴权，无 OAuth 流程）。

> 归档目录 `_archive/` 由 `.gitignore` 排除，仅存在于维护方本地，用于追溯上游来源与授权信息。
> 其中本 fork 在上游 `s3_*` 文档之上追加的**加密失效警告标注**（2 个文件）另行固化于 `_archive/fork_delta_v0.0.6/docs/remote_services/`，与纯上游原版并存、可完整还原。

## 服务兼容范围（`s3_*` 文档移出后的等价说明）

本插件**仅支持 S3 协议**（cstcloud.cn 及任意兼容 S3 的对象存储服务）。原 `s3_*` 文档覆盖的服务商如下 —— 其中 `s3_general` / `s3_minio` 直接对应本插件的部署形态，其余为同类协议的其它厂商：

| 原文档目录 | 对应服务商 / 形态 |
|---|---|
| `s3_general` | 通用 S3 兼容服务（桶策略、CORS 配置等通用说明） |
| `s3_minio` | MinIO 自建服务 |
| `s3_backblaze_b2` | Backblaze B2 |
| `s3_cloudflare_r2` | Cloudflare R2 |
| `s3_storj_io` | Storj.io |
| `s3_tencent_cloud_cos` | 腾讯云 COS |
| `s3_upyun` | 又拍云 |

存储桶创建、密钥获取、CORS 配置等具体步骤请参照各服务商官方文档。

> ⚠️ **插件端到端加密已于 cstcloud-sync v0.0.2 移除**（PRD v1.3 Step 75-77）：插件不再提供密码设置项，文件以明文上传。请使用**私有读写**的存储桶与**私有操作员凭证**，并对访问链路自行加密保护。
