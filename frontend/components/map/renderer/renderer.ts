import {
  ColoringStrategy,
  SegmentColoring,
} from "@/frontend/components/map/renderer/coloring-strategy/coloring-strategy";
import { FlexiPoint } from "@/frontend/components/map/renderer/dimensions/flexi-point";
import { Geometry } from "@/frontend/components/map/renderer/geometry";
import { Interchange } from "@/frontend/components/map/renderer/interchange";
import { Segment } from "@/frontend/components/map/renderer/segment";
import {
  getColors,
  iconRadius,
  iconStrokeWidth,
  interchangeBorderWidth,
  interchangeThickLineWidth,
  interchangeThinLineWidth,
  lineWidth,
  MapColor,
  MapCssColors,
  terminusLineWidth,
  viewportPadding,
} from "@/frontend/components/map/renderer/utils";
import {
  SerializedHighlightedMapPoint,
  SerializedMapHighlighting,
} from "@/shared/types/map-data";

// Canvas has `backingStorePixelRatio`, but Typescript doesn't know about it for
// some reason. (Probably the target "ES____" version we're using idk.)
declare global {
  interface CanvasRenderingContext2D {
    backingStorePixelRatio?: number;
  }
}

const minAmplificationWidth = 400;
const maxAmplificationWidth = 800;

export class Renderer {
  private readonly _ctx;
  private _css: MapCssColors;

  private _width = 0;
  private _height = 0;
  private _dpiRatio = 1;
  private _amplification = 1;

  private _resizeListener: () => void;

  constructor(
    private readonly _canvasContainer: HTMLDivElement,
    private readonly _canvas: HTMLCanvasElement,
    private readonly _geometry: Geometry,
    private readonly _highlighting: SerializedMapHighlighting | null,
    private readonly _coloringStrategy: ColoringStrategy,
  ) {
    const ctx = this._canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Canvas not supported.");
    }
    this._ctx = ctx;

