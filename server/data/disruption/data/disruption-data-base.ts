import { App } from "@/server/app";
import { MapHighlighter } from "@/server/data/disruption/map-highlighting/map-highlighter";
import { DisruptionWriteupAuthor } from "@/server/data/disruption/writeup/disruption-writeup-author";
import { FilterableDisruptionCategory } from "@/shared/settings";

/** Stores the data inherent to this particular type of disruption. */
export abstract class DisruptionDataBase {
  abstract inspect(): string;
  abstract getImpactedLines(app: App): readonly number[];
  abstract getWriteupAuthor(): DisruptionWriteupAuthor;
  abstract getMapHighlighter(): MapHighlighter;
  abstract isValid(app: App): boolean;
  abstract getApplicableCategory(app: App): FilterableDisruptionCategory | null;
}
