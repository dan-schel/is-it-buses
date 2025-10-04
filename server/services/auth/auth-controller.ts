import { App } from "@/server/app";
import { SESSIONS, USERS } from "@/server/database/models";
import { SessionModel } from "@/server/database/models/session";
import { UserModel } from "@/server/database/models/user";
import { Session } from "@/server/services/auth/session";
import { Role, User } from "@/server/services/auth/user";
import { Repository } from "@dan-schel/db";
import { uuid } from "@dan-schel/js-utils";

export class AuthController {
  private _users: Repository<UserModel>;
  private _sessions: Repository<SessionModel>;
  private _superadminUser: User | null;

  constructor(private readonly _app: App) {
    this._users = _app.database.of(USERS);
    this._sessions = _app.database.of(SESSIONS);

    this._superadminUser = null; // Is lazy loaded.
  }

  async login(username: string, password: string) {
    const user = await this.getUserByUsername(username);
    if (user == null) return null;

    const passwordMatches = await user.isCorrectPassword(password);
    if (!passwordMatches) return null;

    const session = Session.create(user.id, this._app.time.now());
    await this._sessions.create(session);

    return { user, session };
  }

  async logout(token: string): Promise<void> {
    const session = await this._sessions.first({ where: { token } });
    if (session == null) return;

    await this._sessions.delete(session.id);
  }

  async getUserByUsername(username: string): Promise<User | null> {
    if (username === this._app.superadminUsername) {
      return await this._getSuperadminUser();
    }

    return this._users.first({ where: { username } });
  }

  async getUserForToken(token: string): Promise<User | null> {
    const session = await this._sessions.first({
      where: { token, expiresAt: { gt: this._app.time.now() } },
    });

    if (session == null) return null;

    return await this.getUserById(session.userId);
  }

  async getUserById(id: string): Promise<User | null> {
    if (id === User.SUPERADMIN_ID) return await this._getSuperadminUser();

    return await this._users.get(id);
  }

  async deleteExpiredSessions(): Promise<void> {
    const expiredSessions = await this._sessions.find({
      where: { expiresAt: { lte: this._app.time.now() } },
    });

    for (const session of expiredSessions) {
      await this._sessions.delete(session.id);
    }
  }

  async getAllUsers(): Promise<User[]> {
    const superadmin = await this._getSuperadminUser();
    const users = await this._users.all();
    return [superadmin, ...users];
  }

  async createUser(username: string, password: string, roles: readonly Role[]) {
    await this._users.create(
      new User(uuid(), username, await User.hashPassword(password), roles),
    );
  }

  async deleteUser(id: string): Promise<void> {
    if (id === User.SUPERADMIN_ID) {
      throw new Error("Cannot delete superadmin user");
    }

    const sessions = await this._sessions.find({ where: { userId: id } });
    for (const session of sessions) {
      await this._sessions.delete(session.id);
    }
    await this._users.delete(id);
  }

  async updateUser(user: User): Promise<void> {
    if (user.isSuperadmin) {
      throw new Error("Cannot update superadmin user");
    }

    await this._users.update(user);
  }

  private async _getSuperadminUser(): Promise<User> {
    if (this._superadminUser != null) return this._superadminUser;

    const user = new User(
      User.SUPERADMIN_ID,
      this._app.superadminUsername,
      await User.hashPassword(this._app.superadminPassword),
      [],
    );

    this._superadminUser = user;
    return user;
  }
}
