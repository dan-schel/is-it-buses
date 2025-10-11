import { describe, expect, it } from "vitest";
import { EndsAfterLastService } from "@/server/data/disruption/period/ends/ends-after-last-service";
import { JustDate } from "@/server/data/disruption/period/utils/just-date";

describe("EndsAfterLastService", () => {
  describe("#getDisplayString", () => {
    it("works", () => {
      const options = {
        now: new Date("2025-03-07T10:24:14.000+11:00"),
      };

      expect(withDate(2025, 3, 7).getDisplayString(options)).toBe(
        "last service Fri 7th Mar",
      );
      expect(withDate(2026, 6, 7).getDisplayString(options)).toBe(
        "last service Sun 7th Jun 2026",
      );
    });
  });

  describe("latestInterpretableDate", () => {
    it("works", () => {
      expect(withDate(2025, 3, 7).getLatestInterpretableDate()).toEqual(
        new Date("2025-03-08T03:00:00.000+11:00"),
      );
      expect(withDate(2026, 6, 7).getLatestInterpretableDate()).toEqual(
        new Date("2026-06-08T03:00:00.000+10:00"),
      );
    });

    it("works around daylight savings", () => {
      // DST ends Sun Apr 6th 2025. 2am to 3am is repeated.
      expect(withDate(2025, 4, 4).getLatestInterpretableDate()).toEqual(
        new Date("2025-04-05T03:00:00.000+11:00"),
      );
      expect(withDate(2025, 4, 5).getLatestInterpretableDate()).toEqual(
        // Until last service Saturday = until the second 3am.
        new Date("2025-04-06T03:00:00.000+10:00"),
      );
      expect(withDate(2025, 4, 6).getLatestInterpretableDate()).toEqual(
        new Date("2025-04-07T03:00:00.000+10:00"),
      );

      // DST starts Sun Oct 5th 2025. 2am to 3am is skipped.
      expect(withDate(2025, 10, 3).getLatestInterpretableDate()).toEqual(
        new Date("2025-10-04T03:00:00.000+10:00"),
      );
      expect(withDate(2025, 10, 4).getLatestInterpretableDate()).toEqual(
        // Until last service Saturday = until 3am in the new timezone.
        new Date("2025-10-05T03:00:00.000+11:00"),
      );
      expect(withDate(2025, 10, 5).getLatestInterpretableDate()).toEqual(
        new Date("2025-10-06T03:00:00.000+11:00"),
      );
    });
  });

  function withDate(year: number, month: number, day: number) {
    return new EndsAfterLastService(new JustDate(year, month, day));
  }
});
