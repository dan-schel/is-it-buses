import { App } from "@/server/app";
import { MapHighlighting } from "@/server/data/disruption/map-highlighting/map-highlighting";
import { createCalendarData } from "@/server/data/disruption/period/utils/create-calendar-data";
import { formatLineShapeNode } from "@/server/data/disruption/writeup/utils";
import { AlertRepository } from "@/server/database-repository/alert-repository";
import { DisruptionRepository } from "@/server/database-repository/disruption-repository";
import { JsonSerializable } from "@/shared/json-serializable";
import { AlertPreview } from "@/shared/types/alert-data";
import { ProcessingContextData } from "@/shared/types/processing-context-data";
import { CalendarData } from "@/shared/types/calendar-data";
import { SerializedMapHighlighting } from "@/shared/types/map-data";
import { PageContext } from "vike/types";
import { DisruptionProcessingInput } from "@/shared/schemas/disruption-processing/disruption-processing-input";
import { Disruption } from "@/server/data/disruption/disruption";
import { DisruptionPeriod } from "@/server/data/disruption/period/disruption-period";
import { DisruptionPeriodInput } from "@/shared/schemas/common/disruption-period-input";
import { CustomDisruptionPeriod } from "@/server/data/disruption/period/custom-disruption-period";
import { DisruptionData } from "@/server/data/disruption/data/disruption-data";
import { CustomDisruptionData } from "@/server/data/disruption/data/custom-disruption-data";
import { DisruptionDataInput } from "@/shared/schemas/common/disruption-data-input";

export type Data = {
  disruption:
    | ({
        title: string;
        bodyMarkdown: string;
        calendar: CalendarData | null;
        input: DisruptionProcessingInput | null;
        alerts: AlertPreview;
      } & (
        | {
            highlighting: SerializedMapHighlighting;
          }
        | {
            raw: string;
          }
      ))
    | null;
  context: ProcessingContextData;
};

export async function data(
  pageContext: PageContext,
): Promise<Data & JsonSerializable> {
  const { routeParams } = pageContext;
  const app = pageContext.custom.app;

  const id = routeParams.id;
  const context = prepContext(app);

  const disruption = await DisruptionRepository.getRepository(
    app,
  ).getDisruption({ id, valid: "either" });
  if (disruption == null) {
    return { disruption: null, context };
  }

  const alerts: AlertPreview = (
    await AlertRepository.getRepository(app).listAlerts({
      ids: disruption.sourceAlertIds,
    })
  ).map((alert) => ({ title: alert.data.title, id: alert.id }));

  const writeup = disruption.data.getWriteupAuthor().write(app, disruption);
  const period = disruption.period.toBson();
  const itNeverEnds = "end" in period ? period.end.type === "never" : false;

  if (!disruption.data.validate(app)) {
    return {
      disruption: {
        title: writeup.title,
        bodyMarkdown: writeup.bodyMarkdown,
        calendar: itNeverEnds
          ? null
          : createCalendarData([disruption.period], app.time.now()),
        raw: disruption.data.inspect(),
        alerts,
        input: createProcessingInput(app, disruption),
      },
      context,
    };
  }

  return {
    disruption: {
      title: writeup.title,
      bodyMarkdown: writeup.bodyMarkdown,
      calendar: itNeverEnds
        ? null
        : createCalendarData([disruption.period], app.time.now()),
      highlighting: MapHighlighting.serializeGroup([
        disruption.data.getMapHighlighter().getHighlighting(app),
      ]),
      input: createProcessingInput(app, disruption),
      alerts,
    },
    context,
  };
}

function prepContext(app: App): ProcessingContextData {
  return {
    lines: app.lines.map((line) => ({
      id: line.id,
      name: line.name,
      lineShapeNodes: line.getNodes().map((node) => ({
        // The frontend shouldn't have to care about "the-city" | number, it
        // just deals with strings.
        id: typeof node === "string" ? node : node.toFixed(),
        name: formatLineShapeNode(app, node, { capitalize: true }),
      })),
    })),
    stations: app.stations.map((station) => ({
      id: station.id,
      name: station.name,
    })),
  };
}

function createProcessingInput(
  app: App,
  disruption: Disruption,
): DisruptionProcessingInput | null {
  if (disruption.data instanceof CustomDisruptionData) {
    console.warn("Unsupported disruption data type");
    return null;
  }
  if (disruption.period instanceof CustomDisruptionPeriod) {
    console.warn("Unsupported disruption period type");
    return null;
  }

  return {
    data: parseData(disruption.data),
    period: parsePeriod(disruption.period, app.time.now()),
  };
}

function parseData(
  data: Exclude<DisruptionData, CustomDisruptionData>,
): DisruptionDataInput {
  const bson = data.toBson();

  switch (bson.type) {
    case "station-closure":
    case "no-city-loop":
    case "delays":
      return bson;
    case "bus-replacements":
    case "no-trains-running":
      return {
        ...bson,
        sections: bson.sections.map((x) => ({
          line: x.line,
          a: x.a.toString(),
          b: x.b.toString(),
        })),
      };
  }
}

function parsePeriod(
  period: Exclude<DisruptionPeriod, CustomDisruptionPeriod>,
  now: Date,
): DisruptionPeriodInput {
  const bson = period.toBson();

  switch (bson.type) {
    case "standard":
      return {
        type: "standard",
        // TODO: null is a vaild value for start
        start: bson.start ?? now,
        end: parsePeriodEnd(period),
      };
    case "evenings-only":
      return {
        type: "evenings-only",
        // TODO: null is a vaild value for start
        start: bson.start ?? now,
        end: parsePeriodEnd(period),
        startHourEachDay: bson.startHourEachDay,
      };
  }
}

function parsePeriodEnd(
  period: Exclude<DisruptionPeriod, CustomDisruptionPeriod>,
): DisruptionPeriodInput["end"] {
  const bson = period.toBson().end;
  switch (bson.type) {
    case "never":
    case "when-alert-ends":
      return { type: `ends-${bson.type}` };
    case "after-last-service":
      return { type: "ends-after-last-service", ...bson.date };
    case "approximately":
      return { ...bson, type: "ends-approximately" };
    case "exactly":
      return { ...bson, type: "ends-exactly" };
  }
}
