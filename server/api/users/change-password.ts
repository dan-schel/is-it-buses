import { ApiContext } from "@/server/api";
import { withUser } from "@/server/services/auth/protection";
import { User } from "@/server/services/auth/user";
import { USERS_CHANGE_PASSWORD } from "@/shared/apis";
import { ArgsOf, ResultOf } from "@/shared/apis/lib";

export async function handle(
  ctx: ApiContext,
  args: ArgsOf<typeof USERS_CHANGE_PASSWORD>,
): Promise<ResultOf<typeof USERS_CHANGE_PASSWORD>> {
  return await withUser(ctx, User.ANYONE, async (me) => {
    const { app } = ctx;

    if (me.isSuperadmin) return { error: "is-superadmin" };

    const oldPasswordMatches = await me.isCorrectPassword(args.oldPassword);
    if (!oldPasswordMatches) return { error: "incorrect-old-password" };

    const newPasswordHash = await User.hashPassword(args.newPassword);
    await app.auth.updateUser(me.with({ passwordHash: newPasswordHash }));

    return { data: { success: true as const } };
  });
}
