import { z } from "zod";
import { App } from "@/server/app";
import { DisruptionDataBase } from "@/server/data/disruption/data/disruption-data-base";
import { MapHighlighter } from "@/server/data/disruption/map-highlighting/map-highlighter";
import { RouteGraphModifier } from "@/server/data/disruption/route-graph-modifier/route-graph-modifier";
import { DisruptionWriteupAuthor } from "@/server/data/disruption/writeup/disruption-writeup-author";
import { DelaysDisruptionWriteupAuthor } from "@/server/data/disruption/writeup/delays-disruption-writeup-author";
import { LineSection } from "@/server/data/line-section";
import { DelayMapHighlighter } from "@/server/data/disruption/map-highlighting/delay-map-highlighter";
import { SimpleRouteGraphModifier } from "@/server/data/disruption/route-graph-modifier/simple-route-graph-modifier";

export class DelaysDisruptionData extends DisruptionDataBase {
  constructor(
    readonly stationId: number,
    readonly delayInMinutes: number,
    readonly sections: LineSection[],
  ) {
    super();

    if (sections.length === 0) {
      throw new Error("Must have at least one section.");
    }

    if (!Number.isInteger(delayInMinutes) || delayInMinutes < 1) {
      throw new Error(
        `Invalid delay in minutes: ${delayInMinutes}. Must be an integer` +
          "that is greater than 0.",
      );
    }
  }

  static readonly bson = z
    .object({
      type: z.literal("delays"),
      stationId: z.number(),
      delayInMinutes: z.number(),
      sections: LineSection.bson.array(),
    })
    .transform(
      (x) =>
        new DelaysDisruptionData(x.stationId, x.delayInMinutes, x.sections),
    );

  inspect(): string {
    return JSON.stringify(this.toBson(), undefined, 2);
  }

  toBson(): z.input<typeof DelaysDisruptionData.bson> {
    return {
      type: "delays",
      stationId: this.stationId,
      delayInMinutes: this.delayInMinutes,
      sections: this.sections.map((x) => x.toBson()),
    };
  }

  getImpactedLines(_app: App): readonly number[] {
    return this.sections.map((x) => x.line);
  }

  getWriteupAuthor(): DisruptionWriteupAuthor {
    return new DelaysDisruptionWriteupAuthor(this);
  }

  getRouteGraphModifier(): RouteGraphModifier {
    // Services would usually continue running whilst there is a delay
    // Not entirely sure if we need to modify the graph
    return new SimpleRouteGraphModifier([], []);
  }

  getMapHighlighter(): MapHighlighter {
    return new DelayMapHighlighter(this.sections, [this.stationId]);
  }

  validate(app: App): boolean {
    return (
      this.sections.every((section) =>
        app.lines.get(section.line)?.isValidSection(section),
      ) && app.stations.has(this.stationId)
    );
  }
}
