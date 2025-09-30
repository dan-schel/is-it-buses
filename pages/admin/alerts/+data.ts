import { PageContext } from "vike/types";
import { JsonSerializable } from "@/shared/json-serializable";
import { withUser } from "@/server/services/auth/protection";
import { User } from "@/server/services/auth/user";
import { AuthProtectedData } from "@/shared/apis/lib";
import {
  formatActivePeriod,
  formatAppearedAt,
  processingPrioritySort,
} from "@/server/data/alert/utils";

export type Data = AuthProtectedData<{
  alerts: {
    id: string;
    title: string;
    isInInbox: boolean;
    isActive: boolean;
    isPast: boolean;
    awaitingDeletion: boolean;
    activePeriod: string;
    appearedAt: string;
  }[];
}>;

export async function data(ctx: PageContext): Promise<Data & JsonSerializable> {
  return await withUser(ctx, User.CAN_VIEW_ALERTS_AND_DISRUPTIONS, async () => {
    const { app } = ctx.custom;

    const now = app.time.now();
    const alerts = await app.alerts.all();

    return {
      alerts: alerts.sort(processingPrioritySort(now)).map((x) => ({
        id: x.id,
        title: x.latestData.title,
        isInInbox: x.isInInbox,
        isActive: x.latestData.timeRange.includes(now),
        isPast: x.latestData.timeRange.occursBefore(now),
        awaitingDeletion: x.deleteAt != null,
        activePeriod: formatActivePeriod(now, x.latestData),
        appearedAt: formatAppearedAt(now, x.appearedAt),
      })),
    };
  });
}
