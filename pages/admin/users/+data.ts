import { PageContext } from "vike/types";
import { JsonSerializable } from "@/shared/json-serializable";
import { withUser } from "@/server/services/auth/protection";
import { User } from "@/server/services/auth/user";
import { AuthProtectedData } from "@/shared/apis/lib";

export type Data = AuthProtectedData<{
  users: { id: string; username: string; type: string }[];
}>;

export async function data(ctx: PageContext): Promise<Data & JsonSerializable> {
  return await withUser(ctx, User.CAN_MANAGE_USERS, async () => {
    const { app } = ctx.custom;

    const users = await app.auth.getAllUsers();

    return {
      data: {
        users: users.map((x) => ({
          id: x.id,
          username: x.username,
          type: x.profileType,
        })),
      },
    };
  });
}
