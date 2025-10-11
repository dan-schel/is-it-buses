import { StationCollection } from "@/server/data/station/station-collection";
import { Database, MongoDatabase } from "@dan-schel/db";
import { migrations } from "@/server/database/migrations";
import { LineCollection } from "@/server/data/line/line-collection";
import { AlertRepository } from "@/server/data/alert/alert-repository";
import { DisruptionRepository } from "@/server/data/disruption/disruption-repository";
import { AlertSource } from "@/server/services/alert-source/alert-source";
import { VtarAlertSource } from "@/server/services/alert-source/vtar-alert-source";
import { DiscordBot } from "@/server/services/discord/bot";
import { TimeProvider } from "@/server/services/time-provider/time-provider";
import {
  AlertParsingPipeline,
  AlertParsingRulesBuilder,
} from "@/server/data/alert/parsing/lib/alert-parsing-pipeline";
import { Tasks } from "@/server/task/lib/tasks";
import { Logger } from "@/server/services/logger/logger";
import { AuthController } from "@/server/services/auth/auth-controller";
import { User } from "@/server/services/auth/user";
import { LineGroupCollection } from "@/server/data/line-group/line-group-collection";
import { MappingDataCollection } from "@/server/data/map/mapping-data-collection";

export class App {
  readonly auth: AuthController;
  readonly alerts: AlertRepository;
  readonly disruptions: DisruptionRepository;
  readonly alertParsing: AlertParsingPipeline;

  private readonly _tasks: Tasks;

  constructor(
    readonly lineGroups: LineGroupCollection,
    readonly mappingData: MappingDataCollection,

    // TODO: [DS] Compute lines from line groups and a mapping containing names
    // and ptv IDs. I think?
    readonly lines: LineCollection,

    readonly stations: StationCollection,
    readonly database: Database,
    readonly alertSource: AlertSource,
    readonly discordBot: DiscordBot | null,
    readonly time: TimeProvider,
    readonly env: "production" | "development" | "test",
    readonly commitHash: string | null,
    readonly log: Logger,
    readonly alertParsingRules: AlertParsingRulesBuilder,
    readonly superadminUsername: string,
    readonly superadminPassword: string,
  ) {
    this._assertNoDefaultCredsInProd();

    this.auth = new AuthController(this);
    this.alerts = new AlertRepository(this);
    this.disruptions = new DisruptionRepository(this);
    this.alertParsing = new AlertParsingPipeline(this, alertParsingRules);

    this._tasks = new Tasks(this);
  }

  async init() {
    // Has to run before anything else that might use the database.
    await this.database.runMigrations(migrations);

    this.discordBot?.init(this);

    this._logStatus();

    // Run all startup tasks.
    await this._tasks.onServerInit();
  }

  onServerReady(port: number) {
    this.log.info(`Server listening on http://localhost:${port}`);

    // Schedule all periodic tasks.
    this._tasks.onServerReady();
  }

  private _logStatus() {
    this.log.info(
      this.database instanceof MongoDatabase
        ? "🟢 Using MongoDB"
        : "⚫ Using in-memory database",
    );
    this.log.info(
      this.alertSource instanceof VtarAlertSource
        ? "🟢 Using relay server"
        : "⚫ Using fake alert source",
    );
    this.log.info(
      this.discordBot != null
        ? "🟢 Discord bot online"
        : "⚫ Discord bot offline",
    );
    this.log.info(
      this.commitHash != null
        ? `🟢 Commit hash: "${this.commitHash}"`
        : "⚫ Commit hash unknown",
    );
  }

  private _assertNoDefaultCredsInProd() {
    if (
      this.env === "production" &&
      this.superadminUsername === User.SUPERADMIN_DEFAULT_USERNAME &&
      this.superadminPassword === User.SUPERADMIN_DEFAULT_PASSWORD
    ) {
      throw new Error("Superadmin username/password must be set in prod.");
    }
  }
}
