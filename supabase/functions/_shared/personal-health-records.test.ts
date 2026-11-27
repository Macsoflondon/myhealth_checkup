import { strict as assert } from "node:assert";
import {
  canUsePersonalHealthRecordHistory,
  PERSONAL_HEALTH_RECORDS_ENABLED,
} from "./personal-health-records.ts";

Deno.test("stage 1 disables personal health-record writes and history", () => {
  assert.equal(PERSONAL_HEALTH_RECORDS_ENABLED, false);
  assert.equal(canUsePersonalHealthRecordHistory("verified-user-id"), false);
  assert.equal(canUsePersonalHealthRecordHistory(null), false);
});
