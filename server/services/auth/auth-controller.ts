import { App } from "@/server/app";
import { SESSIONS, USERS } from "@/server/database/models";
import { SessionModel } from "@/server/database/models/session";
import { UserModel } from "@/server/database/models/user";
import { User } from "@/server/services/auth/user";
import { Repository } from "@dan-schel/db";

export class AuthController {
  private _users: Repository<UserModel>;
  private _sessions: Repository<SessionModel>;
  private _superadminUser: User | null;

  constructor(private readonly _app: App) {
    this._users = _app.database.of(USERS);
    this._sessions = _app.database.of(SESSIONS);

    this._superadminUser = null; // Is lazy loaded.
  }

  async getUserFromToken(token: string): Promise<User | null> {
    const session = await this._sessions.first({
      where: { token, expiresAt: { gt: this._app.time.now() } },
    });

    if (session == null) return null;

    return await this.getUser(session.userId);
  }

  async getUser(id: string): Promise<User | null> {
    if (id === User.SUPERADMIN_ID) return await this.getSuperadminUser();

    return await this._users.get(id);
  }

  async getSuperadminUser(): Promise<User> {
    if (this._superadminUser != null) return this._superadminUser;

    const user = new User(
      User.SUPERADMIN_ID,
      this._app.superadminUsername,
      await User.hashPassword(this._app.superadminPassword),
      ["superadmin"],
    );

    this._superadminUser = user;
    return user;
  }

  async deleteExpiredSessions(): Promise<void> {
    const expiredSessions = await this._sessions.find({
      where: { expiresAt: { lte: this._app.time.now() } },
    });

    for (const session of expiredSessions) {
      await this._sessions.delete(session.id);
    }
  }
}
