import { Range } from "@/server/data/range";
import { groupBy } from "@dan-schel/js-utils";
import { z } from "zod";

export class MapSegment {
  constructor(
    readonly mapNodeA: number,
    readonly mapNodeB: number,
    readonly percentage: Range,
  ) {
    if (mapNodeA === mapNodeB) {
      throw new Error("Map nodes cannot be the same.");
    }

    if (percentage.min < 0) {
      throw new Error("Min percentage cannot be less than 0.");
    }
    if (percentage.max > 1) {
      throw new Error("Max percentage cannot be greater than 1.");
    }
  }

  static readonly bson = z
    .object({
      mapNodeA: z.number(),
      mapNodeB: z.number(),
      percentage: Range.bson,
    })
    .transform((x) => new MapSegment(x.mapNodeA, x.mapNodeB, x.percentage));

  toBson(): z.input<typeof MapSegment.bson> {
    return {
      mapNodeA: this.mapNodeA,
      mapNodeB: this.mapNodeB,
      percentage: this.percentage.toBson(),
    };
  }

  reverse(): MapSegment {
    return new MapSegment(
      this.mapNodeB,
      this.mapNodeA,
      new Range(1 - this.percentage.max, 1 - this.percentage.min),
    );
  }

  normalize(): MapSegment {
    if (this.mapNodeA < this.mapNodeB) {
      return this;
    } else {
      return this.reverse();
    }
  }

  equals(other: MapSegment): boolean {
    const thisNormalized = this.normalize();
    const otherNormalized = other.normalize();

    return (
      thisNormalized.mapNodeA === otherNormalized.mapNodeA &&
      thisNormalized.mapNodeB === otherNormalized.mapNodeB &&
      thisNormalized.percentage.equals(otherNormalized.percentage)
    );
  }

  withRange(range: Range): MapSegment {
    return new MapSegment(this.mapNodeA, this.mapNodeB, range);
  }

  part(part: number, total: number): MapSegment {
    return new MapSegment(
      this.mapNodeA,
      this.mapNodeB,
      new Range((part - 1) / total, part / total),
    );
  }

  split(at: number): [MapSegment, MapSegment] {
    const [firstRange, secondRange] = this.percentage.split(at);
    return [
      new MapSegment(this.mapNodeA, this.mapNodeB, firstRange),
      new MapSegment(this.mapNodeA, this.mapNodeB, secondRange),
    ];
  }

  static chain(nodes: number[]) {
    if (nodes.length < 2) {
      throw new Error("At least two nodes are required to form segments.");
    }

    const edges: MapSegment[] = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      edges.push(MapSegment.full(nodes[i], nodes[i + 1]).normalize());
    }
    return edges;
  }

  static condense(segments: MapSegment[]): MapSegment[] {
    function key(s: MapSegment): string {
      return `${s.mapNodeA}-${s.mapNodeB}`;
    }

    const normalizedSegments = segments.map((s) => s.normalize());
    return groupBy(normalizedSegments, key).flatMap((group) => {
      const ranges = group.items.map((i) => i.percentage);
      const condensedRanges = Range.condense(ranges);
      return condensedRanges.map((r) => group.items[0].withRange(r));
    });
  }

  static full(mapNodeA: number, mapNodeB: number): MapSegment {
    return new MapSegment(mapNodeA, mapNodeB, new Range(0, 1));
  }
}
