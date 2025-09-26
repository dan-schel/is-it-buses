import { PageContext } from "vike/types";
import { JsonSerializable } from "@/shared/json-serializable";
import {
  OverviewPageLineData,
  OverviewPageLineStatusColor,
} from "@/shared/types/overview-page";
import { DisruptionSummary } from "@/shared/types/disruption";
import { LineCollection } from "@/server/data/line/line-collection";
import { Disruption } from "@/server/data/disruption/disruption";
import {
  DisruptionWriteup,
  LineStatusIndicatorPriority,
} from "@/server/data/disruption/writeup/disruption-writeup";
import { Line } from "@/server/data/line/line";
import { MapHighlighting } from "@/server/data/disruption/map-highlighting/map-highlighting";
import { SerializedMapHighlighting } from "@/shared/types/map-data";
import { DisruptionRepository } from "@/server/database-repository/disruption-repository";
import { FilterableDisruptionCategory } from "@/shared/settings";
import { DisruptionType } from "@/shared/types/disruption";
import { TimeRange } from "@/server/data/disruption/period/utils/time-range";
import { addWeeks, endOfDay } from "date-fns";
import { localToUtcTime } from "@/server/data/disruption/period/utils/utils";
import { unique } from "@dan-schel/js-utils";

const statusColorMapping: Record<
  LineStatusIndicatorPriority,
  OverviewPageLineStatusColor
> = {
  hidden: "green",
  "very-low": "yellow",
  low: "yellow",
  medium: "red",
  high: "red",
};

export type PeriodFilter = "now" | "today" | "week";

export type Data = {
  disruptions: DisruptionSummary[];
  suburban: OverviewPageLineData[];
  regional: OverviewPageLineData[];
  mapHighlighting: SerializedMapHighlighting;
  occuring: PeriodFilter;
};

type PreprocessedDisruption = {
  disruption: Disruption;
  lines: readonly number[];
  writeup: DisruptionWriteup;
  map: MapHighlighting;
};

export async function data(
  pageContext: PageContext,
): Promise<Data & JsonSerializable> {
  const { app, settings } = pageContext.custom;
  const { occuring } = pageContext.urlParsed.search;

  const disruptions: PreprocessedDisruption[] = (
    await DisruptionRepository.getRepository(app).listDisruptions({
      period:
        occuring === "week"
          ? new TimeRange(app.time.now(), addWeeks(app.time.now(), 1))
          : occuring === "today"
            ? new TimeRange(
                app.time.now(),
                localToUtcTime(endOfDay(app.time.now())),
              )
            : app.time.now(),
      types: getTypesFromSettings(settings.enabledCategories),
    })
  ).map((x) => ({
    disruption: x,
    lines: x.data.getImpactedLines(app),
    writeup: x.data.getWriteupAuthor().write(app, x),
    map: x.data.getMapHighlighter().getHighlighting(app),
  }));

  return {
    occuring: occuring === "week" || occuring === "today" ? occuring : "now",
    disruptions: getSummaries(disruptions),
    ...getLines(app.lines, disruptions),
    mapHighlighting: MapHighlighting.serializeGroup(
      disruptions.map((x) => x.map),
    ),
  };
}

function getSummaries(
  disruptions: PreprocessedDisruption[],
): DisruptionSummary[] {
  return disruptions.map((x) => ({
    id: x.disruption.id,
    headline: x.writeup.summary.headline,
    subject: x.writeup.summary.subject,
    period: x.writeup.summary.period,
    icon: x.writeup.summary.iconType,
  }));
}

function getLines(
  lines: LineCollection,
  disruptions: PreprocessedDisruption[],
) {
  function populate(l: Line): OverviewPageLineData {
    const disruptionsThisLine = disruptions.filter(
      (d) =>
        d.lines.includes(l.id) &&
        d.writeup.lineStatusIndicator.priority !== "hidden",
    );

    if (disruptionsThisLine.length === 0) {
      return {
        id: l.id,
        name: l.name,
        status: "No reported disruptions",
        statusColor: "green",
      };
    }

    const highestPriority = DisruptionWriteup.ofHighestPriority(
      disruptionsThisLine.map((x) => x.writeup),
    );

    return {
      id: l.id,
      name: l.name,

      // When we have multiple disruptions tied for highest priority, we display
      // them comma separated.
      //
      // (TODO: Would be neat if we could somehow combine the display strings
      // together in a smarter way, e.g. "Middle Footscray station closed,
      // Ginifer station closed" is combined into "Middle Footscray and Ginifer
      // stations closed".)
      status: unique(
        highestPriority.map((x) => x.lineStatusIndicator.summary),
      ).join(", "),
      statusColor:
        statusColorMapping[highestPriority[0].lineStatusIndicator.priority],
    };
  }

  function byNameDesc(a: OverviewPageLineData, b: OverviewPageLineData) {
    return a.name.localeCompare(b.name);
  }

  return {
    suburban: lines
      .filter((l) => l.lineType === "suburban")
      .map(populate)
      .sort(byNameDesc),
    regional: lines
      .filter((l) => l.lineType === "regional")
      .map(populate)
      .sort(byNameDesc),
  };
}

function getTypesFromSettings(
  filters: readonly FilterableDisruptionCategory[],
): DisruptionType[] {
  // Default options
  const types: DisruptionType[] = [
    "bus-replacements",
    "no-city-loop",
    "no-trains-running",
    "custom",
  ];

  filters.forEach((filter) => {
    switch (filter) {
      case "delays":
        types.push("delays");
        break;
      case "station-closures":
        types.push("station-closure");
        break;

      // TODO: Update with new disruptions when added
      case "cancellations":
      case "accessibility":
      case "car-park-closures":
      default:
        break;
    }
  });

  return types;
}
