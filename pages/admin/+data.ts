import { PageContext } from "vike/types";
import { HISTORICAL_ALERTS } from "@/server/database/models";
import { JsonSerializable } from "@/shared/json-serializable";

const historicalRecordsStartDate = Date.parse("2025-03-02");
const millisInADay = 1000 * 60 * 60 * 24;

export type Data = {
  // TODO: This is temporary. Saves me having to check the prod database all the
  // time though. If you're here to work on the Admin page, free free to move
  // all this to another place or delete it.
  historicalAlertsCount: number;
  historicalAlertsAvgPerDay: number;
};

export async function data(
  pageContext: PageContext,
): Promise<Data & JsonSerializable> {
  const { app } = pageContext.custom;

  const historicalAlertsCount = await app.database
    .of(HISTORICAL_ALERTS)
    .count();

  const daysSinceRecordsBegan =
    (Date.now() - historicalRecordsStartDate) / millisInADay;

  // Very crude average. Includes the initial dump of alerts, many of which
  // probably existed long before the 2nd of March!
  const historicalAlertsAvgPerDay =
    historicalAlertsCount / daysSinceRecordsBegan;

  return {
    historicalAlertsCount,
    historicalAlertsAvgPerDay,
  };
}
