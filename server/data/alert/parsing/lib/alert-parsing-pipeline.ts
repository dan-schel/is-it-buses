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

  parseAlert(data: AlertData): AlertParsingOutput | null {
    for (const rule of this._rules) {
      const output = rule.parse(data);
      if (output) return output;
    }
    return null;
  }
}
