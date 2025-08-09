import { PtvAlert } from "@/server/alert-source/ptv-alert";

export type Details = { details: string } | { error: DetailsError };

export type DetailsError =
  | "invalid-request"
  | "unknown-error"
  | "not-found"
  | "unsupported-url"
  | "rate-limited";

export abstract class AlertSource {
  abstract fetchDisruptions(): Promise<PtvAlert[]>;
  abstract fetchDetails(url: string): Promise<Details>;
}
