import { strict as assert } from "assert";

import type { RemotelySavePluginSettings } from "../src/baseTypes";
import { messyConfigToNormal, normalConfigToMessy } from "../src/configPersist";

const DEFAULT_SETTINGS: RemotelySavePluginSettings = {
  s3: {
    s3AccessKeyID: "acc",
  } as any,
  serviceType: "s3",
  currLogLevel: "info",
  obfuscateSettingFile: true,
};

describe("configPersist", () => {
  describe("normalConfigToMessy and messyConfigToNormal", () => {
    it("should round-trip a typical config", () => {
      const messy = normalConfigToMessy(DEFAULT_SETTINGS);
      const back = messyConfigToNormal(messy);
      assert.ok(back);
      assert.equal(back!.s3.s3AccessKeyID, DEFAULT_SETTINGS.s3.s3AccessKeyID);
      assert.equal(back!.serviceType, DEFAULT_SETTINGS.serviceType);
    });

    it("should handle empty config", () => {
      const back = messyConfigToNormal({} as any);
      assert.ok(back);
    });

    it("should handle null / undefined gracefully", () => {
      // messyConfigToNormal returns the null as-is (caller handles default fallback)
      const back = messyConfigToNormal(null);
      assert.equal(back, null);
    });
  });
});
