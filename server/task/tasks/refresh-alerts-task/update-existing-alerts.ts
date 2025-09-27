import { App } from "@/server/app";
import { Alert } from "@/server/data/alert/alert";
import { AlertData } from "@/server/data/alert/alert-data";
import { PtvAlert } from "@/server/services/alert-source/ptv-alert";

export async function updateExistingAlerts(app: App, ptvAlerts: PtvAlert[]) {
  const alerts = await app.alerts.all();

  for (const ptvAlert of ptvAlerts) {
    const alert = alerts.find((x) => x.id === ptvAlert.id.toString());
    if (alert == null) continue;

    const newData = AlertData.fromPtvAlert(ptvAlert);

    if (!newData.equals(alert.latestData)) {
      updateAlert(app, alert, newData);
    }
  }
}

async function updateAlert(app: App, alert: Alert, newData: AlertData) {
  if (alert.wasManuallyProcessed) {
    // Possible states:
    // - processed-manually
    // - updated-since-manual-processing
    // - ignored-manually
    // - ignored-permanently

    const updatedAlert = alert.with({
      updatedData: newData,
      updatedAt: app.time.now(),

      state:
        alert.state === "ignored-permanently"
          ? "ignored-permanently"
          : "updated-since-manual-processing",
    });

    await app.alerts.update(updatedAlert);
  } else {
    // Possible states:
    // - new
    // - processed-provisionally
    // - processed-automatically
    // - ignored-automatically

    if (alert.hasResultantDisruptions) {
      // Note: Deleting and re-creating all resultant disruptions means any
      // links will be broken as the IDs all change. I guess that's acceptable
      // for now :/
      await app.disruptions.deleteAllFromAlert(alert.id);
    }

    const parsingResult = app.alertParsing.parse(newData);

    if (parsingResult.hasDisruptions) {
      await app.disruptions.create(...parsingResult.toDisruptions(alert.id));
    }

    const updatedAlert = alert.with({
      processedAt: parsingResult.isInconclusive ? null : app.time.now(),
      state: parsingResult.resultantAlertState,
    });

    await app.alerts.update(updatedAlert);
  }
}
