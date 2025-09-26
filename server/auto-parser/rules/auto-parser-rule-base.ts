import { App } from "@/server/app";
import { AutoParsingOutput } from "@/server/auto-parser/auto-parsing-output";
import { BusReplacementsParserRule } from "@/server/auto-parser/rules/bus-replacements-parser-rule";
import { AlertData } from "@/server/data/alert/alert-data";

export type AutoParserRule = BusReplacementsParserRule;

export abstract class AutoParserRuleBase {
  constructor(protected readonly _app: App) {}

  abstract parseAlert(data: AlertData): AutoParsingOutput | null;
}
