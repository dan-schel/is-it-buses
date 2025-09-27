import { DisruptionData } from "@/server/data/disruption/data/disruption-data";
import { Disruption } from "@/server/data/disruption/disruption";
import { DisruptionPeriod } from "@/server/data/disruption/period/disruption-period";
import { uuid } from "@dan-schel/js-utils";

export type ParsingConfidence = "low" | "high";

type AlertParsingOutputData =
  | {
      readonly result: "disruptions";
      readonly disruptions: {
        readonly data: DisruptionData;
        readonly period: DisruptionPeriod;
      }[];
      readonly confidence: ParsingConfidence;
    }
  | {
      readonly result: "ignore";
    }
  | {
      readonly result: "inconclusive";
    };

export class AlertParsingOutput {
  static ignore = new AlertParsingOutput({ result: "ignore" });
  static inconclusive = new AlertParsingOutput({ result: "inconclusive" });

  constructor(private readonly _data: AlertParsingOutputData) {}

  static singleDisruption(
    data: DisruptionData,
    period: DisruptionPeriod,
    confidence: ParsingConfidence,
  ) {
    return new AlertParsingOutput({
      result: "disruptions",
      disruptions: [{ data, period }],
      confidence,
    });
  }

  get confidence() {
    return this._requireDisruptionResult().confidence;
  }

  get hasDisruptions() {
    return this._data.result === "disruptions";
  }

  get isInconclusive() {
    return this._data.result === "inconclusive";
  }

  get resultantAlertState() {
    return {
      disruptions: () => {
        return {
          high: "processed-automatically" as const,
          low: "processed-provisionally" as const,
        }[this.confidence];
      },
      ignore: () => "ignored-automatically" as const,
      inconclusive: () => "new" as const,
    }[this._data.result]();
  }

  toDisruptions(alertId: string) {
    const data = this._requireDisruptionResult();
    return data.disruptions.map((d) => {
      return new Disruption(uuid(), d.data, d.period, alertId, "automatic");
    });
  }

  private _requireDisruptionResult() {
    const data = this._data;
    if (data.result !== "disruptions") {
      throw new Error(`toNewDisruption() called on "${data.result}" output.`);
    }
    return data;
  }
}
