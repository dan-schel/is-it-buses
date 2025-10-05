import { FlexiLength } from "@/components/map/renderer/dimensions/flexi-length";

export type StraightSegmentInstruction = ReturnType<typeof straight>;
export type CurveSegmentInstruction = ReturnType<typeof curve>;
type TurnBackSegmentInstruction = ReturnType<typeof turnBack>;

export type SegmentInstruction =
  | StraightSegmentInstruction
  | CurveSegmentInstruction
  | TurnBackSegmentInstruction;

export function straight(length: FlexiLength) {
  return { type: "straight", length } as const;
}

export function curve(radius: FlexiLength, angle: -90 | -45 | 45 | 90) {
  return { type: "curve", radius, angle } as const;
}

export function turnBack() {
  return { type: "turnBack" } as const;
}
