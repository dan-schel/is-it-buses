import { App } from "@/server/app";
import { AutoParsingPipeline } from "@/server/data/alert/parsing/lib/auto-parsing-pipeline";
import { Alert } from "@/server/data/alert/alert";
import { AlertData } from "@/server/data/alert/alert-data";
import { Disruption } from "@/server/data/disruption/disruption";
import { ALERTS, DISRUPTIONS } from "@/server/database/models";
import { IntervalScheduler } from "@/server/task/lib/interval-scheduler";
import { Task } from "@/server/task/lib/task";
import { TaskScheduler } from "@/server/task/lib/task-scheduler";
import { PtvAlert } from "@/server/alert-source/ptv-alert";
import { z } from "zod";

/**
 * Fetches fresh alerts from the alert source, and writes all unseen alerts to
 * the database, to later be processed and turned into a disruption
 */
export class PopulateInboxQueueTask extends Task {
  static readonly TASK_ID = "populate-inbox-queue";

  constructor() {
    super(PopulateInboxQueueTask.TASK_ID);
  }

  getScheduler(app: App): TaskScheduler {
    return new IntervalScheduler(app, this, IntervalScheduler.FIVE_MINUTES);
  }

  async execute(app: App): Promise<void> {
    try {
      const ptvAlerts = await app.alertSource.fetchAlerts();
      const alerts = await app.database.of(ALERTS).all();
      await Promise.all([
        this._addNewAlerts(app, ptvAlerts, alerts),
        this._updateAlerts(app, ptvAlerts, alerts),
        this._cleanupOldAlerts(app, ptvAlerts, alerts),
      ]);
    } catch (error) {
      console.warn("Failed to populate unprocessed alerts.");
      console.warn(error);
    }
  }

  private async _addNewAlerts(
    app: App,
    ptvAlerts: PtvAlert[],
    alerts: Alert[],
  ) {
    const parser = new AutoParsingPipeline(app);

    for (const ptvAlert of ptvAlerts) {
      const alertId = ptvAlert.id.toString();
      if (alerts.some((x) => x.id === alertId)) continue;

      const data = AlertData.fromPtvAlert(ptvAlert);
      const parserOutput = parser.parseAlert(data);

      await app.database.of(ALERTS).create(
        Alert.fresh(app, alertId, data, {
          isProcessed: parserOutput != null,
        }),
      );

      if (parserOutput != null) {
        await app.database
          .of(DISRUPTIONS)
          .create(parserOutput.toNewDisruption([alertId]));
      }
    }
  }

  private async _updateAlerts(
    app: App,
    ptvAlerts: PtvAlert[],
    alerts: Alert[],
  ) {
    const parser = new AutoParsingPipeline(app);

    for (const ptvAlert of ptvAlerts) {
      const id = ptvAlert.id.toString();
      const alert = alerts.find((x) => x.id === id);
      const { success, data: mostRecentUpdate } = z.coerce
        .date()
        .safeParse(ptvAlert.lastUpdated);

      if (alert && success && !alert.ignoreFutureUpdates) {
        const canToBeUpdated =
          (alert.getState() === "new" && alert.appearedAt < mostRecentUpdate) ||
          (alert.getState() === "processed" &&
            (alert.processedAt ?? app.time.now()) < mostRecentUpdate) ||
          (alert.getState() === "updated" &&
            (alert.updatedAt ?? app.time.now()) < mostRecentUpdate);

        if (canToBeUpdated) {
          const existingDisruption = await app.database.of(DISRUPTIONS).first({
            where: {
              sourceAlertIds: alert.id,
            },
          });

          let newDisruption: Disruption | null = null;
          try {
            const parserOutput = parser.parseAlert(alert.data);
            if (parserOutput) {
              newDisruption =
                existingDisruption != null
                  ? parserOutput.updateExistingDisruption(
                      existingDisruption.id,
                      [alert.id],
                    )
                  : parserOutput.toNewDisruption([alert.id]);
            }
          } catch (error) {
            console.warn(`Failed to parse alert #${alert.id}.`);
            console.warn(error);
          }

          await app.database.of(ALERTS).update(
            alert.with({
              data: AlertData.fromPtvAlert(ptvAlert),
              appearedAt: app.time.now(),
              processedAt: newDisruption
                ? app.time.now()
                : existingDisruption?.curation === "automatic"
                  ? null
                  : alert.processedAt,
            }),
          );

          if (existingDisruption?.curation === "automatic") {
            if (newDisruption) {
              await app.database.of(DISRUPTIONS).update(newDisruption);
            } else {
              // If a disruptions cannot be parsed with the new alert data,
              //  we should assume that the existing entry might no longer be valid
              // We're better off removing it than to display incorrect information
              await app.database.of(DISRUPTIONS).delete(existingDisruption.id);
            }
          } else if (!existingDisruption && newDisruption) {
            await app.database.of(DISRUPTIONS).create(newDisruption);
          }
        }
      }
    }
  }

  private async _cleanupOldAlerts(
    app: App,
    ptvAlerts: PtvAlert[],
    alerts: Alert[],
  ) {
    for (const alert of alerts) {
      if (!ptvAlerts.some((a) => a.id.toString() === alert.id)) {
        await app.database.of(ALERTS).delete(alert.id);
        const _disruptions = await app.database.of(DISRUPTIONS).find({
          where: {
            sourceAlertIds: alert.id,
            curation: "automatic",
          },
        });
        for (const { id } of _disruptions) {
          await app.database.of(DISRUPTIONS).delete(id);
        }
      }
    }
  }
}
