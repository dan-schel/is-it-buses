import { App } from "@/server/app";
import { MapHighlighter } from "@/server/data/disruption/map-highlighting/map-highlighter";
import {
  HighlightedSegment,
  MapHighlighting,
} from "@/server/data/disruption/map-highlighting/map-highlighting";
import { LineSection } from "@/server/data/line-section";
import { nonNull } from "@dan-schel/js-utils";
import * as line from "@/shared/line-ids";
import { JOLIMONT, NORTH_MELBOURNE, RICHMOND } from "@/shared/station-ids";
import * as mapNode from "@/shared/map-node-ids";

// Maps each line with the last station traversed before entering the city loop
// TODO: Remove Cranbourne, Pakenham, and Sunbury when Metro Tunnel is operating
const LineJunctionMapping: Readonly<Record<number, number>> = {
  [line.ALAMEIN]: RICHMOND,
  [line.BELGRAVE]: RICHMOND,
  [line.GLEN_WAVERLEY]: RICHMOND,
  [line.LILYDALE]: RICHMOND,
  [line.HURSTBRIDGE]: JOLIMONT,
  [line.MERNDA]: JOLIMONT,
  [line.CRANBOURNE]: RICHMOND,
  [line.PAKENHAM]: RICHMOND,
  [line.CRAIGIEBURN]: NORTH_MELBOURNE,
  [line.SUNBURY]: NORTH_MELBOURNE,
  [line.UPFIELD]: NORTH_MELBOURNE,
};

// Map nodes to remove from map segements
const DirectToFlindersStreet = [
  mapNode.BURNLEY.FLINDERS_STREET_DIRECT,
  mapNode.CLIFTON_HILL.FLINDERS_STREET_DIRECT,
  mapNode.DANDENONG.FLINDERS_STREET_DIRECT,
  mapNode.NORTHERN.FLINDERS_STREET_DIRECT,
  // Northern loop needs to pass through Southern Cross
  //  before reaching Flinders Street
  mapNode.NORTHERN.SOUTHERN_CROSS,
];

export class NoCityLoopMapHighlighter extends MapHighlighter {
  constructor(private _lineIds: number[]) {
    super();
  }

  getHighlighting(app: App): MapHighlighting {
    const lines = this._lineIds
      .map((x) => {
        const line = app.lines.get(x);
        const junctionStation = LineJunctionMapping[x];
        if (!line || !junctionStation) return null;

        return {
          line,
          section: new LineSection(x, "the-city", junctionStation),
        };
      })
      .filter(nonNull);
    const segments = lines
      .flatMap(({ line, section }) =>
        line
          .getMapSegmentsInSection(section)
          .filter(({ mapNodeA }) =>
            DirectToFlindersStreet.every((node) => mapNodeA !== node),
          ),
      )
      .map((x) => new HighlightedSegment(x, "standard"));

    return new MapHighlighting(segments, []);
  }
}
