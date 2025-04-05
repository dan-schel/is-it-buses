import { Segment } from "@/components/map/renderer/segment";
import { LineColor } from "@/components/map/renderer/utils";
import { FlexiPoint } from "@/scripts/generate-map-geometry/lib/dimensions/flexi-point";
import { SegmentBuilder } from "@/scripts/generate-map-geometry/lib/segment-builder";

export class LineBuilder {
  private _segments: Segment[];
  private _nodes: LocatedNode[];
  private _currentNodeId: number;
  private _currentPosition: FlexiPoint;
  private _currentAngle: number;

  constructor(
    private readonly _startNodeId: number,
    private readonly _startPoint: FlexiPoint,
    private readonly _startAngle: number,
    private readonly _color: LineColor,
  ) {
    this._segments = [];
    this._nodes = [
      new LocatedNode(
        this._startNodeId,
        this._startPoint,
        this._startAngle,
        this._color,
      ),
    ];
    this._currentNodeId = _startNodeId;
    this._currentPosition = _startPoint;
    this._currentAngle = _startAngle;
  }

  to(nodeId: number, build: (builder: SegmentBuilder) => void): LineBuilder {
    const builder = new SegmentBuilder(
      this._color,
      this._currentPosition,
      this._currentAngle,
    );
    build(builder);

    const { segment, endPoint, endAngle } = builder.build(
      this._currentNodeId,
      nodeId,
    );

    this._segments.push(segment);
    this._nodes.push(new LocatedNode(nodeId, endPoint, endAngle, this._color));
    this._currentPosition = endPoint;
    this._currentAngle = endAngle;
    this._currentNodeId = nodeId;
    return this;
  }

  split(build: (builder: LineBuilder) => void): LineBuilder {
    const builder = new LineBuilder(
      this._currentNodeId,
      this._currentPosition,
      this._currentAngle,
      this._color,
    );
    build(builder);
    const { segments, nodes } = builder.build();

    this._segments.push(...segments);

    // Drop the first node, because we'll have already added it and the end of
    // the prior .to() or .split(). We're only interested in the nodes that are
    // exclusive to the split section.
    this._nodes.push(...nodes.slice(1));

    return this;
  }

  build(): LineBuilderOutput {
    return new LineBuilderOutput(this._segments, this._nodes);
  }
}

export class LineBuilderOutput {
  constructor(
    readonly segments: readonly Segment[],
    readonly nodes: readonly LocatedNode[],
  ) {}
}

export class LocatedNode {
  constructor(
    readonly nodeId: number,
    readonly point: FlexiPoint,
    readonly angle: number,
    readonly color: LineColor,
  ) {}
}
