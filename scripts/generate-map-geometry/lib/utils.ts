import { lineWidth } from "@/frontend/components/map/renderer/utils";
import { flexi } from "@/frontend/components/map/renderer/dimensions/flexi-length";
import { SegmentInstruction } from "@/scripts/generate-map-geometry/lib/segment-instructions";
import { FlexiPoint } from "@/frontend/components/map/renderer/dimensions/flexi-point";
import { LineBuilder } from "@/scripts/generate-map-geometry/lib/line-builder";
import { SegmentBuilder } from "@/scripts/generate-map-geometry/lib/segment-builder";

export const interchangeEdgeOffset = flexi(lineWidth / 2);
export const interchangeInnerOffset = flexi(1);
export const terminusExtents = flexi(5);

export function invert(
  instructions: SegmentInstruction[],
): SegmentInstruction[] {
  const reversed = instructions
    .map((x) => {
      if (x.type !== "curve") return x;

      return {
        ...x,
        angle: -x.angle as -90 | -45 | 45 | 90,
      } as const;
    })
    .reverse();

  return reversed;
}

export function getNodePosition(line: LineBuilder, nodeId: number): FlexiPoint {
  const locatedNode = line.build().nodes.find((n) => n.nodeId === nodeId);
  if (!locatedNode) {
    throw new Error(`Node ${nodeId} not found`);
  }
  return locatedNode.point;
}

export function getEndPoint(
  startPoint: FlexiPoint,
  startAngle: number,
  instructions: SegmentInstruction[],
): FlexiPoint {
  return new SegmentBuilder(startPoint, startAngle)
    .process(instructions)
    .build().endPoint;
}
