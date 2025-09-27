import { App } from "@/server/app";

export async function deleteOldAlerts(app: App) {
  // TODO: We can query the DB for these alerts directly, rather than fetching
  // all and filtering in memory.
  for (const alert of await app.alerts.all()) {
    if (alert.deleteAt != null && alert.deleteAt <= app.time.now()) {
      await app.alerts.delete(alert.id, { deleteDisruptions: true });
    }
  }
}
