import { App } from "@/server/app";
import { getToken, setToken } from "@/server/services/auth/cookie";
import { api } from "@/shared/apis/auth/logout";
import { ResultOf } from "@/shared/apis/lib";
import { Router } from "express";

export function setupLogoutHandler(app: App, router: Router) {
  router.post(api.path, async (req, res) => {
    try {
      const args = api.argsSchema.safeParse(req.body);
      if (!args.success) {
        res.status(400).json(args.error);
        return;
      }

      const token = getToken(req);
      if (token == null) {
        const response: ResultOf<typeof api> = { success: false };
        setToken(res, app, null).json(response);
        return;
      }

      await app.auth.logout(token);

      const response: ResultOf<typeof api> = { success: true };
      setToken(res, app, null).json(response);
    } catch (err) {
      app.log.warn(`500 Error handling ${api.path}`);
      app.log.warn(err);
      res.sendStatus(500);
    }
  });
}
