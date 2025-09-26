import { App } from "@/server/app";
import { AlertParsingOutput } from "@/server/data/alert/parsing/lib/alert-parsing-output";
import { AlertData } from "@/server/data/alert/alert-data";
import { AlertParsingRule } from "@/server/data/alert/parsing/rules";

export class AlertParsingPipeline {
  private readonly _rules: AlertParsingRule[];

  constructor(_app: App) {
    this._rules = [
      // new BusReplacementsParsingRule(app),
    ];
  }

  parse(data: AlertData): AlertParsingOutput {
    const applicableRules = this._findApplicableRules(data);
    if (applicableRules.length !== 1) return AlertParsingOutput.inconclusive;

    return applicableRules[0].parse(data);
  }

  private _findApplicableRules(data: AlertData) {
    return this._rules.filter((r) => r.isCallingDibs(data));
  }
}
