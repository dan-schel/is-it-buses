import { App } from "@/server/app";
import { MapHighlighter } from "@/server/data/disruption/map-highlighting/map-highlighter";
import {
  HighlightedSegment,
  MapHighlighting,
} from "@/server/data/disruption/map-highlighting/map-highlighting";
import { LineSection } from "@/server/data/line-section";

export class SectionMapHighlighter extends MapHighlighter {
  constructor(private readonly _sections: LineSection[]) {
    super();
  }

  getHighlighting(app: App): MapHighlighting {
    const segments = this._sections
      .flatMap((section) =>
        app.lines.require(section.line).getMapSegmentsInSection(section),
      )
      .map((x) => new HighlightedSegment(x, "standard"));

    return new MapHighlighting(segments, []);
  }
}
