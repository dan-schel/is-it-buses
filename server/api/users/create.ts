import { ApiContext } from "@/server/api";
import { withUser } from "@/server/services/auth/protection";
import { User } from "@/server/services/auth/user";
import { USERS_CREATE } from "@/shared/apis";
import { ArgsOf, ResultOf } from "@/shared/apis/lib";

export async function handle(
  ctx: ApiContext,
  args: ArgsOf<typeof USERS_CREATE>,
): Promise<ResultOf<typeof USERS_CREATE>> {
  return await withUser(ctx, User.CAN_MANAGE_USERS, async () => {
    const { app } = ctx;

    if (args.username.length === 0) return { error: "invalid-username" };

    const existingUser = await app.auth.getUserByUsername(args.username);
    if (existingUser != null) return { error: "username-taken" };

    const password = User.generateRandomPassword();

    const roles = {
      admin: ["admin"] as const,
      standard: ["standard"] as const,
    }[args.permissions];

    await app.auth.createUser(args.username, password, roles);

    return { data: { password } };
  });
}
