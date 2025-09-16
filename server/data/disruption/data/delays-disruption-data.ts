import { z } from "zod";
import { App } from "@/server/app";
import { DisruptionDataBase } from "@/server/data/disruption/data/disruption-data-base";
import { MapHighlighter } from "@/server/data/disruption/map-highlighting/map-highlighter";
import { RouteGraphModifier } from "@/server/data/disruption/route-graph-modifier/route-graph-modifier";
import { DisruptionWriteupAuthor } from "@/server/data/disruption/writeup/disruption-writeup-author";
import { DelaysDisruptionWriteupAuthor } from "@/server/data/disruption/writeup/delays-disruption-writeup-author";
import { DelayMapHighlighter } from "@/server/data/disruption/map-highlighting/delay-map-highlighter";
import { SimpleRouteGraphModifier } from "@/server/data/disruption/route-graph-modifier/simple-route-graph-modifier";

export class DelaysDisruptionData extends DisruptionDataBase {
  constructor(
    readonly affectedLines: readonly number[],
    readonly stationId: number,
    readonly delayInMinutes: number,
  ) {
    super();

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
      affectedLines: z.number().array().readonly(),
      stationId: z.number(),
      delayInMinutes: z.number(),
    })
    .transform(
      (x) =>
        new DelaysDisruptionData(
          x.affectedLines,
          x.stationId,
          x.delayInMinutes,
        ),
    );

  inspect(): string {
    return JSON.stringify(this.toBson(), undefined, 2);
  }

  toBson(): z.input<typeof DelaysDisruptionData.bson> {
    return {
      type: "delays",
      affectedLines: this.affectedLines,
      stationId: this.stationId,
      delayInMinutes: this.delayInMinutes,
    };
  }

  getImpactedLines(_app: App): readonly number[] {
    return this.affectedLines;
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
    return new DelayMapHighlighter(this.stationId);
  }

  validate(app: App): boolean {
    return (
      this.affectedLines.every((line) => app.lines.has(line)) &&
      app.stations.has(this.stationId)
    );
  }
}
