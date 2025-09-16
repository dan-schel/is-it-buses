import { App } from "@/server/app";
import { MapHighlighter } from "@/server/data/disruption/map-highlighting/map-highlighter";
import {
  HighlightedPoint,
  MapHighlighting,
} from "@/server/data/disruption/map-highlighting/map-highlighting";

export class DelayMapHighlighter extends MapHighlighter {
  constructor(private readonly _stationId: number) {
    super();
  }

  getHighlighting(app: App): MapHighlighting {
    const location = app.stations.require(this._stationId).mapLocation;
    const points =
      location != null ? [new HighlightedPoint(location, "delayed")] : [];
    return new MapHighlighting([], points);
  }
}
