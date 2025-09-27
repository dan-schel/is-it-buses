import { Router } from "express";
import { App } from "@/server/app";
import * as apis from "@/shared/apis";
import * as handlers from "@/server/api/handlers";
import { createCorsMiddleware } from "@/server/api/cors";
import z, { ZodType } from "zod";
import { Api } from "@/shared/apis/lib";
import { getToken } from "@/server/services/auth/cookie";
import { User } from "@/server/services/auth/user";
import { setupLoginHandler } from "@/server/api/auth/login";
import { setupLogoutHandler } from "@/server/api/auth/logout";

export type ApiHandler<Args extends ZodType, Result extends ZodType> = (
  app: App,
  user: User | null,
  args: z.infer<Args>,
) => Promise<z.infer<Result>>;

export function createApiRouter(app: App) {
  const router = Router();
  router.use(createCorsMiddleware());

  setupLoginHandler(app, router);
  setupLogoutHandler(app, router);

  setupHandler(app, router, apis.USERS_CREATE, handlers.USERS_CREATE);

  // router.use(/(.*)/, (_req, res) => {
  //   res.sendStatus(404);
  // });

  return router;
}

function setupHandler<Args extends ZodType, Result extends ZodType>(
  app: App,
  router: Router,
  api: Api<Args, Result>,
  handler: ApiHandler<Args, Result>,
) {
  router.post(api.path, async (req, res) => {
    try {
      const args = api.argsSchema.safeParse(req.body);
      if (!args.success) {
        res.status(400).json(args.error);
        return;
      }

      const token = getToken(req);
      const user = token ? await app.auth.getUserForToken(token) : null;
      if (token != null && user == null) {
        res.sendStatus(401);
        return;
      }

      const result = await handler(app, user, args.data);
      res.json(result);
    } catch (err) {
      // TODO: In future we might want to allow handlers to throw some sort of
      // custom error (e.g. throw new Api400Error(message)) and handle it here
      // to return 400 rather than 500. So far, my plan is to handle that with
      // return types in the schema instead, but it's an idea.

      app.log.warn(`500 Error handling ${api.path}`);
      app.log.warn(err);
      res.sendStatus(500);
    }
  });
}
