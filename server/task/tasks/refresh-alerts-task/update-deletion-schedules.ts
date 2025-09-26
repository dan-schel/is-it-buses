import { AlertRefreshContext } from "@/server/task/tasks/refresh-alerts-task";
import { addDays } from "date-fns";

const deleteAlertAfterDays = 7;

export async function updateDeletionSchedules(context: AlertRefreshContext) {
  const { app, ptvAlerts, alerts } = context;

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
