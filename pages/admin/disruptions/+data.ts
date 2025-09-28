import { PageContext } from "vike/types";
import { JsonSerializable } from "@/shared/json-serializable";
import { withUser } from "@/server/services/auth/protection";
import { User } from "@/server/services/auth/user";
import { AuthProtectedData } from "@/shared/apis/lib";

export type Data = AuthProtectedData<{
  disruptions: {
    id: string;
    isActive: boolean;
    isInvalid: boolean;
    text: string;
  }[];
}>;

export async function data(ctx: PageContext): Promise<Data & JsonSerializable> {
  return await withUser(ctx, User.CAN_VIEW_ALERTS_AND_DISRUPTIONS, async () => {
    const { app } = ctx.custom;

    const disruptions = await app.disruptions.all({ includeInvalid: true });

    return {
      disruptions: disruptions.map((x) => {
        const isValid = x.data.isValid(app);
        return {
          id: x.id,
          isActive: x.period.occursAt(app.time.now()),
          isInvalid: !isValid,
          text: isValid
            ? x.data.getWriteupAuthor().write(app, x).title
            : "Invalid disruption",
        };
      }),
    };
  });
}
