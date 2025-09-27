import { BusReplacementsParsingRule } from "@/server/data/alert/parsing/rules/bus-replacements-parsing-rule";
import { IgnoreEverythingParsingRule } from "@/server/data/alert/parsing/rules/ignore-everything-parsing-rule";
import { PassthroughParsingRule } from "@/server/data/alert/parsing/rules/passthrough-parsing-rule";

// TODO: [DS] We don't serialize parsing rules, so not too sure why this would
// need to exist. Remove it?
export type AlertParsingRule =
  | PassthroughParsingRule
  | IgnoreEverythingParsingRule
  | BusReplacementsParsingRule;
