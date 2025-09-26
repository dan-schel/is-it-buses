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
    try {
      const ptvAlerts = await app.alertSource.fetchAlerts();

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
    } catch (error) {
      console.warn("Failed to log historical alerts.");
      console.warn(error);
    }
  }
}
