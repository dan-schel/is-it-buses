import { LineGroup } from "@/server/data/line-group/line-group";
import { LineGroupEdge } from "@/server/data/line-group/line-group-edge";
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
      expect(() => new LineGroup(branches, lineIds, new Map())).not.toThrow();
    });

    it("allows duplicated line IDs", () => {
      // e.g. The Ballarat line which has two branches, but still considered the
      // same line.
      const lineIds = [1, 1];
      const branches = [
        ["the-city", 1, 2],
        ["the-city", 1, 3],
      ] as const;
      expect(() => new LineGroup(branches, lineIds, new Map())).not.toThrow();
    });

    it("ensures that every branch has a line ID", () => {
      const lineIds = [1];
      const branches = [
        ["the-city", 1, 2],
        ["the-city", 1, 3],
      ] as const;
      expect(() => new LineGroup(branches, lineIds, new Map())).toThrow();
    });

    it("ensures the input forms a valid tree shape", () => {
      const lineIds = [1, 2];

      const branches1 = [
        ["the-city", 1, 2],
        ["the-city", 2],
      ] as const;
      expect(() => new LineGroup(branches1, lineIds, new Map())).toThrow();

      const branches2 = [
        ["the-city", 1, 2],
        [2, 1, "the-city"],
      ] as const;
      expect(() => new LineGroup(branches2, lineIds, new Map())).toThrow();

      const branches3 = [
        [1, 2, 3, 4],
        [1, 5, 2, 3, 4],
      ] as const;
      expect(() => new LineGroup(branches3, lineIds, new Map())).toThrow();
    });

    it("ensures every node with an override exists in a branch", () => {
      expect(true).toBe(false);
    });

    it("ensures any non-numeric nodes have station overrides", () => {
      expect(true).toBe(false);
    });
  });

  describe("#getEdgesBetween", () => {
    const branchA = [1, 2, 3, 4] as const;
    const branchB = [1, 2, 5, 6] as const;
    const group = new LineGroup([branchA, branchB], [1, 2], new Map());

    it("works", () => {
      expectEdges(group.getEdgesBetween(1, 3), [
        [1, 2],
        [2, 3],
      ]);
    });

    it("reverses the order of edges when needed", () => {
      expectEdges(group.getEdgesBetween(3, 1), [
        [3, 2],
        [2, 1],
      ]);
    });

    it("returns an empty array when nodes are the same", () => {
      expectEdges(group.getEdgesBetween(2, 2), []);
    });

    it("throw an error when nodes are on different branches", () => {
      expect(() => group.getEdgesBetween(3, 6)).toThrow();
    });

    function expectEdges(real: LineGroupEdge[], expected: [number, number][]) {
      expect(real.map((e) => [e.a, e.b])).toEqual(expected);
    }
  });
});
