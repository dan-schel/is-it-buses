import { LineGroup } from "@/server/data/line-group/line-group";
import { LineGroupEdge } from "@/server/data/line-group/line-group-edge";
import { LineGroupNode } from "@/server/data/line-group/line-group-node";
import { LineGroupSection } from "@/server/data/line-group/line-group-section";
import { expectMatchingArrays } from "@/tests/utils";
import { describe, expect, it } from "vitest";

describe("LineGroupSection", () => {
  /*
   * 1 -- 2 -- 3 -- 4 (line 97)
   *        \
   *          5 -- 6 -- 7 -- 8 (line 98)
   *                 \
   *                   9 -- 10 (line 99)
   */
  const branches = [
    [1, 2, 3, 4],
    [1, 2, 5, 6, 7, 8],
    [1, 2, 5, 6, 9, 10],
  ];
  const lines = [97, 98, 99];
  const group = new LineGroup(400, branches, lines, new Map());

  describe("#isValid and #getReasonIsInvalid", () => {
    it("allows a single branch section", () => {
      const section = new LineGroupSection(group.id, 6, [8]);
      expect(section.isValid(group)).toBe(true);
      expect(section.getReasonIsInvalid(group)).toBeNull();
    });

    it("allows multi-branch sections", () => {
      const section1 = new LineGroupSection(group.id, 6, [8, 9]);
      expect(section1.isValid(group)).toBe(true);
      expect(section1.getReasonIsInvalid(group)).toBeNull();

      const section2 = new LineGroupSection(group.id, 1, [4, 8, 10]);
      expect(section2.isValid(group)).toBe(true);
      expect(section2.getReasonIsInvalid(group)).toBeNull();
    });

    it("allows sections where a branch is bypassed", () => {
      // e.g. In the below sections, line 97 is bypassed, and edges 2-3-4 are
      // not included in the section.

      const section1 = new LineGroupSection(group.id, 1, [6]);
      expect(section1.isValid(group)).toBe(true);
      expect(section1.getReasonIsInvalid(group)).toBeNull();

      const section2 = new LineGroupSection(group.id, 1, [5]);
      expect(section2.isValid(group)).toBe(true);
      expect(section2.getReasonIsInvalid(group)).toBeNull();

      const section3 = new LineGroupSection(group.id, 1, [7, 10]);
      expect(section3.isValid(group)).toBe(true);
      expect(section3.getReasonIsInvalid(group)).toBeNull();
    });

    it("returns false if any end nodes occur before the start node", () => {
      const section = new LineGroupSection(group.id, 8, [6]);
      expect(section.isValid(group)).toBe(false);
      expect(section.getReasonIsInvalid(group)).toBe(
        'Invalid end node "6" as it occurs before start node "8".',
      );
    });

    it("returns false if multiple end nodes are given for the same branch", () => {
      const section1 = new LineGroupSection(group.id, 6, [7, 8]);
      expect(section1.isValid(group)).toBe(false);
      expect(section1.getReasonIsInvalid(group)).toBe(
        'Node "8" cannot be an end node as upstream node "7" already is.',
      );

      const section2 = new LineGroupSection(group.id, 1, [10, 9]);
      expect(section2.isValid(group)).toBe(false);
      expect(section2.getReasonIsInvalid(group)).toBe(
        'Node "10" cannot be an end node as upstream node "9" already is.',
      );
    });

    it("returns false if end nodes are given for intermediate branches", () => {
      // e.g. "2" is the end of the section from line 97's perspective, but the
      // section continues on the other branches, so it shouldn't be given.
      const section = new LineGroupSection(group.id, 1, [2, 6]);
      expect(section.isValid(group)).toBe(false);
      expect(section.getReasonIsInvalid(group)).toBe(
        'Node "6" cannot be an end node as upstream node "2" already is.',
      );
    });

    it("returns false for single node sections", () => {
      const section1 = new LineGroupSection(group.id, 1, [1]);
      expect(section1.isValid(group)).toBe(false);
      expect(section1.getReasonIsInvalid(group)).toBe(
        'Start node "1" cannot also be an end node.',
      );

      const section2 = new LineGroupSection(group.id, 6, [6]);
      expect(section2.isValid(group)).toBe(false);
      expect(section2.getReasonIsInvalid(group)).toBe(
        'Start node "6" cannot also be an end node.',
      );
    });

    it("returns false if any nodes don't exist", () => {
      const section1 = new LineGroupSection(group.id, 49, [6]);
      expect(section1.isValid(group)).toBe(false);
      expect(section1.getReasonIsInvalid(group)).toBe(
        'Node "49" not valid for the given group.',
      );

      const section2 = new LineGroupSection(group.id, 1, [49]);
      expect(section2.isValid(group)).toBe(false);
      expect(section2.getReasonIsInvalid(group)).toBe(
        'Node "49" not valid for the given group.',
      );
    });

    it("returns false if any end nodes are listed twice", () => {
      const section = new LineGroupSection(group.id, 1, [6, 6]);
      expect(section.isValid(group)).toBe(false);
      expect(section.getReasonIsInvalid(group)).toBe(
        'End node "6" given twice.',
      );
    });

    it("behaves identically even if multiple branches in the group are for the same line", () => {
      const lines = [95, 95, 95];
      const sameLineGroup = new LineGroup(400, branches, lines, new Map());

      // Allows multi-branch sections
      const section1 = new LineGroupSection(sameLineGroup.id, 1, [4, 8, 10]);
      expect(section1.isValid(sameLineGroup)).toBe(true);
      expect(section1.getReasonIsInvalid(sameLineGroup)).toBeNull();

      // Allows sections where a branch is bypassed
      const section2 = new LineGroupSection(sameLineGroup.id, 1, [7, 10]);
      expect(section2.isValid(sameLineGroup)).toBe(true);
      expect(section2.getReasonIsInvalid(sameLineGroup)).toBeNull();

      // Returns false if end nodes are given for intermediate branches
      const section3 = new LineGroupSection(sameLineGroup.id, 1, [2, 6]);
      expect(section3.isValid(sameLineGroup)).toBe(false);
      expect(section3.getReasonIsInvalid(sameLineGroup)).toBe(
        'Node "6" cannot be an end node as upstream node "2" already is.',
      );

      // Returns false if multiple end nodes are given for the same branch
      const section4 = new LineGroupSection(sameLineGroup.id, 1, [10, 9]);
      expect(section4.isValid(sameLineGroup)).toBe(false);
      expect(section4.getReasonIsInvalid(sameLineGroup)).toBe(
        'Node "10" cannot be an end node as upstream node "9" already is.',
      );
    });
  });

  describe("#toLineGroupEdges", () => {
    it("works for single branch section", () => {
      const section = new LineGroupSection(group.id, 6, [8]);
      expectEdges(section.toLineGroupEdges(group), [
        [6, 7],
        [7, 8],
      ]);
    });

    it("works for complex cases", () => {
      const section = new LineGroupSection(group.id, 1, [3, 10]);
      expectEdges(section.toLineGroupEdges(group), [
        [1, 2],
        [2, 3],
        [2, 5],
        [5, 6],
        [6, 9],
        [9, 10],
      ]);
    });

    it("throws if the section is invalid", () => {
      const section = new LineGroupSection(group.id, 1, [1]);
      expect(section.isValid(group)).toBe(false);
      expect(() => section.toLineGroupEdges(group)).toThrow();
    });

    function expectEdges(
      edges: LineGroupEdge[],
      expectedPairs: [LineGroupNode, LineGroupNode][],
    ) {
      expectMatchingArrays(
        edges,
        expectedPairs.map((x) => new LineGroupEdge(x[0], x[1])),
        "Edges do not match",
        (a, b) => a.sameEdge(b),
        (x) => `${x.a} -> ${x.b}`,
      );
    }
  });

  describe(".fromExtremities", () => {
    it("works in the simple case", () => {
      const section1 = LineGroupSection.fromExtremities(group, [2, 4]);
      expect(section1.groupId).toBe(group.id);
      expect(section1.startNodeId).toBe(2);
      expect(section1.endNodeIds).toEqual([4]);

      const section2 = LineGroupSection.fromExtremities(group, [4, 2]);
      expect(section2.groupId).toBe(group.id);
      expect(section2.startNodeId).toBe(2);
      expect(section2.endNodeIds).toEqual([4]);
    });

    it("handles complex cases", () => {
      const section = LineGroupSection.fromExtremities(group, [9, 8, 2]);
      expect(section.startNodeId).toBe(2);
      expect(section.endNodeIds).toEqual([8, 9]);
    });

    it("still returns a valid line group section if redundant nodes are given", () => {
      const section = LineGroupSection.fromExtremities(group, [2, 6, 10]);
      expect(section.startNodeId).toBe(2);
      expect(section.endNodeIds).toEqual([10]);
    });

    it("throws if fewer than two nodes are given", () => {
      expect(() => {
        LineGroupSection.fromExtremities(group, [1]);
      }).toThrow();
    });

    it("throws if an invalid node for the group is given", () => {
      expect(() => {
        LineGroupSection.fromExtremities(group, [1, 49]);
      }).toThrow();
    });
  });
});
