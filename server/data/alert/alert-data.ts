import { PtvAlert } from "@/server/services/alert-source/ptv-alert";
import { arraysMatch } from "@dan-schel/js-utils";
import { z } from "zod";

/**
 * Represents the data published in a PTV API disruption alert at a moment in
 * time. If an alert is updated by PTV after it was already published, the alert
 * will have two instances of this class: one for the original data, and one for
 * the updated data (enables us to show the diff to the admin).
 */
export class AlertData {
  constructor(
    readonly title: string,
    readonly description: string,
    readonly url: string,
    readonly startsAt: Date | null,
    readonly endsAt: Date | null,
    readonly affectedLinePtvIds: number[],
    readonly affectedStationPtvIds: number[],
  ) {}

  static readonly bson = z
    .object({
      title: z.string(),
      description: z.string(),
      url: z.string(),
      startsAt: z.date().nullable(),
      endsAt: z.date().nullable(),
      affectedLinePtvIds: z.number().array(),
      affectedStationPtvIds: z.number().array(),
    })
    .transform(
      (x) =>
        new AlertData(
          x.title,
          x.description,
          x.url,
          x.startsAt,
          x.endsAt,
          x.affectedLinePtvIds,
          x.affectedStationPtvIds,
        ),
    );

  toBson(): z.input<typeof AlertData.bson> {
    return {
      title: this.title,
      description: this.description,
      url: this.url,
      startsAt: this.startsAt,
      endsAt: this.endsAt,
      affectedLinePtvIds: this.affectedLinePtvIds,
      affectedStationPtvIds: this.affectedStationPtvIds,
    };
  }

  equals(other: AlertData) {
    return (
      this.title === other.title &&
      this.description === other.description &&
      this.url === other.url &&
      this.startsAt === other.startsAt &&
      this.endsAt === other.endsAt &&
      arraysMatch(this.affectedLinePtvIds, other.affectedLinePtvIds) &&
      arraysMatch(this.affectedStationPtvIds, other.affectedStationPtvIds)
    );
  }

  static fromPtvAlert(ptvAlert: PtvAlert) {
    return new AlertData(
      ptvAlert.title,
      ptvAlert.description,
      ptvAlert.url,
      new Date(ptvAlert.fromDate),
      ptvAlert.toDate ? new Date(ptvAlert.toDate) : null,
      ptvAlert.routeIds,
      ptvAlert.stopIds,
    );
  }
}
