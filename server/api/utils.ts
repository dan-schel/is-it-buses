import { App } from "@/server/app";
import { User } from "@/server/services/auth/user";
import { StandardAuthError } from "@/shared/apis/lib";

export type Response =
  | { user: User; authError?: undefined }
  | {
      user?: undefined;
      authError: { success: false; error: StandardAuthError };
    };

export async function assertUserWith(
  app: App,
  token: string | null,
  hasPermission: (user: User) => boolean,
): Promise<Response> {
  if (token == null) {
    return { authError: { success: false, error: "not-authenticated" } };
  }

  const user = await app.auth.getUserForToken(token);
  if (user == null) {
    return { authError: { success: false, error: "invalid-token" } };
  }

  if (!hasPermission(user)) {
    return { authError: { success: false, error: "insufficient-permissions" } };
  }

  return { user };
}
