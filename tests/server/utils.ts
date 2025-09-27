import { App } from "@/server/app";
import { InMemoryDatabase } from "@dan-schel/db";
import { startWebServer } from "@/server/entry-point";
import { lines } from "@/server/entry-point/data/lines";
import { stations } from "@/server/entry-point/data/stations";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FakeTimeProvider } from "@/server/services/time-provider/fake-time-provider";
import { FakeAlertSource } from "@/server/services/alert-source/fake-alert-source";
import { FakeLogger } from "@/server/services/logger/fake-logger";

export function createTestApp() {
  const db = new InMemoryDatabase();
  const alertSource = new FakeAlertSource();
  const time = new FakeTimeProvider(new Date("2025-01-01T00:00:00Z"));
  const log = new FakeLogger();

  const app = new App(
    lines,
    stations,
    db,
    alertSource,
    null,
    time,
    "test",
    null,
    log,
    null,
    null,
  );

  return { app, db, alertSource, time, log };
}

export async function createTestServer() {
  const { app } = createTestApp();
  const fileName = fileURLToPath(import.meta.url);
  const root = dirname(fileName);

  const server = await startWebServer(app, root);

  return { server, app };
}
