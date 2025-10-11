import { describe, expect, it } from "vitest";
import { EndsApproximately } from "@/server/data/disruption/period/ends/ends-approximately";

describe("EndsApproximately", () => {
  const end1 = new EndsApproximately(
    "late March",
    new Date("2025-03-20T00:00:00+11:00"),
    new Date("2025-04-01T00:00:00+11:00"),
  );

  describe("#getDisplayString", () => {
    it("works", () => {
      const options = {
        now: new Date("2025-03-07T10:24:14.000+11:00"),
      };

      expect(end1.getDisplayString(options)).toBe("late March");
    });
  });

  describe("latestInterpretableDate", () => {
    it("works", () => {
      expect(end1.getLatestInterpretableDate()).toEqual(
        new Date("2025-04-01T00:00:00.000+11:00"),
      );
    });
  });
});
