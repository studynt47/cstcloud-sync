# docs —— cstcloud-sync 文档范围说明

本目录只保留**与本插件实际支持能力相关**的文档。

## 保留内容

| 路径 | 说明 |
|---|---|
| `remote_services/s3_*` | 本插件仅支持 S3 协议（cstcloud.cn 及任意兼容 S3 的服务）。`s3_general` / `s3_minio` 直接对应本插件的部署形态，`s3_backblaze_b2` / `s3_cloudflare_r2` / `s3_storj_io` / `s3_tencent_cloud_cos` / `s3_upyun` 为同类协议的其它厂商。 |
| `sync_algorithm/` | 同步算法（v1 / v2 / v3）说明，与实现直接相关。 |
| `how_to_debug/` | 通用排障方法（控制台、vConsole、同步计划导出、日志工具），与服务无关。 |
| `browser_env*.md` / `code_design.md` / `minimal_intrusive_design.md` / `linux.md` / `import_export_some_settings.md` | 浏览器环境限制、代码组织约定、Linux 注意事项等通用设计文档。 |

## 已移出的内容（归档于本地 `_archive/upstream_v0.5.25/docs/`，不进入公开仓）

以下为上游 `remotely-save` 的内容，本 fork **不支持**相应服务或功能，留存于公开仓会误导使用者与贡献者：

- `remote_services/` 下除 `s3_*` 外的 **21 个服务目录**（dropbox / onedrive / google drive / box / pcloud / yandex disk / koofr / azure blob / 各类 webdav 等）；
- `pro/`（上游 PRO 功能，本 fork 无此功能）；
- `dropbox_review_material/`（Dropbox 专项评审材料）；
- `encryption/`（rclone 加密链路，本 fork 不使用 rclone）；
- `check_performance/`（上游 profiler 截图，本插件设置页无 profiler 入口）；
- `services_connectable_or_not.md`（上游多服务连通性总表）；
- `browser_env_oauth2_pkce.md`（OAuth2 PKCE，本插件只用 S3 密钥鉴权，无 OAuth 流程）。

> 归档目录 `_archive/` 由 `.gitignore` 排除，仅存在于维护方本地，用于追溯上游来源与授权信息。
