import { config } from "@/server/entry-point/config";
import { env } from "@/server/entry-point/env";
import { FakeAlertSource } from "@/server/services/alert-source/fake-alert-source";
import { VtarAlertSource } from "@/server/services/alert-source/vtar-alert-source";

/**
 * Ideally returns a VtarAlertSource, but falls back to a FakeAlertSource if
 * env.RELAY_KEY is not set.
 */
export function initAlertSource() {
  if (env.RELAY_KEY != null) {
    return new VtarAlertSource(config.VTAR_URL, env.RELAY_KEY);
  } else {
    return new FakeAlertSource();
  }
}
