# cstcloud-sync

English | [中文](./README.zh-cn.md)

`cstcloud-sync` is an Obsidian plugin that syncs your vault bidirectionally with an
S3-compatible object storage bucket. It is built for
[cstcloud.cn](https://cstcloud.cn) object storage: the endpoint, region and URL style
are hard-coded, so you only need to fill in three fields.

## Disclaimer

- **This is NOT the [official sync service](https://obsidian.md/sync) provided by Obsidian.**
- **This plugin is not affiliated with, endorsed by, or supported by the upstream
  `remotely-save` project.** See [Attribution and license](#attribution-and-license).

## !!!Caution!!!

**ALWAYS, ALWAYS, backup your vault before using this plugin.**

The vault is the source of truth. Make a copy (or rely on your own version control)
before the first run of a bidirectional sync.

## Features

- **S3 / S3-compatible object storage only.** The service type, endpoint
  (`s3.cstcloud.cn`), region (`us-east-1`) and path-style URL are hard-coded; there is
  no service picker in the settings page.
- **Bidirectional sync.** Local additions, remote modifications and deletions are
  propagated in both directions. The sync direction can also be narrowed to
  push-only / pull-only / push-and-delete-only / pull-and-delete-only.
- **Conflict resolution.** When the same file was changed on both sides, the plugin
  keeps the newer or the larger file, depending on the `Conflict Action` setting.
  A "protect modify percentage" guard can additionally abort a sync that would
  overwrite a large amount of freshly modified local content.
- **Scheduled auto sync.** Sync on a timer, once right after Obsidian starts, or
  manually from the ribbon icon / command palette.
- **Skip large files.** Files bigger than a configurable threshold are ignored.
- **Minimal intrusive.** Hidden files and folders (leading `.` or `_`) are not synced
  by default; syncing `_` items, the Obsidian config folder and bookmarks can be
  enabled separately.
- **Status bar.** Optionally shows the time of the last successful sync.
- **Mobile supported.** Obsidian mobile (iOS / Android) is supported.

## Limitations

- **Only S3-compatible storage is supported.** Dropbox, OneDrive, WebDAV, Webdis,
  Google Drive, Box, pCloud, Yandex Disk, Koofr and Azure Blob Storage are *not*
  supported by this fork, and the corresponding code has been removed.
- **End-to-end encryption is not available.** This build does not provide a password
  setting, so files are uploaded to the bucket as plain content. Do not rely on this
  plugin to protect sensitive content on a third-party bucket.
- **No "PRO" features.** The paid feature set of the upstream project (smart conflict
  merging, extra services, plan management, the profiler panel, ...) is not part of
  this plugin.
- **No settings import/export by QR code**, and no in-app debugging panel.
- **Metadata is never uploaded.** The remote `metadata` file is only used to exclude
  plugin-managed files from the sync; it is not written to the bucket.

## Installation

This plugin is not published to the community plugin store yet. Install it manually:

1. Download the release archive and unzip it.
2. Create the plugin folder `<vault>/.obsidian/plugins/cstcloud-sync/` if it does not
   exist yet.
3. Copy `main.js`, `manifest.json` and `LICENSE` into that folder.
4. Restart Obsidian, then enable `cstcloud-sync` under
   *Settings → Community plugins*.

## Usage

### Settings

Open *Settings → cstcloud-sync*.

**S3 settings (basic)**

| Field | Description |
|---|---|
| `Access Key ID` | The access key of your bucket. |
| `Secret Access Key` | The secret key of your bucket. |
| `Bucket` | The name of the bucket used for the sync. |

Click **Check connectivity** to verify the credentials; the plugin performs a
`HeadBucket` plus a `ListObjectsV2` request against the bucket.

The access key and the secret key are stored in the local `data.json` of the plugin
inside the vault config folder. If someone else can read that file, they can read
your bucket credentials too.

**Advanced settings**

- `Parts concurrency` — how many parts of a large file are uploaded in parallel.
- `Auto run` — run a sync every N minutes.
- `Run once on startup` — run a sync shortly after Obsidian starts.
- `Skip large files` — ignore files bigger than the given size.
- `Status bar info` — show the last successful sync time in the status bar.
- `Concurrency` — how many files are uploaded / downloaded in parallel.
- `Sync underscore items` — also sync files and folders starting with `_`.
- `Sync config folder` (experimental) — also sync the Obsidian config folder.
- `Sync bookmarks` (experimental) — also sync `bookmarks.json`.
- `Delete files to` — delete into the system trash or into the Obsidian `.trash`.
- `Conflict action` — `keep newer` or `keep larger`.
- `Protect modify percentage` — abort the sync if too much recently modified local
  content would be overwritten.
- `Sync direction` — `bidirectional`, `incremental push only`,
  `incremental pull only`, `incremental push and delete only`,
  `incremental pull and delete only`.

### Commands

- `start-sync` — start a sync now.
- `start-sync-dry-run` — start a sync in dry-run mode; nothing is written.

Both are available in the command palette, and the ribbon icon triggers `start-sync`.

## How to debug

- Open the developer console of Obsidian (*Help → Toggle developer tools*) and look
  at the console output.
- Sync plans and the previous sync summary are stored in the local databases of the
  plugin; the log level is fixed to `info`.

## Attribution and license

`cstcloud-sync` is derived from **`remotely-save` v0.5.25`**, Copyright **fyears**,
which is distributed under the **Apache License, Version 2.0**. The original author
retains the copyright of the original work, and this fork keeps the attribution
required by Section 4(c) of the Apache License 2.0.

- Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0
- The full license text is shipped in [`LICENSE`](./LICENSE).

The upstream `remotely-save` project is the work of **fyears**; without their
original implementation this plugin would not exist. Thank you.

## Star history

*(Not affiliated with Obsidian or the upstream `remotely-save` project.)*
