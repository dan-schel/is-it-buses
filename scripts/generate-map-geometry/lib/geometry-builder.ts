import { Geometry } from "@/frontend/components/map/renderer/geometry";
import { InterchangeBuilder } from "@/scripts/generate-map-geometry/lib/interchange-builder";
import { Segment } from "@/frontend/components/map/renderer/segment";
import { Terminus } from "@/frontend/components/map/renderer/terminus";
import {
  FlexiViewport,
  Viewport,
} from "@/frontend/components/map/renderer/dimensions/flexi-viewport";
import { terminusExtents } from "@/scripts/generate-map-geometry/lib/utils";
import { InterchangeBlueprint } from "@/scripts/generate-map-geometry/lib/interchange-blueprint";
import {
  LineBuilder,
  LocatedNode,
} from "@/scripts/generate-map-geometry/lib/line-builder";
import { Point } from "@/frontend/components/map/renderer/dimensions/point";

export class GeometryBuilder {
  constructor() {}

  build(
    lines: LineBuilder[],
    interchanges: InterchangeBlueprint[],
    terminiNodeIds: number[],
  ): Geometry {
    const paths = lines.map((l) => l.build());
    const segments = paths.flatMap((l) => l.segments);
    const nodes = paths.flatMap((l) => l.nodes);

    return new Geometry(
      segments,
      this._buildInterchanges(interchanges, nodes),
      this._buildTermini(terminiNodeIds, nodes),
      this._buildFlexiViewport(segments),
    );
  }

  private _buildInterchanges(
    blueprints: InterchangeBlueprint[],
    nodes: LocatedNode[],
  ) {
    return blueprints.map((i) => new InterchangeBuilder(i, nodes).build());
  }

  private _buildTermini(terminiiNodeIds: number[], nodes: LocatedNode[]) {
    return terminiiNodeIds.map((t) => {
      const node = nodes.find((n) => n.nodeId === t);

      if (node == null) throw new Error(`Terminus node "${t}" not found.`);

      return new Terminus(node.nodeId, node.color, [
        node.point.move(terminusExtents, node.angle - 90),
        node.point.move(terminusExtents, node.angle + 90),
      ]);
    });
  }

  private _buildFlexiViewport(paths: Segment[]): FlexiViewport {
    const points = paths.flatMap((p) => p.points);
    return new FlexiViewport(
      this._buildViewport(points.map((p) => p.min)),
      this._buildViewport(points.map((p) => p.max)),
    );
  }

  private _buildViewport(points: Point[]) {
    const lowestMinX = Math.min(...points.map((p) => p.x));
    const highestMinX = Math.max(...points.map((p) => p.x));
    const lowestMinY = Math.min(...points.map((p) => p.y));
    const highestMinY = Math.max(...points.map((p) => p.y));
    return new Viewport(
      (lowestMinX + highestMinX) / 2,
      (lowestMinY + highestMinY) / 2,
      highestMinX - lowestMinX,
      highestMinY - lowestMinY,
    );
  }
}
