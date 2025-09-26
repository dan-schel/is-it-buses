import { App } from "@/server/app";
import { AlertParsingOutput } from "@/server/data/alert/parsing/lib/alert-parsing-output";
import { AlertData } from "@/server/data/alert/alert-data";

export abstract class AlertParsingRuleBase {
  constructor(protected readonly _app: App) {}

  /**
   * Returns true if the rule believes _it_ should be responsible for parsing
   * this alert. If multiple rules return true, we do not attempt to parse the
   * alert.
   */
  abstract callDibs(data: AlertData): boolean;

  abstract parse(data: AlertData): AlertParsingOutput;
}
