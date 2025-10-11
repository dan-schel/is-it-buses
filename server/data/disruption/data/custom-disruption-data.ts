import { z } from "zod";
import { DisruptionDataBase } from "@/server/data/disruption/data/disruption-data-base";
import {
  DisruptionWriteup,
  LineStatusIndicatorPriority,
  SummaryIconType,
} from "@/server/data/disruption/writeup/disruption-writeup";
import { DisruptionWriteupAuthor } from "@/server/data/disruption/writeup/disruption-writeup-author";
import { CustomDisruptionWriteupAuthor } from "@/server/data/disruption/writeup/custom-disruption-writeup-author";
import { CustomMapHighlighter } from "@/server/data/disruption/map-highlighting/custom-map-highlighter";
import { MapHighlighting } from "@/server/data/disruption/map-highlighting/map-highlighting";
import { MapHighlighter } from "@/server/data/disruption/map-highlighting/map-highlighter";
import { App } from "@/server/app";
import {
  filterableDisruptionCategories,
  FilterableDisruptionCategory,
} from "@/shared/settings";

/**
 * Used in edge cases where the normal disruption types we have don't cut it.
 * Allows each use case of the disruption data (e.g. the display string, routing
 * graph modifications, etc.) to be provided manually.
 */
export class CustomDisruptionData extends DisruptionDataBase {
  constructor(
    readonly impactedLines: readonly number[],
    readonly writeup: DisruptionWriteup,
    readonly highlighting: MapHighlighting,
    readonly category: FilterableDisruptionCategory | null,
  ) {
    super();
  }

  static readonly bson = z
    .object({
      type: z.literal("custom"),
      impactedLines: z.number().array().readonly(),
      writeup: DisruptionWriteup.bson,
      highlighting: MapHighlighting.bson,
      category: z.enum(filterableDisruptionCategories).nullable(),
    })
    .transform(
      (x) =>
        new CustomDisruptionData(
          x.impactedLines,
          x.writeup,
          x.highlighting,
          x.category,
        ),
    );

  toBson(): z.input<typeof CustomDisruptionData.bson> {
    return {
      type: "custom",
      impactedLines: this.impactedLines,
      writeup: this.writeup.toBson(),
      highlighting: this.highlighting.toBson(),
      category: this.category,
    };
  }

  inspect(): string {
    return JSON.stringify(this.toBson(), undefined, 2);
  }

  getImpactedLines(): readonly number[] {
    return this.impactedLines;
  }

  getWriteupAuthor(): DisruptionWriteupAuthor {
    return new CustomDisruptionWriteupAuthor(this);
  }

  getMapHighlighter(): MapHighlighter {
    return new CustomMapHighlighter(this.highlighting);
  }

  isValid(app: App): boolean {
    return this.impactedLines.every((x) => app.lines.has(x));
  }

  getApplicableCategory(_app: App): FilterableDisruptionCategory | null {
    return this.category;
  }

  static simple(
    title: string,
    description?: string,
    icon?: SummaryIconType,
    priority?: LineStatusIndicatorPriority,
    category: FilterableDisruptionCategory | null = null,
    highlighting: MapHighlighting = MapHighlighting.none,
  ) {
    return new CustomDisruptionData(
      [],
      DisruptionWriteup.simple(title, description, icon, priority),
      highlighting,
      category,
    );
  }
}
