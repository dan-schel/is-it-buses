import { App } from "@/server/app";
import { Alert } from "@/server/data/alert/alert";
import { AlertData } from "@/server/data/alert/alert-data";
import { PtvAlert } from "@/server/services/alert-source/ptv-alert";
import { IntervalScheduler } from "@/server/task/lib/interval-scheduler";
import { Task } from "@/server/task/lib/task";
import { TaskScheduler } from "@/server/task/lib/task-scheduler";
import { updateAlert } from "@/server/task/tasks/refresh-alerts-task/update-alert";
import { addDays } from "date-fns";

type Context = {
  app: App;
  ptvAlerts: PtvAlert[];
  alerts: Alert[];
};

const deleteAlertAfterDays = 7;

/**
 * Fetches fresh alerts from the alert source, and writes all unseen alerts to
 * the database, to later be processed and turned into a disruption
 */
export class RefreshAlertsTask extends Task {
  static readonly TASK_ID = "refresh-alerts-task";

  constructor() {
    super(RefreshAlertsTask.TASK_ID);
  }

  getScheduler(app: App): TaskScheduler {
    return new IntervalScheduler(app, this, IntervalScheduler.FIVE_MINUTES);
  }

  async execute(app: App): Promise<void> {
    const ptvAlerts = await this._tryFetchingPtvAlerts(app);
    if (ptvAlerts == null) return;

    const alerts = await app.alerts.all();
    const context: Context = { app, ptvAlerts, alerts };

    await this._updateDeletionSchedules(context);
    await this._deleteOldAlerts(context);
    await this._updateExistingAlerts(context);
    await this._createNewAlerts(context);
  }

  private async _tryFetchingPtvAlerts(app: App) {
    try {
      return await app.alertSource.fetchAlerts();
    } catch (error) {
      console.warn("Failed fetch new alerts from PTV.");
      console.warn(error);
      return null;
    }
  }

  private async _updateDeletionSchedules({ app, ptvAlerts, alerts }: Context) {
    for (const alert of alerts) {
      const existsInPtv = ptvAlerts.some((x) => x.id.toString() === alert.id);

      if (!existsInPtv && alert.deleteAt == null) {
        const deleteAt = addDays(app.time.now(), deleteAlertAfterDays);
        await app.alerts.update(alert.with({ deleteAt }));
      }

      if (existsInPtv && alert.deleteAt != null) {
        await app.alerts.update(alert.with({ deleteAt: null }));
      }
    }
  }

  private async _deleteOldAlerts({ app, alerts }: Context) {
    for (const alert of alerts) {
      if (alert.deleteAt != null && alert.deleteAt <= app.time.now()) {
        await app.alerts.delete(alert.id, { deleteDisruptions: true });
      }
    }
  }

  private async _updateExistingAlerts({ app, ptvAlerts, alerts }: Context) {
    for (const ptvAlert of ptvAlerts) {
      const alert = alerts.find((x) => x.id === ptvAlert.id.toString());
      if (alert == null) continue;

      const newData = AlertData.fromPtvAlert(ptvAlert);
      if (!newData.equals(alert.latestData)) {
        updateAlert(app, alert, newData);
      }
    }
  }

  private async _createNewAlerts({ app, ptvAlerts, alerts }: Context) {
    for (const ptvAlert of ptvAlerts) {
      const alertId = ptvAlert.id.toString();
      const exists = alerts.some((x) => x.id === alertId);
      if (exists) continue;

      const alertData = AlertData.fromPtvAlert(ptvAlert);
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
  }
}
