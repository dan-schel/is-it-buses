import { UserProfile, UserProfileType } from "@/shared/user-profile";
import { compare, hash } from "bcrypt";
import z from "zod";

const roles = ["admin", "standard"] as const;
export type Role = (typeof roles)[number];
export const roleJson = z.enum(roles);

const hashRotations = 12;

export class User {
  static readonly SUPERADMIN_ID = "superadmin";
  static readonly SUPERADMIN_DEFAULT_USERNAME = "admin";
  static readonly SUPERADMIN_DEFAULT_PASSWORD = "admin";

  static readonly ANYONE = (_user: User) => true;
  static readonly CAN_ACCESS_DASHBOARD = (user: User) => user.isStandard;
  static readonly CAN_MANAGE_USERS = (user: User) => user.canManageUsers;
  static readonly CAN_VIEW_ALERTS_AND_DISRUPTIONS = (user: User) =>
    user.canViewAlertsAndDisruptions;
  static readonly CAN_EDIT_ALERTS_AND_DISRUPTIONS = (user: User) =>
    user.canEditAlertsAndDisruptions;

  constructor(
    readonly id: string,
    readonly username: string,
    readonly passwordHash: string,
    readonly roles: readonly Role[],
  ) {}

  with({
    id = this.id,
    username = this.username,
    passwordHash = this.passwordHash,
    roles = this.roles,
  }: {
    id?: string;
    username?: string;
    passwordHash?: string;
    roles?: readonly Role[];
  }) {
    return new User(id, username, passwordHash, roles);
  }

  get profile(): UserProfile {
    return new UserProfile(this.id, this.username, this.profileType, {
      canManageUsers: this.canManageUsers,
    });
  }

  get profileType(): UserProfileType {
    if (this.isSuperadmin) return "superadmin";
    if (this.isAdmin) return "admin";
    return "standard";
  }

  get isStandard() {
    return this.roles.includes("standard") || this.isAdmin;
  }
  get isAdmin() {
    return this.roles.includes("admin") || this.isSuperadmin;
  }
  get isSuperadmin() {
    return this.id === User.SUPERADMIN_ID;
  }

  get canManageUsers() {
    return this.isAdmin;
  }
  get canViewAlertsAndDisruptions() {
    return this.isStandard;
  }
  get canEditAlertsAndDisruptions() {
    return this.isStandard;
  }

  static async hashPassword(password: string) {
    return await hash(password, hashRotations);
  }

  async isCorrectPassword(password: string) {
    return await compare(password, this.passwordHash);
  }

  static generateRandomPassword(): string {
    return crypto
      .getRandomValues(new Uint8Array(8))
      .reduce((str, x) => str + x.toString(16).padStart(2, "0"), "");
  }
}
