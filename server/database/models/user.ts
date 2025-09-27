import { roleJson, User } from "@/server/services/auth/user";
import { DatabaseModel } from "@dan-schel/db";
import { z } from "zod";

export class UserModel extends DatabaseModel<
  User,
  string,
  z.input<typeof UserModel._schema>
> {
  static instance = new UserModel();

  private static _schema = z.object({
    username: z.string(),
    passwordHash: z.string(),
    roles: roleJson.array(),
  });

  private constructor() {
    super("users");
  }

  getId(item: User): string {
    return item.id;
  }

  serialize(item: User): z.input<typeof UserModel._schema> {
    return {
      username: item.username,
      passwordHash: item.passwordHash,
      roles: item.roles,
    };
  }

  deserialize(id: string, item: unknown): User {
    const parsed = UserModel._schema.parse(item);
    return new User(id, parsed.username, parsed.passwordHash, parsed.roles);
  }
}
