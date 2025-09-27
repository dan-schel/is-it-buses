import { z } from "zod";
import { Ends, endsBson } from "@/server/data/disruption/period/ends/ends";
import { TimeRange } from "@/server/data/disruption/period/utils/time-range";
import {
  DisplayStringOptions,
  DisruptionPeriodBase,
} from "@/server/data/disruption/period/disruption-period-base";
import {
  dayStarts,
  eveningStarts,
  formatDate,
  localToUtcTime,
} from "@/server/data/disruption/period/utils/utils";
import { JustDate } from "@/server/data/disruption/period/utils/just-date";
import { addHours } from "date-fns";
import { CalendarMark } from "@/shared/types/calendar-data";
import { EndsNever } from "@/server/data/disruption/period/ends/ends-never";
import { EndsExactly } from "@/server/data/disruption/period/ends/ends-exactly";

/** Disruption is active continuously from the start date to the end date. */
export class StandardDisruptionPeriod extends DisruptionPeriodBase {
  constructor(
    readonly start: Date | null,
    readonly end: Ends,
  ) {
    super();
  }

  static readonly bson = z
    .object({
      type: z.literal("standard"),
      start: z.date().nullable(),
      end: endsBson,
    })
    .transform((x) => new StandardDisruptionPeriod(x.start, x.end));

  toBson(): z.input<typeof StandardDisruptionPeriod.bson> {
    return {
      type: "standard",
      start: this.start,
      end: this.end.toBson(),
    };
  }

  getDisplayString(options: DisplayStringOptions): string {
    const endStr = this.end.getDisplayString({ now: options.now });

    if (this.start != null) {
      const startStr = formatDate(this.start, options.now);
      return `${startStr} until ${endStr}`;
    } else {
      return `until ${endStr}`;
    }
  }

  getCalendarMark(date: JustDate): CalendarMark {
    const local12am = date.toDate();
    const startOfToday = localToUtcTime(addHours(local12am, dayStarts));
    const startOfEvening = localToUtcTime(addHours(local12am, eveningStarts));
    const startOfTomorrow = localToUtcTime(addHours(local12am, dayStarts + 24));

    const disruptionPeriod = this.getFullyEncompassingTimeRange();
    const allDay = new TimeRange(startOfToday, startOfTomorrow);

    if (!disruptionPeriod.intersects(allDay)) return "no-disruption";

    const nonEvening = new TimeRange(startOfToday, startOfEvening);
    const nonEveningImpacted = disruptionPeriod.intersects(nonEvening);

    return nonEveningImpacted ? "all-day" : "evening-only";
  }

  intersects(range: TimeRange): boolean {
    return this.getFullyEncompassingTimeRange().intersects(range);
  }

  occursAt(date: Date): boolean {
    return this.getFullyEncompassingTimeRange().includes(date);
  }

  getFullyEncompassingTimeRange(): TimeRange {
    return new TimeRange(this.start, this.end.getLatestInterpretableDate());
  }

  static simple(starts: Date | null, ends: Date | null) {
    return new StandardDisruptionPeriod(
      starts,
      ends != null ? new EndsExactly(ends) : new EndsNever(),
    );
  }
}
