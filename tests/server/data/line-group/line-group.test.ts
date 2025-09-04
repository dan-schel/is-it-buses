import { LineGroup } from "@/server/data/line-group/line-group";
import { describe, expect, it } from "vitest";

describe("LineGroup", () => {
  describe("constructor", () => {
    it("doesn't throw for a valid tree", () => {
      const lineIds = [1, 2, 3];
      const branches = [
        ["the-city", 1, 2],
        ["the-city", 1, 3, 4],
        ["the-city", 1, 3, 5],
      ] as const;
      expect(() => new LineGroup(branches, lineIds)).not.toThrow();
    });

    it("allows duplicated line IDs", () => {
      // e.g. The Ballarat line which has two branches, but still considered the
      // same line.
      const lineIds = [1, 1];
      const branches = [
        ["the-city", 1, 2],
        ["the-city", 1, 3],
      ] as const;
      expect(() => new LineGroup(branches, lineIds)).not.toThrow();
    });

    it("ensures that every branch has a line ID", () => {
      const lineIds = [1];
      const branches = [
        ["the-city", 1, 2],
        ["the-city", 1, 3],
      ] as const;
      expect(() => new LineGroup(branches, lineIds)).toThrow();
    });

    it("ensures the input forms a valid tree shape", () => {
      const lineIds = [1, 2];

      const branches1 = [
        ["the-city", 1, 2],
        ["the-city", 2],
      ] as const;
      expect(() => new LineGroup(branches1, lineIds)).toThrow();

      const branches2 = [
        ["the-city", 1, 2],
        [2, 1, "the-city"],
      ] as const;
      expect(() => new LineGroup(branches2, lineIds)).toThrow();

      const branches3 = [
        [1, 2, 3, 4],
        [1, 5, 2, 3, 4],
      ] as const;
      expect(() => new LineGroup(branches3, lineIds)).toThrow();
    });
  });
});
