import { LineGroupBuilder } from "@/server/data/line-group/line-group-builder";
import { describe, expect, it } from "vitest";

describe("LineGroupBuilder", () => {
  it("works", () => {
    const group = new LineGroupBuilder()
      .add(1)
      .add(2)
      .split()
      .add(3)
      .terminate(97)
      .add(4)
      .split()
      .add(5)
      .add(6)
      .terminate(98)
      .add(7)
      .terminate(99)
      .build([]);
    expect(group.branches).toEqual([
      { lineId: 99, nodes: [1, 2, 4, 7] },
      { lineId: 98, nodes: [1, 2, 4, 5, 6] },
      { lineId: 97, nodes: [1, 2, 3] },
    ]);
  });

  it("throws if you terminate() too many times", () => {
    expect(() => {
      new LineGroupBuilder().add(1).terminate(97).terminate(98);
    }).toThrow();
  });

  it("throws if you attempt to add() to a terminated branch", () => {
    expect(() => {
      new LineGroupBuilder().add(1).terminate(97).add(2);
    }).toThrow();
  });

  it("throws if you attempt to split() once every branch is terminated", () => {
    expect(() => {
      new LineGroupBuilder().add(1).terminate(97).split();
    }).toThrow();
  });

  it("throws if you attempt to build() before every branch is terminated", () => {
    expect(() => {
      new LineGroupBuilder().add(1).build([]);
    }).toThrow();
  });
});
