import { Request, Response } from "express";
import { App } from "@/server/app";
import z from "zod";

/** Extracts the user's auth token from an Express request's cookies. */
export function getToken(req: Request): string | null {
  const tokenAny = req.cookies?.token ?? null;
  const result = z.string().nullable().safeParse(tokenAny);
  if (!result.success) return null;
  return result.data;
}

/**
 * Updates the user's auth token cookie by attaching the "Set-Cookie" header to
 * an express response. Must be used before .json() or .send() in the response
 * chain.
 */
export function setToken(
  res: Response,
  app: App,
  token: string | null,
): Response {
  if (token == null) return res.clearCookie("token");

  return res.cookie("settings", token, {
    // Using "lax" means only sent if it's the same site, but still send on the
    // when navigating from an external site.
    sameSite: "lax",

    secure: app.env === "production",

    // We're not gonna rely on the cookie expiring to expire the session anyway.
    expires: new Date(Date.now() + 9999 * 24 * 60 * 60 * 1000),
  });
}
