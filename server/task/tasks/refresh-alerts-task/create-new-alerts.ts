import { App } from "@/server/app";
import { Alert } from "@/server/data/alert/alert";
import { AlertData } from "@/server/data/alert/alert-data";
import { AlertRefreshContext } from "@/server/task/tasks/refresh-alerts-task";

export async function createNewAlerts(context: AlertRefreshContext) {
  const { app, ptvAlerts, alerts } = context;

  for (const ptvAlert of ptvAlerts) {
    const alertId = ptvAlert.id.toString();

    const exists = alerts.some((x) => x.id === alertId);
    if (exists) continue;

    await createNewAlert(app, alertId, AlertData.fromPtvAlert(ptvAlert));
  }
}

async function createNewAlert(app: App, alertId: string, alertData: AlertData) {
  const parsingResult = app.alertParsing.parse(alertData);

  if (parsingResult.hasDisruptions) {
    await app.disruptions.create(...parsingResult.toDisruptions(alertId));
  }

  const alert = Alert.fresh({
    id: alertId,
    state: parsingResult.resultantAlertState,
    data: alertData,
    now: app.time.now(),
  });

  await app.alerts.create(alert);
}
