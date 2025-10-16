import {
  flexi,
  FlexiLength,
} from "@/frontend/components/map/renderer/dimensions/flexi-length";
import { FlexiPoint } from "@/frontend/components/map/renderer/dimensions/flexi-point";
import {
  CurveSegmentInstruction,
  SegmentInstruction,
  StraightSegmentInstruction,
} from "@/server/services/map-geometry/segment-instructions";

export class SegmentBuilder {
  private _currentPoint: FlexiPoint;
  private _currentAngle: number;
  private _points: FlexiPoint[];
  private _distances: FlexiLength[];

  constructor(startPoint: FlexiPoint, startAngle: number) {
    this._currentPoint = startPoint;
    this._currentAngle = startAngle;
    this._points = [startPoint];
    this._distances = [flexi(0)];
  }

  process(instructions: SegmentInstruction[]): SegmentBuilder {
    for (const instruction of instructions) {
      this._processInstruction(instruction);
    }

    return this;
  }

  build() {
    return {
      points: this._points,
      distances: this._distances,
      endPoint: this._currentPoint,
      endAngle: this._currentAngle,
    };
  }

  private _processInstruction(instruction: SegmentInstruction) {
    switch (instruction.type) {
      case "straight":
        return this._processStraight(instruction);
      case "curve":
        return this._processCurve(instruction);
      case "turnBack":
        return this._processTurnBack();
      default:
        throw new Error(`Unknown instruction: ${JSON.stringify(instruction)}`);
    }
  }

  private _processStraight(instruction: StraightSegmentInstruction) {
    const { length } = instruction;
    const nextPoint = this._currentPoint.move(length, this._currentAngle);
    this._addPoint(nextPoint);
  }

  private _processCurve(instruction: CurveSegmentInstruction) {
    const { radius, angle: totalAngle } = instruction;

    const centerAngle = this._currentAngle + (totalAngle < 0 ? -90 : 90);
    const center = this._currentPoint.move(radius, centerAngle);

    const numOfPoints = (Math.abs(totalAngle) / 45) * 5;
    for (let i = 1; i <= numOfPoints; i++) {
      const angle = centerAngle + 180 + (totalAngle / numOfPoints) * i;
      const point = center.move(radius, angle);
      this._addPoint(point);
    }

    this._currentAngle += totalAngle;
  }

  private _processTurnBack() {
    this._currentAngle += 180;
  }

  private _addPoint(point: FlexiPoint) {
    const prevPoint = this._points[this._points.length - 1];
    const prevDistance = this._distances[this._distances.length - 1];
    const distance = prevPoint.pythagoreanDistanceTo(point);

    this._points.push(point);
    this._distances.push(prevDistance.plus(distance));
    this._currentPoint = point;
  }
}
