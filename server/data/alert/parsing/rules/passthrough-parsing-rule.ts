import { App } from "@/server/app";
import { AlertData } from "@/server/data/alert/alert-data";
import {
  AlertParsingOutput,
  ParsingConfidence,
} from "@/server/data/alert/parsing/lib/alert-parsing-output";
import { AlertParsingRuleBase } from "@/server/data/alert/parsing/lib/alert-parsing-rule-base";
import { CustomDisruptionData } from "@/server/data/disruption/data/custom-disruption-data";
import { StandardDisruptionPeriod } from "@/server/data/disruption/period/standard-disruption-period";

export class PassthroughParsingRule extends AlertParsingRuleBase {
  constructor(
    app: App,
    private readonly _confidence: ParsingConfidence,
  ) {
    super(app);
  }

  isCallingDibs(_data: AlertData): boolean {
    return true;
  }

  parse(data: AlertData): AlertParsingOutput {
    return AlertParsingOutput.singleDisruption(
      CustomDisruptionData.simple(data.title, data.description),
      StandardDisruptionPeriod.simple(data.startsAt, data.endsAt),
      this._confidence,
    );
  }
}
