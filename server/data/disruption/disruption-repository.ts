import { App } from "@/server/app";
import { Disruption } from "@/server/data/disruption/disruption";
import { TimeRange } from "@/server/data/disruption/period/utils/time-range";
import { DISRUPTIONS } from "@/server/database/models";
import { DisruptionModel } from "@/server/database/models/disruption";
import { Repository } from "@dan-schel/db";

type QueryOptions = {
  includeInvalid?: boolean;
  includePast?: boolean;
};

export class DisruptionRepository {
  private _database: Repository<DisruptionModel>;

  constructor(private readonly _app: App) {
    this._database = _app.database.of(DISRUPTIONS);
  }

  async all(options: QueryOptions = {}) {
    const all = await this._database.all();
    return all.filter((x) => this._passesQuery(x, options));
  }

  async allForLine(line: number, options: QueryOptions = {}) {
    const all = await this.all(options);
    return all.filter((x) => x.data.getImpactedLines(this._app).includes(line));
  }

  async get(id: string, options: QueryOptions = {}) {
    const disruption = await this._database.get(id);

    if (disruption != null && this._passesQuery(disruption, options)) {
      return disruption;
    }

    return null;
  }

  async deleteAllFromAlert(alertId: string) {
    const matches = await this._database.find({
      where: { sourceAlertId: alertId },
    });

    for (const disruption of matches) {
      await this._database.delete(disruption.id);
    }
  }

  async create(...disruptions: Disruption[]) {
    for (const d of disruptions) {
      await this._database.create(d);
    }
  }

  private _passesQuery(disruption: Disruption, options: QueryOptions) {
    const includeInvalid = options.includeInvalid ?? false;
    const includePast = options.includePast ?? true;

    if (!includeInvalid) {
      const isValid = disruption.data.isValid(this._app);
      if (!isValid) return false;
    }

    if (!includePast) {
      const presentOrFuture = new TimeRange(this._app.time.now(), null);
      if (!disruption.period.intersects(presentOrFuture)) return false;
    }

    return true;
  }
}
