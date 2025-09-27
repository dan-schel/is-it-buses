import { App } from "@/server/app";
import { HistoricalAlert } from "@/server/data/alert/historical-alert";
import { HISTORICAL_ALERTS } from "@/server/database/models";
import { IntervalScheduler } from "@/server/task/lib/interval-scheduler";
import { Task } from "@/server/task/lib/task";
import { TaskScheduler } from "@/server/task/lib/task-scheduler";

/**
 * Fetches fresh alerts from the alert source, and writes all unseen alerts to
 * the database.
 */
export class LogHistoricalAlertsTask extends Task {
  static readonly TASK_ID = "log-historical-alerts";

  constructor() {
    super(LogHistoricalAlertsTask.TASK_ID);
  }

  getScheduler(app: App): TaskScheduler {
    return new IntervalScheduler(app, this, IntervalScheduler.FIVE_MINUTES);
  }

  async execute(app: App): Promise<void> {
    const ptvAlerts = await this._tryFetchingPtvAlerts(app);
    if (ptvAlerts == null) return;

    for (const ptvAlert of ptvAlerts) {
      const existing = await app.database
        .of(HISTORICAL_ALERTS)
        .get(ptvAlert.id);

      if (existing != null) return;

      const record = new HistoricalAlert(
        ptvAlert.id,
        ptvAlert.title,
        ptvAlert.description,
      );

      await app.database.of(HISTORICAL_ALERTS).create(record);
    }
  }

  private async _tryFetchingPtvAlerts(app: App) {
    try {
      return await app.alertSource.fetchAlerts();
    } catch (error) {
      app.log.warn("Failed fetch new alerts from PTV.");
      app.log.warn(error);
      return null;
    }
  }
}
