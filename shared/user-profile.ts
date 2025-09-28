import z from "zod";

export const userProfileTypes = ["superadmin", "admin", "standard"] as const;
export type UserProfileType = (typeof userProfileTypes)[number];

export class UserProfile {
  constructor(
    readonly id: string,
    readonly username: string,
    readonly type: UserProfileType,
    readonly permissions: {
      readonly canManageUsers: boolean;
    },
  ) {}

  static readonly json = z
    .object({
      id: z.string(),
      username: z.string(),
      type: z.enum(userProfileTypes),
      permissions: z.object({
        canManageUsers: z.boolean(),
      }),
    })
    .transform((x) => new UserProfile(x.id, x.username, x.type, x.permissions));

  toJSON(): z.input<typeof UserProfile.json> {
    return {
      id: this.id,
      username: this.username,
      type: this.type,
      permissions: this.permissions,
    };
  }
}
