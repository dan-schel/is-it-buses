import { PageContext } from "vike/types";
import { JsonSerializable } from "@/shared/json-serializable";
import { withUser } from "@/server/services/auth/protection";
import { User } from "@/server/services/auth/user";
import { AuthProtectedData } from "@/shared/apis/lib";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type Data = AuthProtectedData<{}>;

export async function data(ctx: PageContext): Promise<Data & JsonSerializable> {
  return await withUser(ctx, User.CAN_ACCESS_DASHBOARD, async () => {
    // TODO: Return if there's new alerts to process to display a badge on the
    // dashboard?
    return { data: {} };
  });
}
