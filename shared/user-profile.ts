import z from "zod";

export const userProfileTypes = ["superadmin", "admin", "standard"] as const;
export type UserProfileType = (typeof userProfileTypes)[number];

export class UserProfile {
  constructor(
    readonly username: string,
    readonly type: UserProfileType,
    readonly permissions: {
      readonly canManageUsers: boolean;
    },
  ) {}

  static readonly json = z
    .object({
      username: z.string(),
      type: z.enum(userProfileTypes),
      permissions: z.object({
        canManageUsers: z.boolean(),
      }),
    })
    .transform((x) => new UserProfile(x.username, x.type, x.permissions));

  toJSON(): z.input<typeof UserProfile.json> {
    return {
      username: this.username,
      type: this.type,
      permissions: this.permissions,
    };
  }
}
