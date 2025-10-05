import {
  ColoringStrategy,
  SegmentColoring,
} from "@/frontend/components/map/renderer/coloring-strategy/coloring-strategy";
import {
  condense,
  subtractAll,
} from "@/frontend/components/map/renderer/coloring-strategy/range-fns";
import { Segment } from "@/frontend/components/map/renderer/segment";
import { Terminus } from "@/frontend/components/map/renderer/terminus";
import { MapColor } from "@/frontend/components/map/renderer/utils";

export class DisruptionsColoringStrategy extends ColoringStrategy {
  getSegmentColoring(segment: Segment): SegmentColoring[] {
    const highlighting = condense(this._getHighlightingFor(segment));
    const remainder = subtractAll([{ min: 0, max: 1 }], highlighting);

    return [
      ...remainder.map(
        (h) => new SegmentColoring(segment, h.min, h.max, "ghost-line"),
      ),
      ...highlighting.map(
        (r) => new SegmentColoring(segment, r.min, r.max, segment.color),
      ),
    ];
  }

  getTerminusColor(terminus: Terminus): MapColor {
    const coverage = this._getNodeHighlightingCoverage(terminus.nodeId);
    return coverage !== "zero" ? terminus.color : "ghost-line";
  }
}
