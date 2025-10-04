import { ApiContext } from "@/server/api";
import { User } from "@/server/services/auth/user";
import { AuthErrorResult, Failable } from "@/shared/apis/lib";
import { PageContext } from "vike/types";

export type Context = ApiContext | PageContext;

export async function withUser<K extends Failable<A, B>, A, B extends string>(
  ctx: Context,
  hasPermissions: (user: User) => boolean,
  func: (user: User) => Promise<K>,
): Promise<K | AuthErrorResult> {
  const { userAlreadyFetched, app, user, token } = extractContext(ctx);

  if (token == null) return { error: "not-authenticated" };

  const resolvedUser = userAlreadyFetched
    ? user
    : await app.auth.getUserForToken(token);

  if (resolvedUser == null) return { error: "invalid-token" };

  if (!hasPermissions(resolvedUser))
    return { error: "insufficient-permissions" };

  return await func(resolvedUser);
}

function extractContext(ctx: Context) {
  if ("custom" in ctx) {
    return {
      userAlreadyFetched: true as const,
      app: undefined,
      user: ctx.custom.user,
      token: ctx.custom.token,
    };
  } else {
    return {
      userAlreadyFetched: false as const,
      app: ctx.app,
      user: undefined,
      token: ctx.token,
    };
  }
}
