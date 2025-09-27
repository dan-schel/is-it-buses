import { uuid } from "@dan-schel/js-utils";
import { addDays } from "date-fns";

export class Session {
  private static readonly DURATION_DAYS = 30;

  constructor(
    readonly id: string,
    readonly token: string,
    readonly userId: string,
    readonly expiresAt: Date,
  ) {}

  static create(userId: string, now: Date): Session {
    const expiresAt = addDays(now, Session.DURATION_DAYS);
    return new Session(uuid(), this._randomToken(), userId, expiresAt);
  }

  private static _randomToken(): string {
    return crypto
      .getRandomValues(new Uint8Array(32))
      .reduce((str, x) => str + x.toString(16).padStart(2, "0"), "");
  }
}
