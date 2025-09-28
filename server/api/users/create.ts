import { App } from "@/server/app";
import { User } from "@/server/services/auth/user";
import { USERS_CREATE } from "@/shared/apis";
import { ArgsOf, ResultOf } from "@/shared/apis/lib";

export async function handle(
  app: App,
  user: User | null,
  args: ArgsOf<typeof USERS_CREATE>,
): Promise<ResultOf<typeof USERS_CREATE>> {
  // TODO: Throw 401 if not authenticated.
  // This means we always throw 401 if no one is logged in OR the session has
  // expired, which in both cases means the frontend knows to redirect to login.
  // Question is: If there's an API which doesn't require authentication, should
  // it still give 401 if the session is expired? Probably not. In order to
  // prevent that, we should move the token validation into each handler itself.
  //
  // const user = assertAuthenticated(token);
  //
  // Although, this means you can't use these handle functions for +data hooks.
  // How should those behave if:
  // - No token is given?
  // - An invalid/expired token is given?
  // - The user doesn't have permission to view the data?

  if (user == null || !user.canCreateUsers) {
    return { success: false, error: "insufficient-permissions" };
  }

  app.log.info(`Creating user: ${args.username}`);
  return { success: false, error: "username-taken" };
}
