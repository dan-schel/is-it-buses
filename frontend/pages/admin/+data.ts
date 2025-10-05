import { PageContext } from "vike/types";
import { JsonSerializable } from "@/shared/json-serializable";
import { withUser } from "@/server/services/auth/protection";
import { User } from "@/server/services/auth/user";
import { AuthProtectedData } from "@/shared/apis/lib";

export type Data = AuthProtectedData<{
  canChangePassword: boolean;
}>;

export async function data(ctx: PageContext): Promise<Data & JsonSerializable> {
  return await withUser(ctx, User.CAN_ACCESS_DASHBOARD, async (user) => {
    return {
      data: {
        canChangePassword: !user.isSuperadmin,
      },
    };
  });
}
