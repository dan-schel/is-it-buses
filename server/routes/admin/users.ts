import { z } from "zod";
import { hash } from "bcrypt";
import { Router } from "express";
import { App } from "@/server/app";
import { randomFillSync } from "crypto";
import { uuid } from "@dan-schel/js-utils";
import { Admin } from "@/server/database/models/admin";
import { ADMINS } from "@/server/database/models";
import { validateMiddleware } from "@/server/routes/middleware/validate";

export function createUsersRouter(app: App) {
  const router = Router();

  /**
   * Creates a new admin user and sends them their crendentials via Discord
   */
  router.post(
    "/",
    validateMiddleware({
      body: z.object({
        id: z.string().nonempty(),
        username: z.string().nonempty(),
      }),
    }),
    async (req, res) => {
      const { id, username } = req.body;

      if (!app.discordBot) {
        res.status(412).json({
          error:
            "Discord bot is unavailable at this moment. Try again at another time.",
        });
        return;
      }

      let existing = await app.database.of(ADMINS).first({
        where: {
          discord: id,
        },
      });
      if (existing) {
        res.status(409).json({
          error: "A user is already associated with this Discord account",
        });
        return;
      }

      existing = await app.database.of(ADMINS).first({
        where: {
          username,
        },
      });
      if (existing) {
        res.status(409).json({
          error: "Username unavailable",
        });
        return;
      }

      const password = generatePassword();
      const hashedPW = await hash(password, 10);
      const user = new Admin(uuid(), username, hashedPW, "admin", id);
      await app.database.of(ADMINS).create(user);

      await app.discordBot.inviteAdmin(
        id,
        username,
        password,
        req.headers.origin ??
          `${req.protocol}://${req.hostname}${req.hostname === "localhost" ? ":3000" : ""}`,
      );

      res.json();
    },
  );

  /**
   * Update the current users's account details
   */
  router.put(
    "/:id",
    validateMiddleware({
      body: z.object({
        username: z.string(),
        password: z.string().optional(),
      }),
      params: z.object({
        id: z.string(),
      }),
    }),
    async (req, res) => {
      const { id } = req.params;
      const { username, password } = req.body;

      if (req.session.getUser()?.id !== id) {
        res.status(403).json({
          error: "You cannot update someone else's credentials.",
        });
        return;
      }

      const user = await app.database.of(ADMINS).get(id);
      if (!user) {
        res.status(401).json({ error: "Not authorized" });
        return;
      }

      const existingUsername = await app.database
        .of(ADMINS)
        .first({ where: { username } });
      if (existingUsername && existingUsername.id !== user.id) {
        res.status(409).json({
          error: "Username unavailable",
        });
        return;
      }

      let hashedPW = null;
      if (password) {
        hashedPW = await hash(password, 10);
      }

      await app.database.of(ADMINS).update({
        ...user,
        username,
        password: hashedPW ?? user.password,
      });

      res.json();
    },
  );

  /**
   * Deletes a user
   */
  router.delete(
    "/:id",
    validateMiddleware({
      params: z.object({
        id: z.string(),
      }),
    }),
    async (req, res) => {
      const { id } = req.params;

      if (req.session.getUser()?.id === id) {
        res.status(409).json({ error: "You cannot delete yourself" });
        return;
      }

      if (req.session.getUser()?.role === "admin") {
        res.status(403).json({ error: "Insufficient privileges" });
        return;
      }

      const admin = await app.database.of(ADMINS).get(id);
      if (!admin || admin.role === "super") {
        res.status(404).json({ error: "Admin doesn't exist" });
        return;
      }

      await app.database.of(ADMINS).delete(admin.id);

      res.json();
    },
  );

  return router;
}

// Not intended on being complicated, users should change their password when once they login
// Source: https://stackoverflow.com/a/51540480
const generatePassword = (
  length = 16,
  characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$",
) =>
  Array.from(randomFillSync(new Uint32Array(length)))
    .map((x) => characters[x % characters.length])
    .join("");
