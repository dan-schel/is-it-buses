import { describe, expect, it } from "vitest";
import { LineGroupEdge } from "@/server/data/line-group/line-group-edge";

describe("LineGroupEdge", () => {
  describe("#constructor", () => {
    it("succeeds if two different nodes are used", () => {
      const edge = new LineGroupEdge(1, 2);
      expect(edge.a).toBe(1);
      expect(edge.b).toBe(2);
    });

    it("throws when a and b are the same node", () => {
      expect(() => new LineGroupEdge(1, 1)).toThrow();
    });
  });

  describe(".chain", () => {
    it("throws when fewer than two nodes are provided", () => {
      expect(() => LineGroupEdge.chain([1])).toThrow();
    });

    it("creates sequential edges between consecutive nodes", () => {
      const nodes = [1, 2, 3, 4] as const;
      const edges = LineGroupEdge.chain(nodes);

      expect(edges).toHaveLength(nodes.length - 1);
      expect(edges[0].a).toBe(1);
      expect(edges[0].b).toBe(2);
      expect(edges[1].a).toBe(2);
      expect(edges[1].b).toBe(3);
      expect(edges[2].a).toBe(3);
      expect(edges[2].b).toBe(4);
    });
  });
});
