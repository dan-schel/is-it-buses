import { AlertData } from "@/server/data/alert/alert-data";
import { AlertParsingOutput } from "@/server/data/alert/parsing/lib/alert-parsing-output";
import { AlertParsingRuleBase } from "@/server/data/alert/parsing/lib/alert-parsing-rule-base";

export class IgnoreEverythingParsingRule extends AlertParsingRuleBase {
  isCallingDibs(_data: AlertData): boolean {
    return true;
  }

  parse(_data: AlertData): AlertParsingOutput {
    return AlertParsingOutput.ignore;
  }
}
