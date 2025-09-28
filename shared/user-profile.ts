import z from "zod";

export class UserProfile {
  constructor(
    readonly username: string,
    readonly typeDisplayString: string,
    readonly permissions: {
      readonly canManageUsers: boolean;
    },
  ) {}

  static readonly json = z
    .object({
      username: z.string(),
      typeDisplayString: z.string(),
      permissions: z.object({
        canManageUsers: z.boolean(),
      }),
    })
    .transform(
      (x) => new UserProfile(x.username, x.typeDisplayString, x.permissions),
    );

  toJSON(): z.input<typeof UserProfile.json> {
    return {
      username: this.username,
      typeDisplayString: this.typeDisplayString,
      permissions: this.permissions,
    };
  }
}
