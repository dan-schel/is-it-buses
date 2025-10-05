import { AlertData } from "@/server/data/alert/alert-data";

export function titleMatchesRegex(data: AlertData, regex: RegExp[]) {
  return regex.some((r) => r.test(data.title));
}
