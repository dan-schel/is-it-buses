import { describe, expect, it } from "vitest";
import { EndsNever } from "@/server/data/disruption/period/ends/ends-never";

describe("EndsNever", () => {
  const end = new EndsNever();

  describe("#getDisplayString", () => {
    it("works", () => {
      const options = {
        now: new Date("2025-03-07T10:24:14.000+11:00"),
      };
      expect(end.getDisplayString(options)).toBe("further notice");
    });
  });

  describe("#latestInterpretableDate", () => {
    it("works", () => {
      expect(end.getLatestInterpretableDate()).toBeNull();
    });
  });
});
