import { App } from "@/server/app";
import { Alert } from "@/server/data/alert/alert";
import { IgnoreEverythingParsingRule } from "@/server/data/alert/parsing/rules/ignore-everything-parsing-rule";
import { PassthroughParsingRule } from "@/server/data/alert/parsing/rules/passthrough-parsing-rule";
import { Disruption } from "@/server/data/disruption/disruption";
import { ALERTS, DISRUPTIONS } from "@/server/database/models";
import { PtvAlert } from "@/server/services/alert-source/ptv-alert";
import { RefreshAlertsTask } from "@/server/task/tasks/refresh-alerts-task";
import { createTestApp } from "@/tests/server/utils";

type Options = {
  parsingRules?: "none" | "passthrough-high" | "ignore-everything";
  existingAlert?: Alert | null;
  existingDisruption?: Disruption | null;
  ptvAlert?: PtvAlert | null | "fetch-error";
};

export async function setupScenario({
  parsingRules,
  existingAlert = null,
  existingDisruption = null,
  ptvAlert = null,
}: Options) {
  const { app, db, time, alertSource, log } = createTestApp({
    alertParsingRules: setupAlertParsingRules(parsingRules),
  });

  if (existingAlert != null) {
    await db.of(ALERTS).create(existingAlert);
  }

  if (existingDisruption != null) {
    await db.of(DISRUPTIONS).create(existingDisruption);
  }

  if (ptvAlert === "fetch-error") {
    alertSource.setShouldFail(true);
  } else if (ptvAlert != null) {
    alertSource.setAlerts([ptvAlert]);
  }

  async function getAlert(id?: string | number) {
    const alertId = id?.toString() ?? existingAlert?.id;
    if (alertId == null) throw new Error("Which alert to get?");
    return await db.of(ALERTS).get(alertId);
  }

  async function requireAlert(id?: string | number) {
    const alertId = id?.toString() ?? existingAlert?.id;
    if (alertId == null) throw new Error("Which alert to get?");
    return await db.of(ALERTS).require(alertId);
  }

  async function getDisruption(id?: string) {
    const disruptionId = id ?? existingDisruption?.id;
    if (disruptionId == null) throw new Error("Which disruption to get?");
    return await db.of(DISRUPTIONS).get(disruptionId);
  }

  async function requireDisruption(id?: string) {
    const disruptionId = id ?? existingDisruption?.id;
    if (disruptionId == null) throw new Error("Which disruption to get?");
    return await db.of(DISRUPTIONS).require(disruptionId);
  }

  function runTask() {
    return new RefreshAlertsTask().execute(app);
  }

  return {
    app,
    db,
    time,
    log,
    getAlert,
    requireAlert,
    getDisruption,
    requireDisruption,
    runTask,
  };
}

function setupAlertParsingRules(
  parsingRules: Options["parsingRules"] = "none",
) {
  return {
    none: (_app: App) => [],
    "passthrough-high": (app: App) => [new PassthroughParsingRule(app, "high")],
    "ignore-everything": (app: App) => [new IgnoreEverythingParsingRule(app)],
  }[parsingRules];
}
