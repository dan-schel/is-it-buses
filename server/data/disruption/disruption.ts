import { DisruptionPeriod } from "@/server/data/disruption/period/disruption-period";
import { DisruptionData } from "@/server/data/disruption/data/disruption-data";
import z from "zod";

export const curationTypes = ["manual", "automatic"] as const;
export type CurationType = (typeof curationTypes)[number];
export const curationTypeJson = z.enum(curationTypes);

/**
 * Represents a curated disruption, ready for display on the site. Not to be
 * confused with an Alert, which is the raw data from the PTV API, which may or
 * may not be useful to us. ("Curated" here doesn't assume manual curation, it
 * could be automated in some cases.)
 */
export class Disruption {
  constructor(
    readonly id: string,
    readonly data: DisruptionData,
    readonly period: DisruptionPeriod,
    readonly sourceAlertId: string | null,
    readonly curationType: CurationType,
  ) {}
}
