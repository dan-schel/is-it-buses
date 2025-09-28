import z from "zod";

export class UserProfile {
  constructor(
    readonly username: string,
    readonly rank: string,
    readonly permissions: {
      readonly canCreateUsers: boolean;
    },
  ) {}

  static readonly json = z
    .object({
      username: z.string(),
      rank: z.string(),
      permissions: z.object({
        canCreateUsers: z.boolean(),
      }),
    })
    .transform((x) => new UserProfile(x.username, x.rank, x.permissions));

  toJSON(): z.input<typeof UserProfile.json> {
    return {
      username: this.username,
      rank: this.rank,
      permissions: this.permissions,
    };
  }
}
