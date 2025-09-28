import { App } from "@/server/app";
import { setToken } from "@/server/services/auth/cookie";
import { api } from "@/shared/apis/auth/login";
import { ResultOf } from "@/shared/apis/lib";
import { Router } from "express";

export function setupLoginHandler(app: App, router: Router) {
  router.post(api.path, async (req, res) => {
    try {
      const args = api.argsSchema.safeParse(req.body);
      if (!args.success) {
        res.status(400).json(args.error);
        return;
      }

      const { username, password } = args.data;
      const result = await app.auth.login(username, password);

      if (result == null) {
        const response: ResultOf<typeof api> = {
          success: false,
          error: "invalid-credentials",
        };
        res.json(response);
        return;
      }

      const response: ResultOf<typeof api> = {
        success: true,
        profile: result.user.profile.toJSON(),
      };
      setToken(res, app, result.session.token).json(response);
    } catch (err) {
      app.log.warn(`500 Error handling ${api.path}`);
      app.log.warn(err);
      res.sendStatus(500);
    }
  });
}
