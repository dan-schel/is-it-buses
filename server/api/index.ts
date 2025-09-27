import { Router } from "express";
import { App } from "@/server/app";
import * as apis from "@/shared/apis";
import * as handlers from "@/server/api/handlers";
import { createCorsMiddleware } from "@/server/api/cors";
import z, { ZodType } from "zod";
import { Api } from "@/shared/apis/lib";

export function createApiRouter(app: App) {
  const router = Router();
  router.use(createCorsMiddleware());

  setupHandler(app, router, apis.USERS_CREATE, handlers.USERS_CREATE);

  return router;
}

function setupHandler<Args extends ZodType, Result extends ZodType>(
  app: App,
  router: Router,
  api: Api<Args, Result>,
  handler: (app: App, args: z.infer<Args>) => Promise<z.infer<Result>>,
) {
  router.post(api.path, async (req, res) => {
    try {
      const args = api.argsSchema.safeParse(req.body);

      if (!args.success) {
        res.status(400).json(args.error);
        return;
      }

      const result = await handler(app, args.data);
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
