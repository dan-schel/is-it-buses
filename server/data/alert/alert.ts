import { AlertData } from "@/server/data/alert/alert-data";
import z from "zod";

export const alertStates = [
  // In the inbox awaiting processing (auto-parsing failed for this alert).
  "new",

  // Auto-parsed, but still in the inbox (lower confidence).
  "processed-provisionally",

  // Auto-parsed, and removed from the inbox (higher confidence).
  "processed-automatically",

  // Manually processed and removed from the inbox.
  "processed-manually",

  // Manually processed, but back in the inbox due to an AlertData update.
  "updated-since-manual-processing",

  // Auto-parsing flagged this alert as one to ignore.
  "ignored-automatically",

  // Manually ignored, but eligible to return to the inbox upon an AlertData
  // update.
  "ignored-manually",

  // Manually ignored, permanently (will never automatically return to the inbox).
  "ignored-permanently",
] as const;
export type AlertState = (typeof alertStates)[number];
export const alertStateJson = z.enum(alertStates);

/**
 * Represents a disruption alert from the PTV API. May or may not correlate to
 * an actual disruption shown on the site (e.g. we may choose to ignore some,
 * split some alerts into multiple separate disruptions, or combine multiple
 * alerts into a single disruption). Allows us to track which alerts we've seen
 * before, which ones we've processed, etc.
 */
export class Alert {
  constructor(
    readonly id: string,
    readonly state: AlertState,
    readonly data: AlertData,
    readonly updatedData: AlertData | null,
    readonly appearedAt: Date,
    readonly processedAt: Date | null,
    readonly updatedAt: Date | null,
    readonly deleteAt: Date | null,
  ) {
    this._assertForStates(
      updatedData != null,
      "updatedData != null",
      "updated-since-manual-processing",
    );
    this._assertForStates(
      updatedAt != null,
      "updatedAt != null",
      "updated-since-manual-processing",
    );
    this._assertForStates(processedAt == null, "processedAt == null", "new");
  }

  get latestData() {
    return this.updatedData ?? this.data;
  }

  get isInInbox() {
    return this._isState(
      "new",
      "processed-provisionally",
      "updated-since-manual-processing",
    );
  }

  get wasAutomaticallyProcessed() {
    return this._isState(
      "processed-provisionally",
      "processed-automatically",
      "ignored-automatically",
    );
  }

  get wasManuallyProcessed() {
    return this._isState(
      "processed-manually",
      "updated-since-manual-processing",
      "ignored-manually",
    );
  }

  get hasResultantDisruptions() {
    return this._isState(
      "processed-provisionally",
      "processed-automatically",
      "processed-manually",
      "updated-since-manual-processing",
    );
  }

  with({
    id = this.id,
    state = this.state,
    data = this.data,
    updatedData = this.updatedData,
    appearedAt = this.appearedAt,
    processedAt = this.processedAt,
    updatedAt = this.updatedAt,
    deleteAt = this.deleteAt,
  }: {
    id?: string;
    state?: AlertState;
    data?: AlertData;
    updatedData?: AlertData | null;
    appearedAt?: Date;
    processedAt?: Date | null;
    updatedAt?: Date | null;
    deleteAt?: Date | null;
  }) {
    return new Alert(
      id,
      state,
      data,
      updatedData,
      appearedAt,
      processedAt,
      updatedAt,
      deleteAt,
    );
  }

  private _assertForStates(
    condition: boolean,
    message: string,
    ...states: AlertState[]
  ) {
    if (condition && !states.includes(this.state)) {
      throw new Error(`Not expecting ${message} for "${this.state}" alert.`);
    }
    if (!condition && states.includes(this.state)) {
      throw new Error(`Expecting ${message} for "${this.state}" alert.`);
    }
  }

  private _isState(...states: AlertState[]) {
    return states.includes(this.state);
  }
}
