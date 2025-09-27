import { App } from "@/server/app";
import { ADMINS } from "@/server/database/models";
import { validateMiddleware } from "@/server/routes/middleware/validate";
import { loginSchema } from "@/shared/types/auth";
import { compare } from "bcrypt";
import { Router } from "express";

export function createAuthRouter(app: App) {
  const authRouter = Router();

  authRouter.post(
    "/login",
    validateMiddleware({ body: loginSchema }),
    async (req, res) => {
      const { username, password } = req.body;

      const user = await app.database.of(ADMINS).first({ where: { username } });
      if (!user) {
        res.status(403).json({ error: "Username/password is incorrect" });
        return;
      }

      const isValid = await compare(password, user.password);
      if (!isValid) {
        res.status(403).json({ error: "Username/password is incorrect" });
        return;
      }

      await req.session.create(req, res, user);
      res.redirect("/admin");
    },
  );

  authRouter.get("/logout", async (req, res) => {
    await req.session.destroy(res);
    res.redirect("/admin");
  });

  return authRouter;
}
