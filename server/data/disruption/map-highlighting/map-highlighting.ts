import { MapPoint } from "@/server/data/map/map-point";
import { MapSegment } from "@/server/data/map/map-segment";
import {
  SerializedHighlightedMapPoint,
  SerializedHighlightedMapSegment,
  SerializedMapHighlighting,
} from "@/shared/types/map-data";
import { z } from "zod";

const highlightedSegmentStyles = ["standard"] as const;
export type HighlightedSegmentStyle = (typeof highlightedSegmentStyles)[number];
const highlightedSegmentStylesJson = z.enum(highlightedSegmentStyles);

export class HighlightedSegment {
  constructor(
    readonly segment: MapSegment,
    readonly style: HighlightedSegmentStyle,
  ) {}

  static readonly bson = z
    .object({
      segment: MapSegment.bson,
      style: highlightedSegmentStylesJson,
    })
    .transform((x) => new HighlightedSegment(x.segment, x.style));

  toBson(): z.input<typeof HighlightedSegment.bson> {
    return {
      segment: this.segment.toBson(),
      style: this.style,
    };
  }

  toSerialized(): SerializedHighlightedMapSegment {
    const segment = this.segment.normalize();
    return {
      nodeIdA: segment.mapNodeA,
      nodeIdB: segment.mapNodeB,
      min: segment.percentage.min,
      max: segment.percentage.max,
      style: this.style,
    };
  }
}

export class HighlightedPoint {
  constructor(
    readonly point: MapPoint,
    readonly style: "standard" | "delayed",
  ) {}

  static readonly bson = z
    .object({
      point: MapPoint.bson,
      style: z.enum(["standard", "delayed"]),
    })
    .transform((x) => new HighlightedPoint(x.point, x.style));

  toBson(): z.input<typeof HighlightedPoint.bson> {
    return {
      point: this.point.toBson(),
      style: this.style,
    };
  }

  toSerialized(): SerializedHighlightedMapPoint {
    return {
      segmentANodeA: this.point.segmentANodeA,
      segmentANodeB: this.point.segmentANodeB,
      segmentBNodeA: this.point.segmentBNodeA,
      segmentBNodeB: this.point.segmentBNodeB,
      percentage: this.point.percentage,
      style: this.style,
    };
  }
}

export class MapHighlighting {
  static readonly none = new MapHighlighting([], []);

  constructor(
    readonly segments: readonly HighlightedSegment[],
    readonly points: readonly HighlightedPoint[],
  ) {}

  static readonly bson = z
    .object({
      segments: z.array(HighlightedSegment.bson),
      points: z.array(HighlightedPoint.bson),
    })
    .transform((x) => new MapHighlighting(x.segments, x.points));

  toBson(): z.input<typeof MapHighlighting.bson> {
    return {
      segments: this.segments.map((s) => s.toBson()),
      points: this.points.map((p) => p.toBson()),
    };
  }

  static serializeGroup(
    highlighting: MapHighlighting[],
  ): SerializedMapHighlighting {
    return {
      segments: highlighting.flatMap((h) =>
        h.segments.map((x) => x.toSerialized()),
      ),
      points: highlighting.flatMap((h) =>
        h.points.map((x) => x.toSerialized()),
      ),
    };
  }
}
