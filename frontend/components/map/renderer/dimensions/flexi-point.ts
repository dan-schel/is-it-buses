import { FlexiLength } from "@/frontend/components/map/renderer/dimensions/flexi-length";
import { Point } from "@/frontend/components/map/renderer/dimensions/point";
import { nonNull, parseFloatNull } from "@dan-schel/js-utils";

export class FlexiPoint {
  constructor(
    readonly min: Point,
    readonly max: Point,
  ) {}

  amplify(amplification: number) {
    return {
      x: this.min.x + (this.max.x - this.min.x) * amplification,
      y: this.min.y + (this.max.y - this.min.y) * amplification,
    };
  }

  horizontalDistanceTo(other: FlexiPoint): FlexiLength {
    return new FlexiLength(
      Math.abs(this.min.x - other.min.x),
      Math.abs(this.max.x - other.max.x),
    );
  }

  verticalDistanceTo(other: FlexiPoint): FlexiLength {
    return new FlexiLength(
      Math.abs(this.min.y - other.min.y),
      Math.abs(this.max.y - other.max.y),
    );
  }

  pythagoreanDistanceTo(point: FlexiPoint): FlexiLength {
    const dx = this.horizontalDistanceTo(point);
    const dy = this.verticalDistanceTo(point);
    return new FlexiLength(
      Math.sqrt(dx.min * dx.min + dy.min * dy.min),
      Math.sqrt(dx.max * dx.max + dy.max * dy.max),
    );
  }

  plus(input: { x?: FlexiLength; y?: FlexiLength }): FlexiPoint {
    const x = input.x ?? new FlexiLength(0, 0);
    const y = input.y ?? new FlexiLength(0, 0);
    return new FlexiPoint(
      new Point(this.min.x + x.min, this.min.y + y.min),
      new Point(this.max.x + x.max, this.max.y + y.max),
    );
  }

  minus(input: { x?: FlexiLength; y?: FlexiLength }): FlexiPoint {
    const x = input.x ?? new FlexiLength(0, 0);
    const y = input.y ?? new FlexiLength(0, 0);
    return new FlexiPoint(
      new Point(this.min.x - x.min, this.min.y - y.min),
      new Point(this.max.x - x.max, this.max.y - y.max),
    );
  }

  move(length: FlexiLength, angle: number): FlexiPoint {
    return new FlexiPoint(
      this.min.move(length.min, angle),
      this.max.move(length.max, angle),
    );
  }

  toString() {
    const minX = this.min.x.toFixed(2);
    const minY = this.min.y.toFixed(2);
    const maxX = this.max.x.toFixed(2);
    const maxY = this.max.y.toFixed(2);
    return `${minX} ${minY} ${maxX} ${maxY}`;
  }

  static midpoint(a: FlexiPoint, b: FlexiPoint): FlexiPoint {
    return new FlexiPoint(
      new Point((a.min.x + b.min.x) / 2, (a.min.y + b.min.y) / 2),
      new Point((a.max.x + b.max.x) / 2, (a.max.y + b.max.y) / 2),
    );
  }

  static fromString(s: string) {
    const parsed = s
      .split(" ")
      .map((n) => parseFloatNull(n))
      .filter(nonNull);

    if (parsed.length !== 4) {
      return null;
    }

    return new FlexiPoint(
      new Point(parsed[0], parsed[1]),
      new Point(parsed[2], parsed[3]),
    );
  }
}

export function fp(min: [number, number], max?: [number, number]): FlexiPoint {
  const second = max ?? min;
  return new FlexiPoint(
    new Point(min[0], min[1]),
    new Point(second[0], second[1]),
  );
}
