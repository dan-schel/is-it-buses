import { z } from "zod";
import {
  LineColor,
  lineColors,
} from "@/frontend/components/map/renderer/utils";
import { FlexiLength } from "@/frontend/components/map/renderer/dimensions/flexi-length";
import {
  createFlexiLengthString,
  createFlexiPointString,
  flexiLengthStringJson,
  flexiPointStringJson,
} from "@/frontend/components/map/renderer/dimensions/json";
import { FlexiPoint } from "@/frontend/components/map/renderer/dimensions/flexi-point";
import { Point } from "@/frontend/components/map/renderer/dimensions/point";
import { fpff } from "@/frontend/components/map/renderer/coloring-strategy/range-fns";
import { mapClamp } from "@dan-schel/js-utils";

export class Segment {
  constructor(
    readonly startNodeId: number,
    readonly endNodeId: number,
    readonly color: LineColor,
    readonly points: readonly FlexiPoint[],
    readonly distances: readonly FlexiLength[],
  ) {
    if (startNodeId === endNodeId) {
      throw new Error(
        "Segment created with identical startNodeId and endNodeId.",
      );
    }
    if (distances.length !== points.length) {
      throw new Error("Distances and points must have the same length.");
    }
  }

  reverse(): Segment {
    const maxDistance = this.distances[this.distances.length - 1];
    const reversedDistances = this.distances
      .map((x) => maxDistance.minus(x))
      .reverse();

    return new Segment(
      this.endNodeId,
      this.startNodeId,
      this.color,
      [...this.points].reverse(),
      reversedDistances,
    );
  }

  normalize(): Segment {
    if (this.startNodeId < this.endNodeId) {
      return this;
    } else {
      return this.reverse();
    }
  }

  pointsForRange(
    amplification: number,
    start: number,
    end: number,
  ): readonly FlexiPoint[] {
    const distances = this.distances.map((x) => x.amplify(amplification));
    const totalDistance = distances[distances.length - 1];
    const startDistance = bias(start * totalDistance, totalDistance);
    const endDistance = bias(end * totalDistance, totalDistance);
    const points = this.points.filter(
      (_, i) =>
        distances[i] > startDistance - fpff &&
        distances[i] < endDistance + fpff,
    );

    return [
      this.pointAt(amplification, start),
      ...points,
      this.pointAt(amplification, end),
    ];
  }

  pointAt(amplification: number, percentage: number): FlexiPoint {
    // TODO: [DS] This function sucks. Maybe implementing it with loops would be
    // nicer. I.e. set the start and end points and iterate through to first
    // advance the start point as much as possible, and then repeat for the end
    // point.
    //
    // Copilot keeps trying to mention binary search. Would it work?

    const distances = this.distances.map((x) => x.amplify(amplification));
    const totalDistance = distances[distances.length - 1];
    const distance = bias(percentage * totalDistance, totalDistance);
    const before = distances.findLastIndex((x) => x <= distance);
    const after = distances.findIndex((x) => x >= distance);

    if (before !== -1 && after !== -1) {
      if (before === after) {
        return this.points[before];
      }

      const beforeDistance = distances[before];
      const afterDistance = distances[after];
      const localPercentage =
        (distance - beforeDistance) / (afterDistance - beforeDistance);
      const beforePoint = this.points[before];
      const afterPoint = this.points[after];
      return new FlexiPoint(
        new Point(
          beforePoint.min.x +
            localPercentage * (afterPoint.min.x - beforePoint.min.x),
          beforePoint.min.y +
            localPercentage * (afterPoint.min.y - beforePoint.min.y),
        ),
        new Point(
          beforePoint.max.x +
            localPercentage * (afterPoint.max.x - beforePoint.max.x),
          beforePoint.max.y +
            localPercentage * (afterPoint.max.y - beforePoint.max.y),
        ),
      );
    } else if (before !== -1) {
      return this.points[before];
    } else if (after !== -1) {
      return this.points[after];
    } else {
      throw new Error("Issue trying to find point at certain percentage.");
    }
  }

  static readonly json = z
    .object({
      startNodeId: z.number(),
      endNodeId: z.number(),
      color: z.enum(lineColors),
      points: flexiPointStringJson,
      distances: flexiLengthStringJson,
    })
    .transform(
      (x) =>
        new Segment(x.startNodeId, x.endNodeId, x.color, x.points, x.distances),
    );

  toJSON(): z.input<typeof Segment.json> {
    return {
      startNodeId: this.startNodeId,
      endNodeId: this.endNodeId,
      color: this.color,
      points: createFlexiPointString(this.points),
      distances: createFlexiLengthString(this.distances),
    };
  }
}

function bias(distance: number, total: number) {
  if (distance < fpff) {
    return 0;
  } else if (distance > total - fpff) {
    return total;
  } else {
    // Reserve 20% of the distance on each side for highlighting which goes
    // right up to that end. If we always did it fully proportional, then it
    // would make highlighting that's one station away from the node difficult
    // to distinguish from highlighting that goes all the way to the node.
    return mapClamp(distance, 0, total, total * 0.2, total * 0.8);
  }
}
