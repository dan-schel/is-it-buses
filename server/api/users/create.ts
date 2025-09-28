import { ApiContext } from "@/server/api";
import { withUser } from "@/server/services/auth/protection";
import { User } from "@/server/services/auth/user";
import { USERS_CREATE } from "@/shared/apis";
import { ArgsOf, ResultOf } from "@/shared/apis/lib";

export async function handle(
  ctx: ApiContext,
  args: ArgsOf<typeof USERS_CREATE>,
): Promise<ResultOf<typeof USERS_CREATE>> {
  return await withUser(ctx, User.CAN_MANAGE_USERS, async (user) => {
    const { app } = ctx;
    app.log.info(`"${user.username}" is creating new user "${args.username}"`);
    return { success: false, error: "username-taken" };
  });
}
