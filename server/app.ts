import { StationCollection } from "@/server/data/station/station-collection";
import { Database } from "@/server/database/lib/general/database";
import { AlertSource } from "@/server/alert-source/alert-source";
import { migrations } from "@/server/database/migrations/migrations";
import { LineCollection } from "@/server/data/line/line-collection";
import { TimeProvider } from "@/server/time-provider/time-provider";
import { PopulateInboxQueueTask } from "@/server/task/tasks/populate-inbox-queue-task";
import { LogHistoricalAlertsTask } from "@/server/task/tasks/log-historical-alerts-task";
import { SendStartupMessageTask } from "@/server/task/tasks/send-startup-message-task";
import { areUnique } from "@dan-schel/js-utils";
import { VtarAlertSource } from "@/server/alert-source/vtar-alert-source";
import { MongoDatabase } from "@/server/database/lib/mongo/mongo-database";
import { TaskScheduler } from "@/server/task/lib/task-scheduler";
import { SeedSuperAdminTask } from "@/server/task/tasks/seed-super-admin-task";
import { DiscordBot } from "@/server/discord/bot";
import { ClearExpiredSessionTask } from "@/server/task/tasks/clear-expired-sessions-task";
import { AutoParseDisruptionsTask } from "@/server/task/tasks/auto-parse-disruptions-task";

export class App {
  private readonly _taskSchedulers: TaskScheduler[];

  constructor(
    readonly lines: LineCollection,
    readonly stations: StationCollection,
    readonly database: Database,
    readonly alertSource: AlertSource,
    readonly discordBot: DiscordBot | null,
    readonly time: TimeProvider,
    readonly commitHash: string | null,
    private readonly username: string | null,
    private readonly password: string | null,
  ) {
    const tasks = [
      new SendStartupMessageTask(),
      new PopulateInboxQueueTask(),
      new LogHistoricalAlertsTask(),
      new SeedSuperAdminTask(this.username, this.password),
      new ClearExpiredSessionTask(),
      new AutoParseDisruptionsTask(),
    ];

    if (!areUnique(tasks.map((x) => x.taskId))) {
      throw new Error("Two tasks cannot share the same ID.");
    }

    this._taskSchedulers = tasks.map((x) => x.getScheduler(this));
  }

  async init() {
    // Has to run before anything else that might use the database.
    await this.database.runMigrations(migrations);

    this._logStatus();

    // Run all startup tasks.
    await Promise.all(this._taskSchedulers.map((t) => t.onServerInit()));
  }

  onServerReady(port: number) {
    // eslint-disable-next-line no-console
    console.log(`Server listening on http://localhost:${port}`);

    // Schedule all periodic tasks.
    this._taskSchedulers.forEach((t) => t.onServerReady());
  }

  private _logStatus() {
    /* eslint-disable no-console */
    console.log(
      this.database instanceof MongoDatabase
        ? "🟢 Using MongoDB"
        : "⚫ Using in-memory database",
    );
    console.log(
      this.alertSource instanceof VtarAlertSource
        ? "🟢 Using relay server"
        : "⚫ Using fake alert source",
    );
    console.log(
      this.discordBot != null
        ? "🟢 Discord bot online"
        : "⚫ Discord bot offline",
    );
    console.log(
      this.commitHash != null
        ? `🟢 Commit hash: "${this.commitHash}"`
        : "⚫ Commit hash unknown",
    );
    /* eslint-enable no-console */
  }
}
