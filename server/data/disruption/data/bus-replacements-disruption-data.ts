import { z } from "zod";
import { LineSection } from "@/server/data/line-section";
import { RouteGraphModifier } from "@/server/data/disruption/route-graph-modifier/route-graph-modifier";
import { DisruptionWriteupAuthor } from "@/server/data/disruption/writeup/disruption-writeup-author";
import { DisruptionDataBase } from "@/server/data/disruption/data/disruption-data-base";
import { unique } from "@dan-schel/js-utils";
import { BusReplacementsDisruptionWriteupAuthor } from "@/server/data/disruption/writeup/bus-replacements-disruption-writeup-author";
import { BusReplacementsRouteGraphModifier } from "@/server/data/disruption/route-graph-modifier/bus-replacements-route-graph-modifier";

/** All or part of one or more train lines are replaced by buses. */
export class BusReplacementsDisruptionData extends DisruptionDataBase {
  constructor(readonly sections: LineSection[]) {
    super();

    if (sections.length === 0) {
      throw new Error("Must have at least one section.");
    }
  }

  static readonly bson = z
    .object({
      type: z.literal("bus-replacements"),
      sections: LineSection.bson.array(),
    })
    .transform((x) => new BusReplacementsDisruptionData(x.sections));

  toBson(): z.input<typeof BusReplacementsDisruptionData.bson> {
    return {
      type: "bus-replacements",
      sections: this.sections.map((x) => x.toBson()),
    };
  }

  getImpactedLines(): readonly number[] {
    return unique(this.sections.map((x) => x.line));
  }

  getWriteupAuthor(): DisruptionWriteupAuthor {
    return new BusReplacementsDisruptionWriteupAuthor(this);
  }

  getRouteGraphModifier(): RouteGraphModifier {
    return new BusReplacementsRouteGraphModifier(this.sections);
  }
}