    this._css = getColors();
    this._resizeListener = this._onResize.bind(this);
  }

  start() {
    this._fitCanvas();
    this._render();
    window.addEventListener("resize", this._resizeListener);
  }

  destroy() {
    window.removeEventListener("resize", this._resizeListener);
  }

  private _onResize() {
    this._fitCanvas();
    this._render();
  }

  private _fitCanvas() {
    const containerSize = this._canvasContainer.getBoundingClientRect();
    this._width = containerSize.width;
    this._height = containerSize.height;

    const dpr = window.devicePixelRatio ?? 1;
    const bsr = this._ctx.backingStorePixelRatio ?? 1;
    this._dpiRatio = (dpr / bsr) * 2;

    this._amplification = this._selectAmplification();

    this._canvas.style.width = `${this._width}px`;
    this._canvas.style.height = `${this._height}px`;
    this._canvas.width = this._width * this._dpiRatio;
    this._canvas.height = this._height * this._dpiRatio;
  }

  private _selectAmplification(): number {
    if (this._width > maxAmplificationWidth) {
      return 1;
    }
    if (this._width < minAmplificationWidth) {
      return 0;
    }
    return (
      (this._width - minAmplificationWidth) /
      (maxAmplificationWidth - minAmplificationWidth)
    );
  }

  private _render() {
    const ctx = this._ctx;
    ctx.save();

    const viewport = this._geometry.viewport.amplify(this._amplification);
    const scale = Math.min(
      this._width / (viewport.w + viewportPadding * 2),
      this._height / (viewport.h + viewportPadding * 2),
    );

    const pxWidth = this._width * this._dpiRatio;
    const pxHeight = this._height * this._dpiRatio;
    ctx.clearRect(0, 0, pxWidth, pxHeight);
    ctx.scale(this._dpiRatio, this._dpiRatio);
    ctx.translate(this._width / 2, this._height / 2);

    ctx.scale(scale, scale);
    ctx.translate(-viewport.x, -viewport.y);

    for (const segment of this._geometry.segments) {
      this._renderSegmentBackground(segment);
    }

    for (const segment of this._geometry.segments) {
      this._renderSegmentForeground(segment);
    }

    for (const terminus of this._geometry.termini) {
      const color = this._coloringStrategy.getTerminusColor(terminus);
      this._renderPath(terminus.points, terminusLineWidth, color);
    }

    for (const interchange of this._geometry.interchanges) {
      this._renderInterchange(interchange);
    }

    for (const highlightedPoint of this._highlighting?.points ?? []) {
      this._renderHighlightedPoint(highlightedPoint);
    }

    ctx.restore();
  }

  private _renderInterchange(interchange: Interchange) {
    // The grey "border".
    if (interchange.thinLine != null) {
      const line = interchange.thinLine;
      const width = interchangeThinLineWidth + 2 * interchangeBorderWidth;
      this._renderPath(line, width, "interchange-stroke", "round");
    }
    for (const line of interchange.thickLines) {
      const width = interchangeThickLineWidth + 2 * interchangeBorderWidth;
      this._renderPath(line, width, "interchange-stroke", "round");
    }

    // The white "fill".
    if (interchange.thinLine != null) {
      const line = interchange.thinLine;
      const width = interchangeThinLineWidth;
      this._renderPath(line, width, "interchange-fill", "round");
    }
    for (const line of interchange.thickLines) {
      const width = interchangeThickLineWidth;
      this._renderPath(line, width, "interchange-fill", "round");
    }
  }

  private _renderSegmentBackground(segment: Segment) {
    this._renderColoredSegments(
      this._coloringStrategy
        .getSegmentColoring(segment)
        .filter((x) => x.color === "ghost-line"),
    );
  }

  private _renderSegmentForeground(segment: Segment) {
    this._renderColoredSegments(
      this._coloringStrategy
        .getSegmentColoring(segment)
        .filter((x) => x.color !== "ghost-line"),
    );
  }

  private _renderColoredSegments(segments: SegmentColoring[]) {
    for (const segmentColoring of segments) {
      this._renderPath(
        segmentColoring.segment.pointsForRange(
          this._amplification,
          segmentColoring.min,
          segmentColoring.max,
        ),
        lineWidth,
        segmentColoring.color,
      );
    }
  }

  private _renderHighlightedPoint(
    highlightedPoint: SerializedHighlightedMapPoint,
  ) {
    const positionA = this._getPosition(
      highlightedPoint.segmentANodeA,
      highlightedPoint.segmentANodeB,
      highlightedPoint.percentage,
    );
    const positionB = this._getPosition(
      highlightedPoint.segmentBNodeA,
      highlightedPoint.segmentBNodeB,
      highlightedPoint.percentage,
    );

    if (positionA == null || positionB == null) {
      return;
    }

    const point = FlexiPoint.midpoint(positionA, positionB);
    this._renderIcon(point, highlightedPoint.style);
  }

  private _getPosition(
    nodeA: number,
    nodeB: number,
    percentage: number,
  ): FlexiPoint | null {
    if (nodeA !== nodeB) {
      const effectiveNodeA = Math.min(nodeA, nodeB);
      const effectiveNodeB = Math.max(nodeA, nodeB);
      const effectivePercentage = nodeA < nodeB ? percentage : 1 - percentage;

      const segment = this._geometry.segments.find(
        (x) =>
          x.startNodeId === effectiveNodeA && x.endNodeId === effectiveNodeB,
      );
      if (segment == null) return null;

      return segment.pointAt(this._amplification, effectivePercentage);
    } else {
      const segment = this._geometry.segments.find(
        (x) => x.startNodeId === nodeA || x.endNodeId === nodeA,
      );
      if (segment == null) return null;

      return segment.startNodeId === nodeA
        ? segment.pointAt(this._amplification, 0)
        : segment.pointAt(this._amplification, 1);
    }
  }

  private _renderPath(
    points: readonly FlexiPoint[],
    lineWidth: number,
    color: MapColor,
    lineCap: CanvasLineCap = "butt",
  ) {
    const ctx = this._ctx;

    ctx.lineCap = lineCap;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = this._css[color];
    ctx.beginPath();

    let firstPoint = true;

    for (const point of points) {
      const { x, y } = point.amplify(this._amplification);

      if (firstPoint) {
        ctx.moveTo(x, y);
        firstPoint = false;
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();
  }

  private _renderIcon(
    point: FlexiPoint,
    iconType: SerializedHighlightedMapPoint["style"],
  ) {
    const ctx = this._ctx;

    const { x, y } = point.amplify(this._amplification);
    ctx.fillStyle = this._css["foreground-strong"];
    ctx.strokeStyle = this._css["on-foreground"];
    ctx.lineWidth = iconStrokeWidth;
    ctx.beginPath();
    ctx.ellipse(x, y, iconRadius, iconRadius, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    if (iconType === "standard") {
      ctx.lineCap = "round";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x - 2.5, y - 2.5);
      ctx.lineTo(x + 2.5, y + 2.5);
      ctx.moveTo(x + 2.5, y - 2.5);
      ctx.lineTo(x - 2.5, y + 2.5);
      ctx.stroke();
    } else if (iconType === "delayed") {
      ctx.lineWidth = iconStrokeWidth * 2;
      ctx.fillStyle = this._css["interchange-stroke"];
      ctx.beginPath();
      ctx.arc(x, y + 3, 3, 0, Math.PI);
      ctx.arc(x, y - 3, 3, Math.PI, 0);
      ctx.lineTo(x + 3, y + 3);
      ctx.stroke();
      ctx.fill();

      ctx.fillStyle = this._css["red"];
      ctx.beginPath();
      ctx.ellipse(x, y - 2.5, 2, 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = this._css["yellow"];
      ctx.beginPath();
      ctx.ellipse(x, y + 2.5, 2, 2, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
