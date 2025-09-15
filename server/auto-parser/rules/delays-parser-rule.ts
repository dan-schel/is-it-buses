import { App } from "@/server/app";
import { AutoParsingOutput } from "@/server/auto-parser/auto-parsing-output";
import { AutoParserRuleBase } from "@/server/auto-parser/rules/auto-parser-rule-base";
import {
  isOnCityBoundary,
  isPartOfTheCity,
  doesLineRunThroughCityLoop,
} from "@/server/auto-parser/rules/utils";
import { AlertData } from "@/server/data/alert/alert-data";
import { DelaysDisruptionData } from "@/server/data/disruption/data/delays-disruption-data";
import { EndsNever } from "@/server/data/disruption/period/ends/ends-never";
import { StandardDisruptionPeriod } from "@/server/data/disruption/period/standard-disruption-period";
import { LineSection } from "@/server/data/line-section";
import { nonNull, parseIntNull, unique } from "@dan-schel/js-utils";

export class DelaysParserRule extends AutoParserRuleBase {
  constructor(app: App) {
    super(app);
  }

  parseAlert(data: AlertData): AutoParsingOutput | null {
    if (!this._couldParse(data)) return null;

    return this._process(data);
  }

  private _couldParse(data: AlertData): boolean {
    return data.title.startsWith("Delays up to");
  }

  private _process(data: AlertData): AutoParsingOutput | null {
    const delayInMinutes = parseIntNull(
      data.title
        .match(/(\d+ minutes)+/g)
        ?.at(0)
        ?.split(" ")
        .at(0) ?? "",
    );
    if (!delayInMinutes || delayInMinutes < 1) {
      return null;
    }

    const affectedLines = data.affectedLinePtvIds
      .map((x) => this._app.lines.findByPtvId(x))
      .filter(nonNull);

    const possibleStations = this._app.stations.filter(
      (x) =>
        data.title.includes(x.name) &&
        affectedLines.every((line) => line.getStations().includes(x.id)),
    );

    // Some lines have stations where their name is a substring of other stations
    // e.g. Footscray, Middle Footscray, West Footscray
    // We would need to get the station with the longest name as it would be an exact match,
    // and the shorter names would be partial matches
    const affectedStation = possibleStations
      .sort((a, b) => b.name.length - a.name.length)
      .shift();
    if (!affectedStation) {
      return null;
    }

    // Get sections comprising of adjacent stations
    const sections = affectedLines.flatMap((line) => {
      const nodes = line.getNodes();
      const adjacentStations = unique(
        line.route
          .getAllRouteGraphPairs()
          .filter((x) =>
            isPartOfTheCity(affectedStation.id) &&
            doesLineRunThroughCityLoop(nodes)
              ? isOnCityBoundary(x)
              : x.includes(affectedStation.id),
          )
          .flatMap(({ a, b }) => [a, b])
          .filter((x) => x !== affectedStation.id)
          .map((x) =>
            isPartOfTheCity(x) && doesLineRunThroughCityLoop(nodes)
              ? "the-city"
              : x,
          ),
      );

      let section: LineSection;
      if (adjacentStations.length === 2) {
        section = new LineSection(
          line.id,
          adjacentStations[0],
          adjacentStations[1],
        );
      } else if (adjacentStations.length === 1) {
        section = new LineSection(
          line.id,
          affectedStation.id,
          adjacentStations[0],
        );
      } else {
        return [];
      }

      return line.isValidSection(section) ? section : [];
    });

    return new AutoParsingOutput(
      new DelaysDisruptionData(affectedStation.id, delayInMinutes, sections),
      new StandardDisruptionPeriod(null, new EndsNever()),
    );
  }
}
