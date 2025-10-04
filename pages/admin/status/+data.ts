import { PageContext } from "vike/types";
import { JsonSerializable } from "@/shared/json-serializable";
import { withUser } from "@/server/services/auth/protection";
import { User } from "@/server/services/auth/user";
import { AuthProtectedData } from "@/shared/apis/lib";
import {
  ALERTS,
  DISRUPTIONS,
  HISTORICAL_ALERTS,
  SESSIONS,
} from "@/server/database/models";
import { millisecondsInDay } from "date-fns/constants";

const historicalRecordsStartDate = Date.parse("2025-03-02");

export type Data = AuthProtectedData<{
  commitHash: string | null;
  userCount: number;
  sessionCount: number;
  alertCount: number;
  disruptionCount: number;
  historicalAlertCount: number;
  historicalAlertAvgPerDay: number;
}>;

export async function data(ctx: PageContext): Promise<Data & JsonSerializable> {
  return await withUser(ctx, User.CAN_ACCESS_DASHBOARD, async () => {
    const { app } = ctx.custom;

    const userCount = (await app.auth.getAllUsers()).length;
    const sessionCount = await app.database.of(SESSIONS).count();
    const alertCount = await app.database.of(ALERTS).count();
    const disruptionCount = await app.database.of(DISRUPTIONS).count();
    const historicalAlertCount = await app.database
      .of(HISTORICAL_ALERTS)
      .count();

    const daysSinceRecordsBegan =
      (Date.now() - historicalRecordsStartDate) / millisecondsInDay;

    // Very crude average. Includes the initial dump of alerts, many of which
    // probably existed long before the 2nd of March!
    const historicalAlertAvgPerDay =
      historicalAlertCount / daysSinceRecordsBegan;

    return {
      data: {
        commitHash: app.commitHash,
        userCount,
        sessionCount,
        alertCount,
        disruptionCount,
        historicalAlertCount,
        historicalAlertAvgPerDay,
      },
    };
  });
}
