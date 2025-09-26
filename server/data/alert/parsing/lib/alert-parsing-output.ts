import { DisruptionData } from "@/server/data/disruption/data/disruption-data";
import { Disruption } from "@/server/data/disruption/disruption";
import { DisruptionPeriod } from "@/server/data/disruption/period/disruption-period";
import { uuid } from "@dan-schel/js-utils";

type AlertParsingOutputData =
  | {
      readonly result: "disruption";
      readonly data: DisruptionData;
      readonly period: DisruptionPeriod;
      readonly confidence: "low" | "high";
    }
  | {
      readonly result: "ignore";
    }
  | {
      readonly result: "unsure";
    };

export class AlertParsingOutput {
  static ignore = new AlertParsingOutput({ result: "ignore" });
  static unsure = new AlertParsingOutput({ result: "unsure" });

  constructor(private readonly _data: AlertParsingOutputData) {}

  static disruption(
    data: DisruptionData,
    period: DisruptionPeriod,
    confidence: "low" | "high",
  ) {
    return new AlertParsingOutput({
      result: "disruption",
      data,
      period,
      confidence,
    });
  }

  get result() {
    return this._data.result;
  }

  toNewDisruption(alertId: string): Disruption {
    const data = this._assertIsDisruption();
    return new Disruption(
      uuid(),
      data.data,
      [alertId],
      data.period,
      "automatic",
    );
  }

  updateExistingDisruption(disruptionId: string, alertId: string): Disruption {
    const data = this._assertIsDisruption();
    return new Disruption(
      disruptionId,
      data.data,
      [alertId],
      data.period,
      "automatic",
    );
  }

  private _assertIsDisruption() {
    const data = this._data;
    if (data.result !== "disruption") {
      throw new Error(`toNewDisruption() called on "${data.result}" output.`);
    }
    return data;
  }
}
