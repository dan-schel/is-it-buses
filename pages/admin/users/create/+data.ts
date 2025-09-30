import { PageContext } from "vike/types";
import { JsonSerializable } from "@/shared/json-serializable";
import { withUser } from "@/server/services/auth/protection";
import { User } from "@/server/services/auth/user";
import { AuthProtectedData } from "@/shared/apis/lib";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type Data = AuthProtectedData<{}>;

export async function data(ctx: PageContext): Promise<Data & JsonSerializable> {
  return await withUser(ctx, User.CAN_MANAGE_USERS, async () => {
    return {};
  });
}
