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

  get canCreateUsers() {
    return this.roles.includes("superadmin");
  }

  static async hashPassword(password: string) {
    return await hash(password, hashRotations);
  }

  async isCorrectPassword(password: string) {
    return await compare(password, this.passwordHash);
  }
}
