import { PageContext } from "vike/types";
import { JsonSerializable } from "@/shared/json-serializable";
import { withUser } from "@/server/services/auth/protection";
import { User } from "@/server/services/auth/user";
import { AuthProtectedData } from "@/shared/apis/lib";

export type Data = AuthProtectedData<{
  alerts: {
    id: string;
    title: string;
    isInInbox: boolean;
    awaitingDeletion: boolean;
    appearedAt: Date;
  }[];
}>;

export async function data(ctx: PageContext): Promise<Data & JsonSerializable> {
  return await withUser(ctx, User.CAN_VIEW_ALERTS_AND_DISRUPTIONS, async () => {
    const { app } = ctx.custom;

    const alerts = await app.alerts.all();

    return {
      alerts: alerts
        .map((x) => ({
          id: x.id,
          title: x.latestData.title,
          isInInbox: x.isInInbox,
          awaitingDeletion: x.deleteAt != null,
          appearedAt: x.appearedAt,
        }))
        .sort((a, b) => b.appearedAt.getTime() - a.appearedAt.getTime()),
    };
  });
}
