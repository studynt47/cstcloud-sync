# Language Packs

## How To Add A Language?

1. Copy `en.json` to a new json file named `<lang>.json`, and translate all the items inside. The language should match what is available in Obsidian app.
2. Modify the `index.ts` file to include the new language file.

## Notes for this fork

- `en.json` is the **type source**: `TransItemType` in `../i18n.ts` is derived from
  `keyof (typeof LANGS)["en"]`. Adding a key therefore requires updating `en.json`
  **and** every other language file, otherwise the new key silently falls back to
  English at runtime.
- Only the S3-capable feature set is translated. Keys for services this plugin
  does not support have already been removed.
