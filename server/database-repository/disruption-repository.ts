import { App } from "@/server/app";
import { Disruption } from "@/server/data/disruption/disruption";
import { TimeRange } from "@/server/data/disruption/period/utils/time-range";
import { LineStatusIndicatorPriority } from "@/server/data/disruption/writeup/disruption-writeup";
import { DisruptionModel } from "@/server/database/models/disruption";
import { DISRUPTIONS } from "@/server/database/models";
import { DisruptionType } from "@/shared/types/disruption";
import { Repository } from "@dan-schel/db";

type ListDisruptionFilter = {
  lines?: number[];
  types?: DisruptionType[];
  period?: TimeRange | Date;
  priority?: LineStatusIndicatorPriority[];
  valid?: boolean | "either";
};

type GetDisruptionFilter = {
  id: Disruption["id"];
  valid?: boolean | "either";
};

export class DisruptionRepository {
  private static respository: DisruptionRepository;
  private database: Repository<DisruptionModel>;

  private constructor(private app: App) {
    this.database = app.database.of(DISRUPTIONS);
  }

  static getRepository(app: App): DisruptionRepository {
    if (!this.respository) {
      this.respository = new DisruptionRepository(app);
    }
    return this.respository;
  }

  async listDisruptions({
    lines,
    types,
    period,
    priority,
    valid = true,
  }: ListDisruptionFilter) {
    return (await this.database.all())
      .filter(this._filterByLines(lines))
      .filter(this._filterByType(types))
      .filter(this._filterByPeriod(period))
      .filter(this._filterByPriority(priority))
      .filter(this._filterByValidity(valid));
  }

  async getDisruption({ id, valid = true }: GetDisruptionFilter) {
    const disruption = await this.database.get(id);

    if (valid === "either" || !disruption) return disruption;

    return this._filterByValidity(valid)(disruption) ? disruption : null;
  }

  private _filterByLines(lines: ListDisruptionFilter["lines"]) {
    const app = this.app;
    return function (disruption: Disruption) {
      if (!lines) return true;
      return (
        new Set(disruption.data.getImpactedLines(app)).intersection(
          new Set(lines),
        ).size > 0
      );
    };
  }

  private _filterByType(type: ListDisruptionFilter["types"]) {
    return function (disruption: Disruption) {
      if (!type) return true;
      return type.includes(disruption.data.toBson().type);
    };
  }

  private _filterByPeriod(period: ListDisruptionFilter["period"]) {
    return function (disruption: Disruption) {
      if (!period) return true;
      return period instanceof Date
        ? disruption.period.occursAt(period)
        : disruption.period.intersects(period);
    };
  }

  private _filterByPriority(priority: ListDisruptionFilter["priority"]) {
    const app = this.app;
    return function (disruption: Disruption) {
      if (!priority) return true;
      return priority.includes(
        disruption.data.getWriteupAuthor().write(app, disruption)
          .lineStatusIndicator.priority,
      );
    };
  }

  private _filterByValidity(valid: ListDisruptionFilter["valid"]) {
    const app = this.app;
    return function (disruption: Disruption) {
      if (valid === "either") return true;
      return valid === disruption.data.isValid(app);
    };
  }
}
