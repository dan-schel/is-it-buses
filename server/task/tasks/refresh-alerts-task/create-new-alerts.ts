import { App } from "@/server/app";
import { Alert } from "@/server/data/alert/alert";
import { AlertData } from "@/server/data/alert/alert-data";
import { PtvAlert } from "@/server/services/alert-source/ptv-alert";

export async function createNewAlerts(app: App, ptvAlerts: PtvAlert[]) {
  const alerts = await app.alerts.all();

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
