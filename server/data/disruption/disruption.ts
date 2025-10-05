import { DisruptionPeriod } from "@/server/data/disruption/period/disruption-period";
import { DisruptionData } from "@/server/data/disruption/data/disruption-data";
import z from "zod";

const curationTypes = ["manual", "automatic"] as const;
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

  with({
    id = this.id,
    data = this.data,
    period = this.period,
    sourceAlertId = this.sourceAlertId,
    curationType = this.curationType,
  }: {
    id?: string;
    data?: DisruptionData;
    period?: DisruptionPeriod;
    sourceAlertId?: string | null;
    curationType?: CurationType;
  }) {
    return new Disruption(id, data, period, sourceAlertId, curationType);
  }
}
