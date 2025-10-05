import { ApiContext } from "@/server/api";
import { withUser } from "@/server/services/auth/protection";
import { User } from "@/server/services/auth/user";
import { USERS_DELETE } from "@/shared/apis";
import { ArgsOf, ResultOf } from "@/shared/apis/lib";

export async function handle(
  ctx: ApiContext,
  args: ArgsOf<typeof USERS_DELETE>,
): Promise<ResultOf<typeof USERS_DELETE>> {
  return await withUser(ctx, User.CAN_MANAGE_USERS, async (me) => {
    const { app } = ctx;

    if (args.id === me.id) return { error: "is-you" };

    const user = await app.auth.getUserById(args.id);
    if (user == null) return { error: "user-not-found" };
    if (user.isSuperadmin) return { error: "is-superadmin" };

    await app.auth.deleteUser(user.id);

    return { data: { success: true as const } };
  });
}
