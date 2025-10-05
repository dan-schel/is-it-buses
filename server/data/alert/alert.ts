import { AlertData } from "@/server/data/alert/alert-data";
import z from "zod";

const alertStates = [
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
type AlertState = (typeof alertStates)[number];
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
    if (state === "updated-since-manual-processing") {
      this._assertPresent(updatedData, "updatedData");
      this._assertPresent(updatedAt, "updatedAt");
    } else if (state !== "ignored-permanently") {
      this._assertIsNull(updatedData, "updatedData");
      this._assertIsNull(updatedAt, "updatedAt");
    }

    if (state !== "new") {
      this._assertPresent(processedAt, "processedAt");
    } else {
      this._assertIsNull(processedAt, "processedAt");
    }
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
      "ignored-permanently",
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

  static fresh({
    id,
    state,
    data,
    now,
  }: {
    id: string;
    state: AlertState;
    data: AlertData;
    now: Date;
  }) {
    const processedAt = state === "new" ? null : now;
    return new Alert(id, state, data, null, now, processedAt, null, null);
  }

  private _assertPresent(value: unknown, name: string) {
    if (value == null) {
      throw new Error(`${name} must be provided when state = "${this.state}".`);
    }
  }

  private _assertIsNull(value: unknown, name: string) {
    if (value != null) {
      throw new Error(`${name} must be null when state = "${this.state}".`);
    }
  }

  private _isState(...states: AlertState[]) {
    return states.includes(this.state);
  }
}
