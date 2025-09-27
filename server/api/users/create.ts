import { App } from "@/server/app";
import { User } from "@/server/services/auth/user";
import { USERS_CREATE } from "@/shared/apis";
import { ArgsOf, ResultOf } from "@/shared/apis/lib";

export async function handle(
  app: App,
  user: User | null,
  args: ArgsOf<typeof USERS_CREATE>,
): Promise<ResultOf<typeof USERS_CREATE>> {
  if (user == null || !user.canCreateUsers) {
    return { success: false, error: "insufficient-permissions" };
  }

  app.log.info(`Creating user: ${args.username}`);
  return { success: false, error: "username-taken" };
}
