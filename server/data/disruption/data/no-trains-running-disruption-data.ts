import { z } from "zod";
import { LineSection } from "@/server/data/line-section";
import { RouteGraphModifier } from "@/server/data/disruption/route-graph-modifier/route-graph-modifier";
import { DisruptionWriteupAuthor } from "@/server/data/disruption/writeup/disruption-writeup-author";
import { DisruptionDataBase } from "@/server/data/disruption/data/disruption-data-base";
import { unique } from "@dan-schel/js-utils";
import { NoTrainsRunningDisruptionWriteupAuthor } from "@/server/data/disruption/writeup/no-trains-running-disruption-writeup-author";
import { NoTrainsRunningRouteGraphModifier } from "@/server/data/disruption/route-graph-modifier/no-trains-running-route-graph-modifier";
import { App } from "@/server/app";
import { MapHighlighter } from "@/server/data/disruption/map-highlighting/map-highlighter";
import { SectionMapHighlighter } from "@/server/data/disruption/map-highlighting/section-map-highlighter";

/**
 * Trains are not running on one or more sections of the network, and there is
 * no alternative.
 */
export class NoTrainsRunningDisruptionData extends DisruptionDataBase {
  constructor(readonly sections: LineSection[]) {
    super();

    if (sections.length === 0) {
      throw new Error("Must have at least one section.");
    }
  }

  static readonly bson = z
    .object({
      type: z.literal("no-trains-running"),
      sections: LineSection.bson.array(),
    })
    .transform((x) => new NoTrainsRunningDisruptionData(x.sections));

  toBson(): z.input<typeof NoTrainsRunningDisruptionData.bson> {
    return {
      type: "no-trains-running",
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
    return new NoTrainsRunningDisruptionWriteupAuthor(this);
  }

  getRouteGraphModifier(): RouteGraphModifier {
    return new NoTrainsRunningRouteGraphModifier(this.sections);
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
