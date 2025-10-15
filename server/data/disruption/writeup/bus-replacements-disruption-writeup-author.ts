import { App } from "@/server/app";
import { BusReplacementsDisruptionData } from "@/server/data/disruption/data/bus-replacements-disruption-data";
import { Disruption } from "@/server/data/disruption/disruption";
import { DisruptionWriteup } from "@/server/data/disruption/writeup/disruption-writeup";
import { DisruptionWriteupAuthor } from "@/server/data/disruption/writeup/disruption-writeup-author";
import { formatSection } from "@/server/data/disruption/writeup/utils";

/** DisruptionWriteupAuthor for BusReplacementsDisruptionData. */
export class BusReplacementsDisruptionWriteupAuthor extends DisruptionWriteupAuthor {
  constructor(private readonly _data: BusReplacementsDisruptionData) {
    super();
  }

  write(app: App, disruption: Disruption): DisruptionWriteup {
    const section = formatSection(app, this._data.section);
    const periodString = disruption.period.getDisplayString({
      now: app.time.now(),
    });

    return new DisruptionWriteup(
      `Buses replace trains ${section}`,

      // TODO: Mostly just an example. Improvements to be made here, no doubt.
      `Occurs ${periodString}.\nBuses replace trains ${section}.`,

      {
        // TODO: Far from perfect yet. Period string too long and subject
        // contains "from".
        headline: "Buses replace trains",
        subject: section,
        period: periodString,
        iconType: "line",
      },

      // TODO: Should be customisable per line, so we can display the relevant
      // section without listing them all.
      {
        summary: `Buses replace trains`,
        priority: "medium",
      },
    );
  }
}
