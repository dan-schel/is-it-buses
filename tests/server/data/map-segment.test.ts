import { MapSegment } from "@/server/data/map-segment";
import { Range } from "@/server/data/utils/range";
import { describe, expect, it } from "vitest";

describe("MapSegment", () => {
  describe("#reverse", () => {
    it("swaps nodes and complements the range", () => {
      const original = new MapSegment(1, 2, new Range(0, 0.3));
      const reversed = original.reverse();
      expect(reversed).toEqual(new MapSegment(2, 1, new Range(0.7, 1)));
    });
  });

  describe("#equals", () => {
    it("works", () => {
      const a = new MapSegment(1, 2, new Range(0, 0.5));
      const b = new MapSegment(1, 2, new Range(0, 0.5));
      const c = new MapSegment(1, 3, new Range(0, 0.5));
      const d = new MapSegment(1, 2, new Range(0, 0.6));
      expect(a.equals(b)).toBe(true);
      expect(b.equals(a)).toBe(true);
      expect(a.equals(c)).toBe(false);
      expect(a.equals(d)).toBe(false);
    });

    it("treats reversed segments with complementary ranges as equal", () => {
      const a = new MapSegment(1, 2, new Range(0, 0.5));
      const b = new MapSegment(2, 1, new Range(0.5, 1));
      expect(a.equals(b)).toBe(true);
      expect(b.equals(a)).toBe(true);
    });
  });

  describe(".chain", () => {
    it("creates full segments between successive nodes", () => {
      const segments = MapSegment.chain([1, 2, 3]);
      expect(segments).toEqual([MapSegment.full(1, 2), MapSegment.full(2, 3)]);
    });

    it("normalizes the returned segments", () => {
      const segments = MapSegment.chain([3, 2, 1]);
      expect(segments).toEqual([MapSegment.full(2, 3), MapSegment.full(1, 2)]);
    });

    it("throws when fewer than two nodes provided", () => {
      expect(() => MapSegment.chain([])).toThrow();
      expect(() => MapSegment.chain([1])).toThrow();
    });
  });

  describe(".condense", () => {
    it("should combine neighbouring segments into one", () => {
      const segments = [
        new MapSegment(1, 2, new Range(0.25, 0.5)),
        new MapSegment(1, 2, new Range(0.5, 1)),
      ];
      const condensed = MapSegment.condense(segments);
      expect(condensed).toEqual([new MapSegment(1, 2, new Range(0.25, 1))]);
    });

    it("should handle reversed segments", () => {
      const segments = [
        new MapSegment(1, 2, new Range(0, 0.5)),
        new MapSegment(2, 1, new Range(0, 0.5)),
      ];
      const condensed = MapSegment.condense(segments);
      expect(condensed).toEqual([new MapSegment(1, 2, new Range(0, 1))]);
    });

    it("should treat different node pairs separately", () => {
      const segments = [
        new MapSegment(1, 2, new Range(0, 0.5)),
        new MapSegment(2, 3, new Range(0.5, 1)),
      ];
      const condensed = MapSegment.condense(segments);
      expect(condensed).toEqual([
        new MapSegment(1, 2, new Range(0, 0.5)),
        new MapSegment(2, 3, new Range(0.5, 1)),
      ]);
    });
  });
});
