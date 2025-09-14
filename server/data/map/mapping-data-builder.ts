import { LineGroup } from "@/server/data/line-group/line-group";
import { LineGroupEdge } from "@/server/data/line-group/line-group-edge";
import { LineGroupNode } from "@/server/data/line-group/line-group-node";
import { MapSegment } from "@/server/data/map-segment";
import { MappingData } from "@/server/data/map/mapping-data";
import { Range } from "@/server/data/utils/range";
import { map } from "@dan-schel/js-utils";

type IdConstants = { [key: string]: number };

export class MappingDataBuilder<S extends IdConstants, M extends IdConstants> {
  private readonly _data: { edge: LineGroupEdge; segments: MapSegment[] }[] =
    [];

  constructor(
    readonly lineGroup: LineGroup,
    private readonly _stationIds: S,
    private readonly _mapNodeIds: M,
  ) {}

  auto(a: keyof M & keyof S, b: keyof M & keyof S) {
    const segment = MapSegment.full(this._mapNodeIds[a], this._mapNodeIds[b]);
    const edges = this.lineGroup.getEdgesBetween(
      this._stationIds[a],
      this._stationIds[b],
    );
    return this._spreadSegmentAmongEdges(edges, segment);
  }

  // add(a: LineGroupNode, b: LineGroupNode, mapNodeIds: number[]) {
  //   if (mapNodeIds.length < 2 || a === b) throw new Error("Invalid arguments.");

  //   const edges = this.lineGroup.getEdgesBetween(a, b);

  //   if (edges.length === 1) {
  //     const segments = MapSegment.chain(mapNodeIds);
  //     return this._assignSegmentsToEdge(edges[0], segments);
  //   } else if (mapNodeIds.length === 2) {
  //     const segment = MapSegment.full(mapNodeIds[0], mapNodeIds[1]);
  //     return this._spreadSegmentAmongEdges(edges, segment);
  //   } else {
  //     throw new Error("Bad number of edges or map nodes.");
  //   }
  // }

  manual(a: LineGroupNode, b: LineGroupNode, ...segments: MapSegment[]) {
    const edges = this.lineGroup.getEdgesBetween(a, b);
    if (edges.length !== 1) throw new Error("Expecting exactly 1 edge.");

    return this._assignSegmentsToEdge(edges[0], segments);
  }

  spread(a: LineGroupNode, b: LineGroupNode, segment: MapSegment) {
    const edges = this.lineGroup.getEdgesBetween(a, b);
    if (edges.length < 2) throw new Error("Expecting multiple edges.");

    return this._spreadSegmentAmongEdges(edges, segment);
  }

  chain(a: LineGroupNode, b: LineGroupNode, mapNodeIds: number[]) {
    if (mapNodeIds.length < 3 || a === b) throw new Error("Invalid arguments.");

    const edges = this.lineGroup.getEdgesBetween(a, b);
    if (edges.length !== 1) throw new Error("Expecting exactly 1 edge.");

    const segments = MapSegment.chain(mapNodeIds);
    return this._assignSegmentsToEdge(edges[0], segments);
  }

  build() {
    return new MappingData(this.lineGroup, this._data);
  }

  private _assignSegmentsToEdge(edge: LineGroupEdge, segments: MapSegment[]) {
    this._pushData(edge, segments);
    return this;
  }

  private _spreadSegmentAmongEdges(
    edges: LineGroupEdge[],
    segment: MapSegment,
  ) {
    const { min: segMin, max: segMax } = segment.percentage;

    for (let i = 0; i < edges.length; i++) {
      const edge = edges[i];

      const min = map(i, 0, edges.length, segMin, segMax);
      const max = map(i + 1, 0, edges.length, segMin, segMax);
      const dividedSegment = segment.withRange(new Range(min, max));

      this._pushData(edge, [dividedSegment]);
    }

    return this;
  }

  private _pushData(edge: LineGroupEdge, segments: MapSegment[]) {
    const existing = this._data.find((d) => d.edge.sameEdge(edge));

    if (existing) {
      const isReversed = existing.edge.a === edge.b;
      segments.forEach((s) =>
        existing.segments.push(isReversed ? s.reverse() : s),
      );
    } else {
      this._data.push({ edge, segments });
    }
  }
}
