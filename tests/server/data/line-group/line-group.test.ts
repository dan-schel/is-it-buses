import { LineGroup } from "@/server/data/line-group/line-group";
import { LineGroupEdge } from "@/server/data/line-group/line-group-edge";
import { describe, expect, it } from "vitest";

describe("LineGroup", () => {
  describe("#constructor", () => {
    const id = 400;
    const overrides = new Map([["the-city", [100]]] as const);

    it("doesn't throw for a valid tree", () => {
      const lines = [1, 2, 3];
      const branches = [
        ["the-city", 1, 2],
        ["the-city", 1, 3, 4],
        ["the-city", 1, 3, 5],
      ] as const;
      expect(() => new LineGroup(id, branches, lines, overrides)).not.toThrow();
    });

    it("allows duplicated line IDs", () => {
      // e.g. The Ballarat line which has two branches, but still considered the
      // same line.
      const lines = [1, 1];
      const branches = [
        ["the-city", 1, 2],
        ["the-city", 1, 3],
      ] as const;
      expect(() => new LineGroup(id, branches, lines, overrides)).not.toThrow();
    });

    it("ensures that every branch has a line ID", () => {
      const lines = [1];
      const branches = [
        ["the-city", 1, 2],
        ["the-city", 1, 3],
      ] as const;
      expect(() => new LineGroup(id, branches, lines, overrides)).toThrow();
    });

    it("ensures the input forms a valid tree shape", () => {
      const lines = [1, 2];

      const branches1 = [
        ["the-city", 1, 2],
        ["the-city", 2],
      ] as const;
      expect(() => new LineGroup(id, branches1, lines, overrides)).toThrow();

      const branches2 = [
        ["the-city", 1, 2],
        [2, 1, "the-city"],
      ] as const;
      expect(() => new LineGroup(id, branches2, lines, overrides)).toThrow();

      const branches3 = [
        [1, 2, 3, 4],
        [1, 5, 2, 3, 4],
      ] as const;
      expect(() => new LineGroup(id, branches3, lines, new Map())).toThrow();
    });

    it("ensures every node with an override exists in a branch", () => {
      const branches = [[1, 2]] as const;
      expect(() => new LineGroup(id, branches, [1], overrides)).toThrow();
    });

    it("ensures any non-numeric nodes have station overrides", () => {
      const branches = [[1, 2, "the-city"]] as const;
      expect(() => new LineGroup(id, branches, [1], new Map())).toThrow();
      expect(() => new LineGroup(id, branches, [1], overrides)).not.toThrow();
    });
  });

  describe("#getEdgesBetween", () => {
    const branchA = [1, 2, 3, 4] as const;
    const branchB = [1, 2, 5, 6] as const;
    const group = new LineGroup(400, [branchA, branchB], [1, 2], new Map());

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
