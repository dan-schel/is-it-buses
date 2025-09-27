import { App } from "@/server/app";
import { USERS_CREATE } from "@/shared/apis";
import { ArgsOf, ResultOf } from "@/shared/apis/lib";

export async function handle(
  app: App,
  args: ArgsOf<typeof USERS_CREATE>,
): Promise<ResultOf<typeof USERS_CREATE>> {
  app.log.info(`Creating user: ${args.username}`);
  return { success: false, error: "username-taken" };
}
