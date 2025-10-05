import { Request, Response } from "express";
import { getCookieSettings, Settings } from "@/shared/settings";
import { App } from "@/server/app";

/** Extracts the user settings from an Express request's cookies. */
export function getSettings(req: Request): Settings {
  const settingsStr = req.cookies?.settings;
  return settingsStr == null
    ? Settings.default
    : Settings.tryParse(settingsStr);
}

/**
 * Updates the user's settings cookie by attaching the "Set-Cookie" header to an
 * express response. Must be used before .json() or .send() in the response
 * chain.
 * @knipignore
 */
export function setSettings(
  res: Response,
  app: App,
  settings: Settings,
): Response {
  const { sameSite, secure, maxAgeMillis } = getCookieSettings(
    app.env === "production",
  );

  return res.cookie("settings", JSON.stringify(settings.toJSON()), {
    sameSite,
    secure,
    expires: new Date(Date.now() + maxAgeMillis),
  });
}
