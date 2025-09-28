import { PageContext } from "vike/types";
import { HISTORICAL_ALERTS } from "@/server/database/models";
import { JsonSerializable } from "@/shared/json-serializable";
import { withUser } from "@/server/services/auth/protection";
import { User } from "@/server/services/auth/user";
import { AuthProtectedData } from "@/shared/apis/lib";

const historicalRecordsStartDate = Date.parse("2025-03-02");
const millisInADay = 1000 * 60 * 60 * 24;

export type Data = AuthProtectedData<{
  historicalAlertsCount: number;
  historicalAlertsAvgPerDay: number;
}>;

export async function data(ctx: PageContext): Promise<Data & JsonSerializable> {
  return await withUser(ctx, User.IS_ADMIN, async () => {
    const { app } = ctx.custom;

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
  });
}
