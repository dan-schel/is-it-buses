import { AlertData } from "@/server/data/alert/alert-data";
import { AlertParsingOutput } from "@/server/data/alert/parsing/lib/alert-parsing-output";
import { AlertParsingRuleBase } from "@/server/data/alert/parsing/lib/alert-parsing-rule-base";
import { titleMatchesRegex } from "@/server/data/alert/parsing/lib/utils";

export class BusReplacementsParsingRule extends AlertParsingRuleBase {
  isCallingDibs(data: AlertData): boolean {
    return titleMatchesRegex(data, [
      /\b(buses|coaches) ((will )?replace|(will be )?replacing) (all|select )?(evening )?trains\b/i,
    ]);
  }

  parse(_data: AlertData): AlertParsingOutput {
    // TODO: [DS] Implement it, using inspiration from implementation below.
    return AlertParsingOutput.inconclusive;
  }
}

// import { App } from "@/server/app";
// import { AlertParsingOutput } from "@/server/data/alert/parsing/lib/alert-parsing-output";
// import { AlertParsingRuleBase } from "@/server/data/alert/parsing/lib/alert-parsing-rule-base";
// import {
//   isPartOfTheCity,
//   doesLineRunThroughCityLoop,
// } from "@/server/data/alert/parsing/lib/utils";
// import { AlertData } from "@/server/data/alert/alert-data";
// import { BusReplacementsDisruptionData } from "@/server/data/disruption/data/bus-replacements-disruption-data";
// import { EndsAfterLastService } from "@/server/data/disruption/period/ends/ends-after-last-service";
// import { EndsExactly } from "@/server/data/disruption/period/ends/ends-exactly";
// import { EveningsOnlyDisruptionPeriod } from "@/server/data/disruption/period/evenings-only-disruption-period";
// import { StandardDisruptionPeriod } from "@/server/data/disruption/period/standard-disruption-period";
// import { JustDate } from "@/server/data/disruption/period/utils/just-date";
// import { utcToLocalTime } from "@/server/data/disruption/period/utils/utils";
// import { LineSection } from "@/server/data/line-section";
// import { nonNull } from "@dan-schel/js-utils";

// export class BusReplacementsParsingRule extends AlertParsingRuleBase {
//   constructor(app: App) {
//     super(app);
//   }

//   parseAlert(data: AlertData): AlertParsingOutput | null {
//     if (!this._couldParse(data)) return null;

//     return this._process(data);
//   }

//   private _couldParse(data: AlertData): boolean {
//     return (
//       data.description.toLowerCase().includes("buses replace trains") &&
//       // Only parse disruptions that have a definitive time period
//       data.startsAt !== null &&
//       data.endsAt !== null
//     );
//   }

//   private _process(data: AlertData): AlertParsingOutput {
//     const affectedLines = data.affectedLinePtvIds
//       .map((x) => this._app.lines.findByPtvId(x))
//       .filter(nonNull);

//     const lineSections = affectedLines.flatMap((line) => {
//       let stations = line
//         .getStations()
//         .filter((station) =>
//           data.description.includes(this._app.stations.require(station).name),
//         );

//       // Indication that partial match has occured
//       if (stations.length > 2) {
//         const names = stations.map((x) => this._app.stations.require(x).name);
//         // Filter only stations where its name is only a substring to itself
//         stations = stations.filter(
//           (station) =>
//             names.filter((stationName) =>
//               stationName.includes(this._app.stations.require(station).name),
//             ).length === 1,
//         );
//       }

//       // Requires two stations to form a section
//       if (stations.length !== 2) {
//         return [];
//       }

//       const nodes = line.getNodes();
//       const a =
//         doesLineRunThroughCityLoop(nodes) && isPartOfTheCity(stations[0])
//           ? "the-city"
//           : stations[0];
//       const b =
//         doesLineRunThroughCityLoop(nodes) && isPartOfTheCity(stations[1])
//           ? "the-city"
//           : stations[1];

//       const section = new LineSection(line.id, a, b);
//       return line.isValidSection(section) ? section : [];
//     });

//     if (lineSections.length === 0) {
//       return AlertParsingOutput.unsure;
//     }

//     return AlertParsingOutput.disruption(
//       new BusReplacementsDisruptionData(lineSections),
//       this._parsePeriod(data),
//       "low",
//     );
//   }

//   private _parsePeriod(data: AlertData) {
//     const endsOnLastService =
//       data.title.includes("last service") ||
//       data.description.includes("last service");
//     const isEvening = data.description.includes("last service each night");

//     const ends = endsOnLastService
//       ? new EndsAfterLastService(JustDate.extractFromDate(data.endsAt!))
//       : new EndsExactly(data.endsAt!);

//     const startHour = utcToLocalTime(data.startsAt!).getHours();
//     const startMinute = utcToLocalTime(data.startsAt!).getMinutes();

//     return isEvening
//       ? new EveningsOnlyDisruptionPeriod(
//           data.startsAt,
//           ends,
//           startHour,
//           startMinute,
//         )
//       : new StandardDisruptionPeriod(data.startsAt, ends);
//   }
// }
