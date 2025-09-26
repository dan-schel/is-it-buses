import { AlertRefreshContext } from "@/server/task/tasks/refresh-alerts-task";

export async function deleteOldAlerts(context: AlertRefreshContext) {
  const { app, alerts } = context;

  for (const alert of alerts) {
    if (alert.deleteAt != null && alert.deleteAt <= app.time.now()) {
      await app.alerts.delete(alert.id, { deleteDisruptions: true });
    }
  }
}
