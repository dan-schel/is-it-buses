import { App } from "@/server/app";
import { AutoParsingOutput } from "@/server/data/alert/parsing/lib/auto-parsing-output";
import { BusReplacementsParserRule } from "@/server/data/alert/parsing/rules/bus-replacements-parser-rule";
import { AlertData } from "@/server/data/alert/alert-data";

export type AutoParserRule = BusReplacementsParserRule;

export abstract class AutoParserRuleBase {
  constructor(protected readonly _app: App) {}

  abstract parseAlert(data: AlertData): AutoParsingOutput | null;
}
