import { App } from "@/server/app";
import { IntervalScheduler } from "@/server/task/lib/interval-scheduler";
import { Task } from "@/server/task/lib/task";
import { TaskScheduler } from "@/server/task/lib/task-scheduler";
import { createNewAlerts } from "@/server/task/tasks/refresh-alerts-task/create-new-alerts";
import { deleteOldAlerts } from "@/server/task/tasks/refresh-alerts-task/delete-old-alerts";
import { updateDeletionSchedules } from "@/server/task/tasks/refresh-alerts-task/update-deletion-schedules";
import { updateExistingAlerts } from "@/server/task/tasks/refresh-alerts-task/update-existing-alerts";

/**
 * Regularly fetches alerts from PTV, and creates, updates, and deletes alerts
 * in the database to reflect what we fetch from PTV. New disruptions and those
 * which were automatically processed previously but now updated are put through
 * auto-parsing to attempt to generate disruptions from their content.
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

    await updateDeletionSchedules(app, ptvAlerts);
    await deleteOldAlerts(app);
    await updateExistingAlerts(app, ptvAlerts);
    await createNewAlerts(app, ptvAlerts);
  }

  private async _tryFetchingPtvAlerts(app: App) {
    try {
      return await app.alertSource.fetchAlerts();
    } catch (error) {
      app.log.warn("Failed to fetch new alerts from PTV.");
      app.log.warn(error);
      return null;
    }
  }
}
