import { z } from "zod";
import { DatabaseModel } from "@dan-schel/db";
import { Disruption } from "@/server/data/disruption/disruption";
import { disruptionPeriodBson } from "@/server/data/disruption/period/disruption-period";
import { disruptionDataBson } from "@/server/data/disruption/data/disruption-data";

const beginningOfTime = new Date("2000-01-01T00:00:00Z");
const endOfTime = new Date("2100-01-01T00:00:00Z");

export class DisruptionModel extends DatabaseModel<
  Disruption,
  string,
  z.input<typeof DisruptionModel._schema>
> {
  static instance = new DisruptionModel();

  private static _schema = z.object({
    data: disruptionDataBson,
    sourceAlertIds: z.string().array(),
    period: disruptionPeriodBson,
    curation: z.enum(["automatic", "manual"]).default("manual"),

    // Computed fields - included for ease of querying.
    earliestImpactedDate: z.date(),
    latestImpactedDate: z.date(),
  });

  private constructor() {
    super("disruptions");
  }

  getId(item: Disruption): string {
    return item.id;
  }

  serialize(item: Disruption): z.input<typeof DisruptionModel._schema> {
    const { start, end } = this._getFullyEncompassingTimeRange(item);

    return {
      data: item.data.toBson(),
      sourceAlertIds: item.sourceAlertIds,
      period: item.period.toBson(),
      curation: item.curation,

      earliestImpactedDate: start,
      latestImpactedDate: end,
    };
  }

  deserialize(id: string, item: unknown): Disruption {
    const parsed = DisruptionModel._schema.parse(item);
    return new Disruption(
      id,
      parsed.data,
      parsed.sourceAlertIds,
      parsed.period,
      parsed.curation,
    );
  }

  private _getFullyEncompassingTimeRange(item: Disruption) {
    const timeRange = item.period.getFullyEncompassingTimeRange();

    // Instead of null, use arbitrary dates far in the future/past so we can
    // easily do date comparisons when querying the database.
    return {
      start: timeRange.start ?? beginningOfTime,
      end: timeRange.end ?? endOfTime,
    };
  }
}
