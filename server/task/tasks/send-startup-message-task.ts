import { App } from "@/server/app";
import { DEPLOYMENT_LOGS } from "@/server/database/models";
import { OnStartupScheduler } from "@/server/task/lib/on-startup-scheduler";
import { Task } from "@/server/task/lib/task";
import { TaskScheduler } from "@/server/task/lib/task-scheduler";
import { uuid } from "@dan-schel/js-utils";
import { subHours } from "date-fns";

/**
 * Logs the current deployment into the database and sends a message on Discord
 * via a webhook.
 */
export class SendStartupMessageTask extends Task {
  static readonly TASK_ID = "send-startup-message";

  constructor() {
    super(SendStartupMessageTask.TASK_ID);
  }

  getScheduler(app: App): TaskScheduler {
    return new OnStartupScheduler(app, this);
  }

  async execute(app: App): Promise<void> {
    try {
      if (app.discordBot === null || app.commitHash === null) return;

      const deployments = await app.database.of(DEPLOYMENT_LOGS).find({
        where: { commitHash: app.commitHash },
        sort: {
          by: "createdAt",
          direction: "desc",
        },
      });

      await app.database.of(DEPLOYMENT_LOGS).create({
        id: uuid(),
        commitHash: app.commitHash,
        createdAt: new Date(),
      });

      const lastDeployment = deployments.at(0)?.createdAt ?? new Date(0);

      if (deployments.length < 2 || subHours(new Date(), 1) > lastDeployment) {
        await app.discordBot.logDeployment(
          app,
          app.commitHash,
          deployments.length > 0,
        );
      }
    } catch (error) {
      app.log.warn("Failed to send deploy message to Discord.");
      app.log.warn(error);
    }
  }
}
