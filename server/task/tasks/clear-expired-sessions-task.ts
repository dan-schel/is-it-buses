import { App } from "@/server/app";
import { IntervalScheduler } from "@/server/task/lib/interval-scheduler";
import { Task } from "@/server/task/lib/task";
import { TaskScheduler } from "@/server/task/lib/task-scheduler";

/**
 * Removes session stored in the database that have expired due to user
 * inactivity.
 */
export class ClearExpiredSessionTask extends Task {
  static readonly TASK_ID = "clear-expired-session";

  constructor() {
    super(ClearExpiredSessionTask.TASK_ID);
  }

  getScheduler(app: App): TaskScheduler {
    return new IntervalScheduler(app, this, IntervalScheduler.FIVE_MINUTES);
  }

  async execute(app: App): Promise<void> {
    await app.auth.deleteExpiredSessions();
  }
}
