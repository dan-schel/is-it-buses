import { App } from "@/server/app";
import { PtvAlert } from "@/server/services/alert-source/ptv-alert";
import { addDays } from "date-fns";

const deleteAlertAfterDays = 7;

export async function updateDeletionSchedules(app: App, ptvAlerts: PtvAlert[]) {
  for (const alert of await app.alerts.all()) {
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
