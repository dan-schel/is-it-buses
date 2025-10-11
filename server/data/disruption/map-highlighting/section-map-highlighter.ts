import { App } from "@/server/app";
import { MapHighlighter } from "@/server/data/disruption/map-highlighting/map-highlighter";
import {
  HighlightedSegment,
  MapHighlighting,
} from "@/server/data/disruption/map-highlighting/map-highlighting";
import { LineGroupSection } from "@/server/data/line-group/line-group-section";
import { MapSegment } from "@/server/data/map/map-segment";

export class SectionMapHighlighter extends MapHighlighter {
  constructor(private readonly _section: LineGroupSection) {
    super();
  }

  getHighlighting(app: App): MapHighlighting {
    const groupId = this._section.groupId;
    const group = app.lineGroups.require(groupId);
    const mappingData = app.mappingData.getForGroup(groupId);
    if (mappingData == null) return new MapHighlighting([], []);

    const segments = this._section
      .toLineGroupEdges(group)
      .flatMap((x) => mappingData.getMapSegmentsForEdge(x));

    const condensed = MapSegment.condense(segments);

    return new MapHighlighting(
      condensed.map((x) => new HighlightedSegment(x, "standard")),
      [],
    );
  }
}
