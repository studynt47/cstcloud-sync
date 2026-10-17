import type { RemotelySavePluginSettings } from "./baseTypes";
import type { FakeFs } from "./fsAll";
import { FakeFsS3 } from "./fsS3";

/**
 * To avoid circular dependency, we need a new file here.
 *
 * cstcloud-sync: only S3 (cstcloud.cn) is supported (Step 36).
 */
export function getClient(
  settings: RemotelySavePluginSettings,
  _vaultName: string,
  _saveUpdatedConfigFunc: () => Promise<any>
): FakeFs {
  switch (settings.serviceType) {
    case "s3":
      return new FakeFsS3(settings.s3);
    default:
      throw Error(`cstcloud-sync only supports S3`);
  }
}
