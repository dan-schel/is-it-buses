import { includes } from "@/frontend/components/map/renderer/coloring-strategy/range-fns";
import { Geometry } from "@/frontend/components/map/renderer/geometry";
import { Segment } from "@/frontend/components/map/renderer/segment";
import { Terminus } from "@/frontend/components/map/renderer/terminus";
import { MapColor } from "@/frontend/components/map/renderer/utils";
import {
  SerializedHighlightedMapSegment,
  SerializedMapHighlighting,
} from "@/shared/types/map-data";

export class SegmentColoring {
  constructor(
    readonly segment: Segment,
    readonly min: number,
    readonly max: number,
    readonly color: MapColor,
  ) {}
}

export abstract class ColoringStrategy {
  constructor(
    private readonly _geometry: Geometry,
    private readonly _mapHighlighting: SerializedMapHighlighting,
  ) {}

  abstract getSegmentColoring(segment: Segment): SegmentColoring[];

  abstract getTerminusColor(terminus: Terminus): MapColor;

  protected _getNodeHighlightingCoverage(
    nodeId: number,
  ): "full" | "partial" | "zero" {
    const segments = this._geometry.getSegmentsInvolving(nodeId);
    const highlightedCount = segments.reduce((acc, segment) => {
      const highlighting = this._getHighlightingFor(segment);
      if (highlighting.some((h) => this._highlightsNode(h, nodeId))) {
        return acc + 1;
      }
      return acc;
    }, 0);

    if (highlightedCount === 0) {
      return "zero";
    } else if (highlightedCount === segments.length) {
      return "full";
    } else {
      return "partial";
    }
  }

  protected _getHighlightingFor(
    segment: Segment,
  ): SerializedHighlightedMapSegment[] {
    return (
      this._mapHighlighting.segments.filter(
        (h) =>
          h.nodeIdA === segment.startNodeId && h.nodeIdB === segment.endNodeId,
      ) ?? null
    );
  }

  protected _highlightsNode(
    highlighting: SerializedHighlightedMapSegment,
    nodeId: number,
  ): boolean {
    return (
      (highlighting.nodeIdA === nodeId && includes(highlighting, 0)) ||
      (highlighting.nodeIdB === nodeId && includes(highlighting, 1))
    );
  }
}
