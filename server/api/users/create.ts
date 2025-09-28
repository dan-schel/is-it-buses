import { assertUserWith } from "@/server/api/utils";
import { App } from "@/server/app";
import { USERS_CREATE } from "@/shared/apis";
import { ArgsOf, ResultOf } from "@/shared/apis/lib";

export async function handle(
  app: App,
  token: string | null,
  args: ArgsOf<typeof USERS_CREATE>,
): Promise<ResultOf<typeof USERS_CREATE>> {
  const { user, authError } = await assertUserWith(app, token, (user) => {
    return user.canCreateUsers;
  });

  if (authError != null) return authError;

  app.log.info(`"${user.username}" is creating new user "${args.username}"`);
  return { success: false, error: "username-taken" };
}
