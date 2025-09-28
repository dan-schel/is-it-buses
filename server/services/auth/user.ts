import { UserProfile, UserProfileType } from "@/shared/user-profile";
import { compare, hash } from "bcrypt";
import z from "zod";

export const roles = ["superadmin", "admin"] as const;
export type Role = (typeof roles)[number];
export const roleJson = z.enum(roles);

const hashRotations = 15;

export class User {
  static readonly SUPERADMIN_ID = "superadmin";
  static readonly SUPERADMIN_DEFAULT_USERNAME = "admin";
  static readonly SUPERADMIN_DEFAULT_PASSWORD = "admin";

  static readonly ANYONE = (_user: User) => true;
  static readonly IS_SUPERADMIN = (user: User) => user.isSuperadmin;
  static readonly IS_ADMIN = (user: User) => user.isAdmin;
  static readonly CAN_MANAGE_USERS = (user: User) => user.canManageUsers;

  constructor(
    readonly id: string,
    readonly username: string,
    readonly passwordHash: string,
    readonly roles: Role[],
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
    roles?: Role[];
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

  get isAdmin() {
    return this.roles.includes("admin") || this.roles.includes("superadmin");
  }
  get isSuperadmin() {
    return this.roles.includes("superadmin");
  }

  get canManageUsers() {
    return this.isSuperadmin;
  }

  static async hashPassword(password: string) {
    return await hash(password, hashRotations);
  }

  async isCorrectPassword(password: string) {
    return await compare(password, this.passwordHash);
  }
}
