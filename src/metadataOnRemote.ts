import isEqual from "lodash/isEqual";
import { base64url } from "rfc4648";
import { reverseString } from "./misc";

const DEFAULT_README_FOR_METADATAONREMOTE =
  "Do NOT edit or delete the file manually. This file is for the plugin remotely-save to store some necessary meta data on the remote services. Its content is slightly obfuscated.";

const DEFAULT_VERSION_FOR_METADATAONREMOTE = "20220220";

export const DEFAULT_FILE_NAME_FOR_METADATAONREMOTE =
  "_remotely-save-metadata-on-remote.json";

export const DEFAULT_FILE_NAME_FOR_METADATAONREMOTE2 =
  "_remotely-save-metadata-on-remote.bin";

export interface DeletionOnRemote {
  key: string;
  actionWhen: number;
}

export interface MetadataOnRemote {
  version?: string;
  generatedWhen?: number;
  deletions?: DeletionOnRemote[];
}

export const isEqualMetadataOnRemote = (
  a: MetadataOnRemote | undefined,
  b: MetadataOnRemote | undefined
) => {
  const m1 = a === undefined ? { deletions: [] } : a;
  const m2 = b === undefined ? { deletions: [] } : b;

  // we only need to compare deletions
  const d1 = m1.deletions === undefined ? [] : m1.deletions;
  const d2 = m2.deletions === undefined ? [] : m2.deletions;
  return isEqual(d1, d2);
};

