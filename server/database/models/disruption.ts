import { z } from "zod";
import { DatabaseModel } from "@dan-schel/db";
import {
  curationTypeJson,
  Disruption,
} from "@/server/data/disruption/disruption";
import { disruptionPeriodBson } from "@/server/data/disruption/period/disruption-period";
import { disruptionDataBson } from "@/server/data/disruption/data/disruption-data";
import { TimeRange } from "@/server/data/disruption/period/utils/time-range";

export class DisruptionModel extends DatabaseModel<
  Disruption,
  string,
  z.input<typeof DisruptionModel._schema>
> {
  static instance = new DisruptionModel();

  private static _schema = z.object({
    data: disruptionDataBson,
    period: disruptionPeriodBson,
    sourceAlertId: z.string().nullable(),
    curationType: curationTypeJson,

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
      period: item.period.toBson(),
      sourceAlertId: item.sourceAlertId,
      curationType: item.curationType,

      earliestImpactedDate: start,
      latestImpactedDate: end,
    };
  }

  deserialize(id: string, item: unknown): Disruption {
    const parsed = DisruptionModel._schema.parse(item);
    return new Disruption(
      id,
      parsed.data,
      parsed.period,
      parsed.sourceAlertId,
      parsed.curationType,
    );
  }

  private _getFullyEncompassingTimeRange(item: Disruption) {
    const timeRange = item.period.getFullyEncompassingTimeRange();

    // Instead of null, use arbitrary dates far in the future/past so we can
    // easily do date comparisons when querying the database.
    return {
      start: timeRange.start ?? TimeRange.beginningOfTime,
      end: timeRange.end ?? TimeRange.endOfTime,
    };
  }
}
