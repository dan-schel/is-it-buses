import { LineGroupEdge } from "@/server/data/line-group/line-group-edge";
import { MapSegment } from "@/server/data/map/map-segment";

export class MappingData {
  constructor(
    readonly groupId: number,
    readonly data: readonly {
      edge: LineGroupEdge;
      segments: readonly MapSegment[];
    }[],
  ) {}

  getMapSegmentsForEdge(edge: LineGroupEdge): readonly MapSegment[] {
    const entry = this.data.find((x) => x.edge.sameEdge(edge));
    if (entry == null) throw new Error(`No such edge.`);
    return entry.segments;
  }
}
