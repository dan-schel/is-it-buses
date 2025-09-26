import { App } from "@/server/app";
import { TaskScheduler } from "@/server/task/lib/task-scheduler";
import { ClearExpiredSessionTask } from "@/server/task/tasks/clear-expired-sessions-task";
import { LogHistoricalAlertsTask } from "@/server/task/tasks/log-historical-alerts-task";
import { RefreshAlertsTask } from "@/server/task/tasks/refresh-alerts-task";
import { SeedSuperAdminTask } from "@/server/task/tasks/seed-super-admin-task";
import { SendStartupMessageTask } from "@/server/task/tasks/send-startup-message-task";
import { areUnique } from "@dan-schel/js-utils";

export class Tasks {
  private readonly _taskSchedulers: TaskScheduler[];

  constructor(
    private readonly _app: App,

    username: string | null,
    password: string | null,
  ) {
    const tasks = [
      new SendStartupMessageTask(),
      new RefreshAlertsTask(),
      new LogHistoricalAlertsTask(),
      new SeedSuperAdminTask(username, password),
      new ClearExpiredSessionTask(),
    ];

    if (!areUnique(tasks.map((x) => x.taskId))) {
      throw new Error("Two tasks cannot share the same ID.");
    }

    this._taskSchedulers = tasks.map((x) => x.getScheduler(_app));
  }

  async onServerInit() {
    await Promise.all(this._taskSchedulers.map((t) => t.onServerInit()));
  }

  onServerReady() {
    this._taskSchedulers.forEach((t) => t.onServerReady());
  }
}
