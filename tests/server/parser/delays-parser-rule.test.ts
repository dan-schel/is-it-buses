import { DelaysParserRule } from "@/server/auto-parser/rules/delays-parser-rule";
import { DelaysDisruptionData } from "@/server/data/disruption/data/delays-disruption-data";
import { EndsNever } from "@/server/data/disruption/period/ends/ends-never";
import { StandardDisruptionPeriod } from "@/server/data/disruption/period/standard-disruption-period";
import { FRANKSTON, SUNBURY } from "@/shared/line-ids";
import { MALVERN, MIDDLE_FOOTSCRAY } from "@/shared/station-ids";
import { SampleAlerts } from "@/tests/server/parser/sample-alerts";
import { createTestApp } from "@/tests/server/utils";
import { describe, expect, it } from "vitest";

describe("Delays Auto Parser", () => {
  const { AlertStandardToNeverEnds, AlertNameCollision } = SampleAlerts.Delays;

  it("parses alert to a disruption with a standard period that never ends", () => {
    const { app } = createTestApp();
    const parser = new DelaysParserRule(app);
    const output = parser.parseAlert(AlertStandardToNeverEnds.data);

    expect(output).not.toBeNull();
    expect(output?.data).toStrictEqual(
      new DelaysDisruptionData([FRANKSTON], MALVERN, 10),
    );
    expect(output?.period).toStrictEqual(
      new StandardDisruptionPeriod(null, new EndsNever()),
    );
  });

  it("ignores alerts that don't qualify as delays", () => {
    const { app } = createTestApp();
    const parser = new DelaysParserRule(app);
    const alerts = Object.values(SampleAlerts.BusReplacements);
    const outputs = alerts.map((x) => parser.parseAlert(x.data));

    expect(outputs).toHaveLength(alerts.length);
    expect(outputs).toStrictEqual(
      Array.from({ length: alerts.length }, () => null),
    );
  });

  it("selects the correct station", () => {
    const { app } = createTestApp();
    const parser = new DelaysParserRule(app);
    const output = parser.parseAlert(AlertNameCollision.data);

    expect(output).not.toBeNull();
    expect(output?.data).toStrictEqual(
      new DelaysDisruptionData([SUNBURY], MIDDLE_FOOTSCRAY, 50),
    );
    expect(output?.period).toStrictEqual(
      new StandardDisruptionPeriod(null, new EndsNever()),
    );
  });
});
