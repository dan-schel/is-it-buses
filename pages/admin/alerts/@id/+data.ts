import { PageContext } from "vike/types";
import { JsonSerializable } from "@/shared/json-serializable";
import { App } from "@/server/app";
import { nonNull, unique } from "@dan-schel/js-utils";
import { DetailsError } from "@/server/alert-source/alert-source";
import sanitizeHtml from "sanitize-html";
import { formatDate } from "@/server/data/disruption/period/utils/utils";
import { ProcessingContextData } from "@/shared/types/processing-context-data";
import { formatLineShapeNode } from "@/server/data/disruption/writeup/utils";
import { AlertRepository } from "@/server/database-repository/alert-repository";
import { AlertData } from "@/server/data/alert/alert-data";

type UrlPreview = { html: string } | { error: string };

export type Data = {
  alert: {
    data: {
      title: string;
      description: string;
      url: string;
      startsAt: string | null;
      endsAt: string | null;
      affectedLines: {
        name: string;
      }[];
      affectedStations: {
        name: string;
      }[];
      urlPreview: UrlPreview;
    };
    context: ProcessingContextData;
  } | null;
  back: {
    name: string;
    href: string;
  };
};

const sanitizeOptions: sanitizeHtml.IOptions = {
  allowedTags: [
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "p",
    "a",
    "ul",
    "ol",
    "li",
    "span",
    "strong",
    "b",
    "i",
    "em",
    "img",
    "table",
    "tbody",
    "thead",
    "tr",
    "th",
    "td",
  ],
  disallowedTagsMode: "recursiveEscape",
};

export async function data(
  pageContext: PageContext,
): Promise<Data & JsonSerializable> {
  const {
    routeParams,
    urlParsed,
    custom: { app },
  } = pageContext;

  const id = routeParams.id;
  const back = determineBackBehaviour(urlParsed);
  const alert = await AlertRepository.getRepository(app).getAlert(id);

  if (alert == null) {
    return { alert: null, back };
  }

  const urlPreview = await generateUrlPreview(app, alert.data.url);

  return {
    alert: {
      data: serializeData(alert.updatedData ?? alert.data, app, urlPreview),
      context: prepContext(app),
    },
    back,
  };
}

function serializeData(data: AlertData, app: App, urlPreview: UrlPreview) {
  const affectedLines = unique(
    data.affectedLinePtvIds
      .map((id) => app.lines.findByPtvId(id))
      .filter(nonNull),
  ).map((x) => ({ name: x.name }));

  const affectedStations = unique(
    data.affectedStationPtvIds
      .map((id) => app.stations.findByPtvId(id))
      .filter(nonNull),
  ).map((x) => ({ name: x.name }));

  return {
    title: data.title,
    description: data.description,
    url: data.url,
    startsAt:
      data.startsAt != null ? formatDate(data.startsAt, app.time.now()) : null,
    endsAt:
      data.endsAt != null ? formatDate(data.endsAt, app.time.now()) : null,
    affectedLines,
    affectedStations,
    urlPreview,
  };
}

const errorMapping: Record<DetailsError, string> = {
  "invalid-request": "Unknown error while generating the preview.",
  "unknown-error": "Unknown error while generating the preview.",
  "not-found": "Page no longer exists on PTV's website.",
  "unsupported-url": "Previews are only generated for PTV disruption articles.",
  "rate-limited":
    "Preview generation skipped to avoid spamming PTV - try again later.",
};

async function generateUrlPreview(app: App, url: string): Promise<UrlPreview> {
  try {
    const details = await app.alertSource.fetchDetails(url);

    if ("error" in details) {
      return { error: errorMapping[details.error] };
    }

    return { html: sanitizeHtml(details.details, sanitizeOptions) };
  } catch {
    return { error: errorMapping["unknown-error"] };
  }
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

function determineBackBehaviour(urlParsed: { search: Record<string, string> }) {
  const disruption = urlParsed.search.disruption;

  if (disruption) {
    return {
      name: "Disruption",
      href: `/admin/disruptions/${disruption}`,
    };
  }

  return {
    name: "Alerts",
    href: "/admin/alerts",
  };
}
