import { renderPage } from "vike/server";
import express from "express";
import { getSettings } from "@/server/settings";
import { App } from "@/server/app";
import { Settings } from "@/shared/settings";
import { z } from "zod";
import { getToken } from "@/server/services/auth/cookie";
import { User } from "@/server/services/auth/user";
import { UserProfile } from "@/shared/user-profile";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Vike {
    interface PageContext {
      custom: CustomPageContext;
      client: ClientPageContext;
      urlOriginal: string;
    }
  }
}

type CustomPageContext = {
  app: App;
  settings: Settings;
  token: string | null;
  user: User | null;
};

type ClientPageContext = {
  isProduction: boolean;
  settings: z.input<typeof Settings.json>;
  user: z.input<typeof UserProfile.json> | null;
};

export function createVikeHandler(app: App) {
  return async (req: express.Request, res: express.Response) => {
    const settings = getSettings(req);
    const token = getToken(req);
    const user = token != null ? await app.auth.getUserForToken(token) : null;

    const { body, statusCode, headers } = (
      await renderPage({
        custom: {
          app,
          settings,
          token,
          user,
        },
        client: {
          isProduction: app.env === "production",
          settings: settings.toJSON(),
          user: user?.profile.toJSON() ?? null,
        },
        urlOriginal: req.url,
      } satisfies Vike.PageContext)
    ).httpResponse;

    headers.forEach(([name, value]) => res.setHeader(name, value));
    res.status(statusCode).send(body);
  };
}
