import { App } from "@/server/app";
import { MapHighlighter } from "@/server/data/disruption/map-highlighting/map-highlighter";
import { MapHighlighting } from "@/server/data/disruption/map-highlighting/map-highlighting";
import { LineGroup } from "@/server/data/line-group/line-group";
import { LineGroupSection } from "@/server/data/line-group/line-group-section";
import { MapSegment } from "@/server/data/map/map-segment";
import { MappingData } from "@/server/data/map/mapping-data";

export class SectionMapHighlighter extends MapHighlighter {
  constructor(private readonly _section: LineGroupSection) {
    super();
  }

  getHighlighting(app: App): MapHighlighting {
    const groupId = this._section.groupId;
    const group: LineGroup = app.groups.require(groupId);
    const mappingData: MappingData = app.map.getMappingDataForGroup(groupId);
    if (mappingData == null) return new MapHighlighting([], []);

    const segments = this._section
      .toLineGroupEdges(group)
      .flatMap((x) => mappingData.getMapSegmentsForEdge(x));

    return new MapHighlighting(
      MapSegment.condense(segments).map((x) => x.toHighlighted("standard")),
      [],
    );
  }
}
