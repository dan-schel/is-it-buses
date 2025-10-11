import { describe, expect, it } from "vitest";
import { EndsWhenAlertEnds } from "@/server/data/disruption/period/ends/ends-when-alert-ends";

describe("EndsWhenAlertEnds", () => {
  const end = new EndsWhenAlertEnds("1", new Date("2025-03-20T15:00:00+11:00"));

  describe("#getDisplayString", () => {
    it("works", () => {
      const options = {
        now: new Date("2025-03-07T10:24:14.000+11:00"),
      };
      expect(end.getDisplayString(options)).toBe("3:00pm Thu 20th Mar");
    });
  });

  describe("latestInterpretableDate", () => {
    it("works", () => {
      expect(end.getLatestInterpretableDate()).toEqual(
        new Date("2025-03-20T15:00:00+11:00"),
      );
    });
  });
});
