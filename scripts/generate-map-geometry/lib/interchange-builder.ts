import { Interchange } from "@/frontend/components/map/renderer/interchange";
import {
  InterchangeBlueprint,
  NodeWithRelativePosition,
} from "@/scripts/generate-map-geometry/lib/interchange-blueprint";
import {
  interchangeEdgeOffset,
  interchangeInnerOffset,
} from "@/scripts/generate-map-geometry/lib/utils";
import { LocatedNode } from "@/scripts/generate-map-geometry/lib/line-builder";
import { FlexiPoint } from "@/frontend/components/map/renderer/dimensions/flexi-point";

export class InterchangeBuilder {
  constructor(
    private readonly _interchange: InterchangeBlueprint,
    private readonly _allNodeLocations: readonly LocatedNode[],
  ) {
    const notFound = _interchange.nodeIds.find((x) =>
      _allNodeLocations.every((l) => l.nodeId !== x),
    );

    if (notFound != null) {
      throw new Error(
        `Node "${notFound}" not found for interchange "${_interchange.station}".`,
      );
    }
  }

  build(): Interchange {
    const thickLines = this._interchange.thickLines.map((segment) =>
      segment.map((pos) => this._point(pos)),
    );

    const thinLine =
      this._interchange.thinLine?.map((pos) => this._point(pos)) ?? null;

    return new Interchange(this._interchange.nodeIds, thickLines, thinLine);
  }

  _point(nodePosition: NodeWithRelativePosition): FlexiPoint {
    const point = this._locateNode(nodePosition.nodeId);

    const offset = {
      "left-edge": { length: interchangeEdgeOffset, angle: -90 },
      "left-inner": { length: interchangeInnerOffset, angle: -90 },
      "right-inner": { length: interchangeInnerOffset, angle: 90 },
      "right-edge": { length: interchangeEdgeOffset, angle: 90 },
    }[nodePosition.position];

    return point.point.move(offset.length, point.angle + offset.angle);
  }

  _locateNode(nodeId: number): LocatedNode {
    const node = this._allNodeLocations.find((x) => x.nodeId === nodeId);

    if (node == null) {
      throw new Error(`Node "${nodeId}" not found.`);
    }

    return node;
  }
}
