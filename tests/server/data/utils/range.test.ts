import { describe, it, expect } from "vitest";
import { Range } from "@/server/data/range";

describe("Range", () => {
  describe("constructor", () => {
    it("should create a Range instance with valid min and max", () => {
      const range = new Range(1, 5);
      expect(range.min).toBe(1);
      expect(range.max).toBe(5);
    });

    it("should throw an error if min is greater than max", () => {
      expect(() => new Range(5, 1)).toThrow("Min cannot be greater than max.");
    });
  });

  describe("#equals", () => {
    it("should return true for ranges that are equal", () => {
      const range1 = new Range(1, 5);
      const range2 = new Range(1, 5);
      expect(range1.equals(range2)).toBe(true);
    });

    it("should return false for ranges that are not equal", () => {
      const range1 = new Range(1, 5);
      const range2 = new Range(2, 6);
      expect(range1.equals(range2)).toBe(false);
    });

    it("should consider floating point fudge factor", () => {
      const range1 = new Range(1, 5);
      const range2 = new Range(1 + 0.0000005, 5 - 0.0000005);
      expect(range1.equals(range2)).toBe(true);
    });
  });

  describe("#condense", () => {
    it("should return an empty array if input is empty", () => {
      const ranges: Range[] = [];
      expect(Range.condense(ranges)).toEqual([]);
    });

    it("should return the same array if there is only one range", () => {
      const ranges = [new Range(1, 5)];
      expect(Range.condense(ranges)).toEqual(ranges);
    });

    it("should merge overlapping ranges", () => {
      const ranges = [new Range(1, 5), new Range(4, 8)];
      const condensed = Range.condense(ranges);
      expect(condensed).toEqual([new Range(1, 8)]);
    });

    it("should merge adjacent ranges considering floating point fudge factor", () => {
      const ranges = [new Range(1, 5), new Range(5 + 0.0000005, 8)];
      const condensed = Range.condense(ranges);
      expect(condensed).toEqual([new Range(1, 8)]);
    });

    it("should not merge non-overlapping ranges", () => {
      const ranges = [new Range(1, 5), new Range(6, 8)];
      const condensed = Range.condense(ranges);
      expect(condensed).toEqual([new Range(1, 5), new Range(6, 8)]);
    });

    it("should handle multiple overlapping and non-overlapping ranges", () => {
      const ranges = [
        new Range(1, 3),
        new Range(2, 6),
        new Range(8, 10),
        new Range(9, 12),
      ];
      const condensed = Range.condense(ranges);
      expect(condensed).toEqual([new Range(1, 6), new Range(8, 12)]);
    });
  });
});
