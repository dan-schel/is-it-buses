import { Router } from "express";
import { App } from "@/server/app";
import { isAuthenticated } from "@/server/routes/middleware/authentication";
import { createUsersRouter } from "@/server/routes/admin/users";

export function createAdminRouter(app: App) {
  const router = Router();
  router.use(isAuthenticated);
  router.use("/users", createUsersRouter(app));
  return router;
}
