import { z } from "zod";
import { DisruptionWriteupInputJson } from "@/shared/schemas/common/disruption-writeup-input";
import { MapHighlightingInputJson } from "@/shared/schemas/common/map-highlighting-input";
import {
  RouteGraphEdgeInputJson,
  RouteGraphTrainEdgeInputJson,
} from "@/shared/schemas/common/route-graph-edge-input";

export const LineSectionInputJson = z.object({
  line: z.number(),
  a: z.string(),
  b: z.string(),
});
export type LineSectionInput = z.infer<typeof LineSectionInputJson>;

export const CustomDisruptionDataInputJson = z.object({
  impactedLines: z.number().array(),
  writeup: DisruptionWriteupInputJson,
  edgesToRemove: RouteGraphTrainEdgeInputJson.array(),
  edgesToAdd: RouteGraphEdgeInputJson.array(),
  highlighting: MapHighlightingInputJson,
});
export type CustomDisruptionDataInput = z.infer<
  typeof CustomDisruptionDataInputJson
>;

export const StationClosureDisruptionDataInputJson = z.object({
  stationId: z.number(),
});
export type StationClosureDisruptionDataInput = z.infer<
  typeof StationClosureDisruptionDataInputJson
>;

export const BusReplacementsDisruptionDataInputJson = z.object({
  sections: LineSectionInputJson.array(),
});
export type BusReplacementsDisruptionDataInput = z.infer<
  typeof BusReplacementsDisruptionDataInputJson
>;

export const DelaysDisruptionDataInputJson = z.object({
  stationId: z.number(),
  delayInMinutes: z.number(),
});
export type DelaysDisruptionDataInput = z.infer<
  typeof DelaysDisruptionDataInputJson
>;

export const NoCityLoopDisruptionDataInputJson = z.object({
  lineIds: z.number().array(),
});
export type NoCityLoopDisruptionDataInput = z.infer<
  typeof NoCityLoopDisruptionDataInputJson
>;

export const NoTrainsRunningDisruptionDataInputJson = z.object({
  sections: LineSectionInputJson.array(),
});
export type NoTrainsRunningDisruptionDataInput = z.infer<
  typeof NoTrainsRunningDisruptionDataInputJson
>;

export const DisruptionDataInputJson = z.discriminatedUnion("type", [
  z.object({ type: z.literal("custom") }).merge(CustomDisruptionDataInputJson),
  z
    .object({ type: z.literal("station-closure") })
    .merge(StationClosureDisruptionDataInputJson),
  z
    .object({ type: z.literal("bus-replacements") })
    .merge(BusReplacementsDisruptionDataInputJson),
  z.object({ type: z.literal("delays") }).merge(DelaysDisruptionDataInputJson),
  z
    .object({ type: z.literal("no-city-loop") })
    .merge(NoCityLoopDisruptionDataInputJson),
  z
    .object({ type: z.literal("no-trains-running") })
    .merge(NoTrainsRunningDisruptionDataInputJson),
]);
export type DisruptionDataInput = z.infer<typeof DisruptionDataInputJson>;
