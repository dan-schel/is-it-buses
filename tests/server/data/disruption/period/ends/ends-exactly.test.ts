import { describe, expect, it } from "vitest";
import { EndsExactly } from "@/server/data/disruption/period/ends/ends-exactly";

describe("EndsExactly", () => {
  const end1 = new EndsExactly(new Date("2025-03-20T15:00:00+11:00"));
  const end2 = new EndsExactly(new Date("2026-06-01T08:00:00+10:00"));

  describe("#getDisplayString", () => {
    it("works", () => {
      const options = {
        now: new Date("2025-03-07T10:24:14.000+11:00"),
      };
      expect(end1.getDisplayString(options)).toBe("3:00pm Thu 20th Mar");
      expect(end2.getDisplayString(options)).toBe("8:00am Mon 1st Jun 2026");
    });
  });

  describe("#latestInterpretableDate", () => {
    it("works", () => {
      expect(end1.getLatestInterpretableDate()).toEqual(
        new Date("2025-03-20T15:00:00+11:00"),
      );
    });
  });
});
