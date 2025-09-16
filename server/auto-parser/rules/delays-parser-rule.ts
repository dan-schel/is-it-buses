import { App } from "@/server/app";
import { AutoParsingOutput } from "@/server/auto-parser/auto-parsing-output";
import { AutoParserRuleBase } from "@/server/auto-parser/rules/auto-parser-rule-base";
import { AlertData } from "@/server/data/alert/alert-data";
import { DelaysDisruptionData } from "@/server/data/disruption/data/delays-disruption-data";
import { EndsNever } from "@/server/data/disruption/period/ends/ends-never";
import { StandardDisruptionPeriod } from "@/server/data/disruption/period/standard-disruption-period";
import { nonNull, parseIntNull } from "@dan-schel/js-utils";

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

    return new AutoParsingOutput(
      new DelaysDisruptionData(
        affectedLines.map((x) => x.id),
        affectedStation.id,
        delayInMinutes,
      ),
      new StandardDisruptionPeriod(null, new EndsNever()),
    );
  }
}
