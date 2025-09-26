import { BusReplacementsParsingRule } from "@/server/data/alert/parsing/rules/bus-replacements-parsing-rule";
import { BusReplacementsDisruptionData } from "@/server/data/disruption/data/bus-replacements-disruption-data";
import { EndsAfterLastService } from "@/server/data/disruption/period/ends/ends-after-last-service";
import { EndsExactly } from "@/server/data/disruption/period/ends/ends-exactly";
import { EveningsOnlyDisruptionPeriod } from "@/server/data/disruption/period/evenings-only-disruption-period";
import { StandardDisruptionPeriod } from "@/server/data/disruption/period/standard-disruption-period";
import { JustDate } from "@/server/data/disruption/period/utils/just-date";
import { LineSection } from "@/server/data/line-section";
import { createTestApp } from "@/tests/server/utils";
import { describe, expect, it } from "vitest";
import {
  eveningsOnlyToAfterLastService,
  irrelevant,
  nameCollision,
  standardToAfterLastService,
  standardToExactly,
} from "@/tests/server/parser/sample-alerts/bus-replacements";
import { BELGRAVE, LILYDALE, SUNBURY, WERRIBEE } from "@/shared/line-ids";
import * as station from "@/shared/station-ids";
import { utcToLocalTime } from "@/server/data/disruption/period/utils/utils";

describe("Bus Replacement Auto Parser", () => {
  it("parses alert to a disruption with a standard period that ends after the last service", () => {
    const { app } = createTestApp();
    const parser = new BusReplacementsParsingRule(app);
    const output = parser.parse(standardToAfterLastService);

    expect(output).not.toBeNull();
    expect(output?.data).toStrictEqual(
      new BusReplacementsDisruptionData([
        new LineSection(SUNBURY, station.NORTH_MELBOURNE, station.SUNSHINE),
      ]),
    );
    expect(output?.period).toStrictEqual(
      new StandardDisruptionPeriod(
        standardToAfterLastService.startsAt,
        new EndsAfterLastService(
          JustDate.extractFromDate(standardToAfterLastService.endsAt!),
        ),
      ),
    );
  });

  it("parses alert to a disruption with a standard period that ends at an exact time", () => {
    const { app } = createTestApp();
    const parser = new BusReplacementsParsingRule(app);
    const output = parser.parse(standardToExactly);

    expect(output).not.toBeNull();
    expect(output?.data).toStrictEqual(
      new BusReplacementsDisruptionData([
        new LineSection(WERRIBEE, station.NEWPORT, station.WERRIBEE),
      ]),
    );
    expect(output?.period).toStrictEqual(
      new StandardDisruptionPeriod(
        standardToExactly.startsAt,
        new EndsExactly(standardToExactly.endsAt!),
      ),
    );
  });

  it("parses alert to a disruption with a evening only period that ends after the last service", () => {
    const { app } = createTestApp();
    const parser = new BusReplacementsParsingRule(app);

    const output = parser.parse(eveningsOnlyToAfterLastService);

    expect(output).not.toBeNull();
    expect(output?.data).toStrictEqual(
      new BusReplacementsDisruptionData([
        new LineSection(BELGRAVE, station.BLACKBURN, station.BELGRAVE),
        new LineSection(LILYDALE, station.BLACKBURN, station.LILYDALE),
      ]),
    );
    expect(output?.period).toStrictEqual(
      new EveningsOnlyDisruptionPeriod(
        eveningsOnlyToAfterLastService.startsAt,
        new EndsAfterLastService(
          JustDate.extractFromDate(eveningsOnlyToAfterLastService.endsAt!),
        ),
        utcToLocalTime(eveningsOnlyToAfterLastService.startsAt!).getHours(),
        utcToLocalTime(eveningsOnlyToAfterLastService.startsAt!).getMinutes(),
      ),
    );
  });

  it("selects the correct stations", () => {
    const { app } = createTestApp();
    const parser = new BusReplacementsParsingRule(app);
    const output = parser.parse(nameCollision);

    expect(output).not.toBeNull();
    expect(output?.data).toStrictEqual(
      new BusReplacementsDisruptionData([
        new LineSection(
          SUNBURY,
          station.MIDDLE_FOOTSCRAY,
          station.WEST_FOOTSCRAY,
        ),
      ]),
    );
    expect(output?.period).toStrictEqual(
      new EveningsOnlyDisruptionPeriod(
        nameCollision.startsAt,
        new EndsAfterLastService(
          JustDate.extractFromDate(nameCollision.endsAt!),
        ),
        utcToLocalTime(nameCollision.startsAt!).getHours(),
        utcToLocalTime(nameCollision.startsAt!).getMinutes(),
      ),
    );
  });

  it("ignores alerts that don't qualify as bus replacements", () => {
    const { app } = createTestApp();
    const parser = new BusReplacementsParsingRule(app);
    const outputs = irrelevant.map((x) => parser.parse(x));

    expect(outputs).toHaveLength(irrelevant.length);
    expect(outputs).toStrictEqual(
      Array.from({ length: irrelevant.length }, () => null),
    );
  });
});
