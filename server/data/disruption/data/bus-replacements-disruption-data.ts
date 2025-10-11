import { z } from "zod";
import { DisruptionWriteupAuthor } from "@/server/data/disruption/writeup/disruption-writeup-author";
import { DisruptionDataBase } from "@/server/data/disruption/data/disruption-data-base";
import { BusReplacementsDisruptionWriteupAuthor } from "@/server/data/disruption/writeup/bus-replacements-disruption-writeup-author";
import { App } from "@/server/app";
import { MapHighlighter } from "@/server/data/disruption/map-highlighting/map-highlighter";
import { SectionMapHighlighter } from "@/server/data/disruption/map-highlighting/section-map-highlighter";
import { FilterableDisruptionCategory } from "@/shared/settings";
import { LineGroupSection } from "@/server/data/line-group/line-group-section";

/** All or part of one or more train lines are replaced by buses. */
export class BusReplacementsDisruptionData extends DisruptionDataBase {
  constructor(readonly section: LineGroupSection) {
    super();
  }

  static readonly bson = z
    .object({
      type: z.literal("bus-replacements"),
      section: LineGroupSection.bson,
    })
    .transform((x) => new BusReplacementsDisruptionData(x.section));

  toBson(): z.input<typeof BusReplacementsDisruptionData.bson> {
    return {
      type: "bus-replacements",
      section: this.section.toBson(),
    };
  }

  inspect(): string {
    return JSON.stringify(this.toBson(), undefined, 2);
  }

  getImpactedLines(app: App): readonly number[] {
    const group = app.groups.require(this.section.groupId);
    return this.section.getImpactedLines(group);
  }

  getWriteupAuthor(): DisruptionWriteupAuthor {
    return new BusReplacementsDisruptionWriteupAuthor(this);
  }

  getMapHighlighter(): MapHighlighter {
    return new SectionMapHighlighter(this.section);
  }

  isValid(app: App): boolean {
    const group = app.groups.require(this.section.groupId);
    return this.section.isValid(group);
  }

  applicableCategory(_app: App): FilterableDisruptionCategory | null {
    return null;
  }
}
