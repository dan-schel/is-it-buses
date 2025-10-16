import { App } from "@/server/app";
import { InMemoryDatabase } from "@dan-schel/db";
import { lines } from "@/server/entry-point/data/lines";
import { stations } from "@/server/entry-point/data/stations";
import { FakeTimeProvider } from "@/server/services/time-provider/fake-time-provider";
import { FakeAlertSource } from "@/server/services/alert-source/fake-alert-source";
import { FakeLogger } from "@/server/services/logger/fake-logger";
import { AlertParsingRulesBuilder } from "@/server/data/alert/parsing/lib/alert-parsing-pipeline";
import { User } from "@/server/services/auth/user";
import { lineGroups } from "@/server/entry-point/data/line-groups";
import { mappingData } from "@/server/entry-point/data/mapping-data";
import { generatePtvGeometry } from "@/server/entry-point/data/geometry";

export const defaultMockedNow = new Date("2025-01-01T00:00:00Z");

export function createTestApp({
  alertParsingRules = () => [],
}: { alertParsingRules?: AlertParsingRulesBuilder } = {}) {
  const db = new InMemoryDatabase();
  const alertSource = new FakeAlertSource();
  const time = new FakeTimeProvider(defaultMockedNow);
  const log = new FakeLogger();
  const mapGeometry = generatePtvGeometry();

  const app = new App(
    lineGroups,
    mappingData,
    lines,
    stations,
    mapGeometry,
    db,
    alertSource,
    null,
    time,
    "test",
    null,
    log,
    alertParsingRules,
    User.SUPERADMIN_DEFAULT_USERNAME,
    User.SUPERADMIN_DEFAULT_PASSWORD,
  );

  return { app, db, alertSource, time, log };
}
