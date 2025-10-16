import { PageContext } from "vike/types";
import { JsonSerializable } from "@/shared/json-serializable";
import { createCalendarData } from "@/server/data/disruption/period/utils/create-calendar-data";
import { CalendarData } from "@/shared/types/calendar-data";
import { App } from "@/server/app";
import { LineCollection } from "@/server/data/line/line-collection";
import { Line } from "@/server/data/line/line";
import { parseIntNull } from "@dan-schel/js-utils";
import { SerializedMapHighlighting } from "@/shared/types/map-data";
import { MapHighlighting } from "@/server/data/disruption/map-highlighting/map-highlighting";
import { SerializedGeometry } from "@/shared/types/map-geometry";

export type Data = {
  disruption: {
    title: string;
    bodyMarkdown: string;
    link: string;
    calendar: CalendarData | null;
    highlighting: SerializedMapHighlighting;
  } | null;
  back: {
    name: string;
    href: string;
  };
  mapGeometry: SerializedGeometry;
};

export async function data(
  pageContext: PageContext,
): Promise<Data & JsonSerializable> {
  const { urlParsed, routeParams } = pageContext;
  const app = pageContext.custom.app;

  const back = determineBackBehaviour(app, urlParsed);
  const id = routeParams.id;

  const disruption = await app.disruptions.get(id);
  if (disruption == null) {
    return {
      disruption: null,
      back,
      mapGeometry: app.mapGeometry.toJSON() as SerializedGeometry,
    };
  }

  const period = disruption.period.toBson();
  const itNeverEnds = "end" in period ? period.end.type === "never" : false;

  const writeup = disruption.data.getWriteupAuthor().write(app, disruption);
  return {
    disruption: {
      title: writeup.title,
      bodyMarkdown: writeup.bodyMarkdown,

      // TODO: Fetch from the source alerts, presumably?
      link: "https://www.ptv.vic.gov.au/live-travel-updates/",

      calendar: itNeverEnds
        ? null
        : createCalendarData([disruption.period], app.time.now()),
      highlighting: MapHighlighting.serializeGroup([
        disruption.data.getMapHighlighter().getHighlighting(app),
      ]),
    },
    back,
    mapGeometry: app.mapGeometry.toJSON() as SerializedGeometry,
  };
}

function determineBackBehaviour(
  app: App,
  urlParsed: { search: Record<string, string> },
) {
  const from = urlParsed.search.from ?? "";

  if (from.startsWith("line")) {
    const line = tryGetLine(app.lines, from.split("-")[1]);
    if (line != null) {
      return {
        name: `${line.name} Line`,
        href: `/line/${line.id}`,
      };
    }
  }

  return {
    name: "Overview",
    href: "/",
  };
}

// TODO: This is used in multiple places. Move to a utils file?
function tryGetLine(
  lines: LineCollection,
  idStr: string | null | undefined,
): Line | null {
  if (idStr == null) {
    return null;
  }

  const id = parseIntNull(idStr);
  if (id == null) {
    return null;
  }

  return lines.get(id);
}
