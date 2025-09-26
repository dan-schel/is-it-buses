import { StationCollection } from "@/server/data/station/station-collection";
import { Database, MongoDatabase } from "@dan-schel/db";
import { migrations } from "@/server/database/migrations";
import { LineCollection } from "@/server/data/line/line-collection";
import { PopulateInboxQueueTask } from "@/server/task/tasks/populate-inbox-queue-task";
import { LogHistoricalAlertsTask } from "@/server/task/tasks/log-historical-alerts-task";
import { SendStartupMessageTask } from "@/server/task/tasks/send-startup-message-task";
import { areUnique } from "@dan-schel/js-utils";
import { TaskScheduler } from "@/server/task/lib/task-scheduler";
import { SeedSuperAdminTask } from "@/server/task/tasks/seed-super-admin-task";
import { ClearExpiredSessionTask } from "@/server/task/tasks/clear-expired-sessions-task";
import { AlertRepository } from "@/server/data/alert/alert-repository";
import { DisruptionRepository } from "@/server/data/disruption/disruption-repository";
import { AlertSource } from "@/server/services/alert-source/alert-source";
import { VtarAlertSource } from "@/server/services/alert-source/vtar-alert-source";
import { DiscordBot } from "@/server/services/discord/bot";
import { TimeProvider } from "@/server/services/time-provider/time-provider";

export class App {
  readonly alerts: AlertRepository;
  readonly disruptions: DisruptionRepository;
  private readonly _taskSchedulers: TaskScheduler[];

  constructor(
    readonly lines: LineCollection,
    readonly stations: StationCollection,
    readonly database: Database,
    readonly alertSource: AlertSource,
    readonly discordBot: DiscordBot | null,
    readonly time: TimeProvider,
    readonly env: "production" | "development" | "test",
    readonly commitHash: string | null,
    private readonly username: string | null,
    private readonly password: string | null,
  ) {
    this.alerts = new AlertRepository(this);
    this.disruptions = new DisruptionRepository(this);

    const tasks = [
      new SendStartupMessageTask(),
      new PopulateInboxQueueTask(),
      new LogHistoricalAlertsTask(),
      new SeedSuperAdminTask(this.username, this.password),
      new ClearExpiredSessionTask(),
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
