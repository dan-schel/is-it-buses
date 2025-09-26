import { z } from "zod";
import { LineSection } from "@/server/data/line-section";
import { DisruptionWriteupAuthor } from "@/server/data/disruption/writeup/disruption-writeup-author";
import { DisruptionDataBase } from "@/server/data/disruption/data/disruption-data-base";
import { unique } from "@dan-schel/js-utils";
import { BusReplacementsDisruptionWriteupAuthor } from "@/server/data/disruption/writeup/bus-replacements-disruption-writeup-author";
import { App } from "@/server/app";
import { MapHighlighter } from "@/server/data/disruption/map-highlighting/map-highlighter";
import { SectionMapHighlighter } from "@/server/data/disruption/map-highlighting/section-map-highlighter";

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

  inspect(): string {
    return JSON.stringify(this.toBson(), undefined, 2);
  }

  getImpactedLines(_app: App): readonly number[] {
    return unique(this.sections.map((x) => x.line));
  }

  getWriteupAuthor(): DisruptionWriteupAuthor {
    return new BusReplacementsDisruptionWriteupAuthor(this);
  }

  getMapHighlighter(): MapHighlighter {
    return new SectionMapHighlighter(this.sections);
  }

  validate(app: App): boolean {
    return this.sections.every((section) =>
      app.lines.get(section.line)?.isValidSection(section),
    );
  }
}
