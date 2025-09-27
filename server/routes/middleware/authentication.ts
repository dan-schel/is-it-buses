import { App } from "@/server/app";
import { Admin } from "@/server/database/models/admin";
import { ADMINS, SESSIONS } from "@/server/database/models";
import { Session } from "@/server/database/models/session";
import { uuid } from "@dan-schel/js-utils";
import { addDays, differenceInMinutes } from "date-fns";
import { minutesInDay } from "date-fns/constants";
import {
  CookieOptions,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";

declare module "express-serve-static-core" {
  interface Request {
    session: AuthSession;
  }
}

class AuthSession {
  private session: Session | null;
  readonly cookieName = "session_id";
  readonly cookieOptions: CookieOptions = {
    sameSite: "lax",
    httpOnly: true,
  };
  readonly minimumElapsedTime = minutesInDay - 10;

  constructor(
    private readonly app: App,
    private readonly secure: boolean,
    private readonly signed: boolean,
  ) {
    this.session = null;
  }

  getId() {
    return this.session?.id ?? null;
  }

  getUser() {
    if (!this.session) return null;
    return { id: this.session.userId, role: this.session.userRole };
  }

  /**
   * Restore the user's current session
   * @param session Auth session
   */
  async restore(session: Session) {
    this.session = session;

    // Update the expiry date only after 10 minutes has elapsed
    if (
      differenceInMinutes(session.expires, this.app.time.now()) <
      this.minimumElapsedTime
    ) {
      await this.app.database
        .of(SESSIONS)
        .update({ ...session, expires: addDays(this.app.time.now(), 1) });
    }
  }

  /**
   * Creates and stores a new auth sessison and sets the cookie in the client
   * @param req Incoming request
   * @param res Outgoing response
   * @param user Admin who initiated the session
   */
  async create(req: Request, res: Response, user: Admin): Promise<void> {
    // Ensure that on production, the cookie is secure and the protocol is HTTPS
    if (!req.secure && this.secure) throw new Error("Session insecure!");
    const admin = await this.app.database.of(ADMINS).require(user.id);

    const session = new Session(
      uuid(),
      addDays(this.app.time.now(), 1),
      admin.id,
      admin.role,
    );
    await this.app.database.of(SESSIONS).create(session);

    res.cookie(this.cookieName, session.id, this._getCookieOptions());
  }

  /**
   * Destroys the current session and clear the cookie from the client
   * @param res Outgoing response
   */
  async destroy(res: Response) {
    if (this.session) {
      await this.app.database.of(SESSIONS).delete(this.session.id);
      this.session = null;
    }
    res.clearCookie(this.cookieName);
  }

  _getCookieOptions(): CookieOptions {
    return {
      ...this.cookieOptions,
      secure: this.secure,
      signed: this.signed,
      expires: addDays(this.app.time.now(), 1),
    };
  }
}

/**
 * Middleware that setups up auth session and parses the
 * session cookie if present in the request
 */
export function sessionMiddleware(
  app: App,
  secure: boolean,
  signed: boolean,
): RequestHandler {
  return async (req, res, next) => {
    if (req.session) {
      return next();
    }

    req.session = new AuthSession(app, secure, signed);
    const cookies = signed ? req.signedCookies : req.cookies;
    if (!cookies || !(req.session.cookieName in cookies)) {
      return next();
    }

    const _session = await app.database
      .of(SESSIONS)
      .get(cookies[req.session.cookieName]);
    if (_session) {
      // Destroy the session if expired or admin no longer exists
      const admin = await app.database.of(ADMINS).get(_session.userId);
      if (_session.expires < app.time.now() || !admin) {
        await req.session.destroy(res);
      } else {
        await req.session.restore(_session);
      }
    } else {
      res.clearCookie(req.session.cookieName);
    }

    next();
  };
}

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.session.getId()) {
    next();
    return;
  }

  res.status(401).json({ error: "Unauthorized" });
}
