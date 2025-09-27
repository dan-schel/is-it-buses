import { DatabaseModel } from "@dan-schel/db";
import { z } from "zod";

export class Admin {
  constructor(
    readonly id: string,
    readonly username: string,
    readonly password: string,
    readonly role: "super" | "admin",
    readonly discord: string | null,
  ) {}
}

export class AdminModel extends DatabaseModel<
  Admin,
  string,
  z.input<typeof AdminModel._schema>
> {
  static instance = new AdminModel();

  private static _schema = z.object({
    username: z.string(),
    password: z.string(),
    role: z.enum(["super", "admin"]),
    discord: z.string().nullable(),
  });

  private constructor() {
    super("admins");
  }

  getId(item: Admin): string {
    return item.id;
  }

  serialize(item: Admin): {
    username: string;
    password: string;
    role: "super" | "admin";
    discord: string | null;
  } {
    return {
      username: item.username,
      password: item.password,
      role: item.role,
      discord: item.discord,
    };
  }

  deserialize(id: string, item: unknown): Admin {
    const parsed = AdminModel._schema.parse(item);
    return new Admin(
      id,
      parsed.username,
      parsed.password,
      parsed.role,
      parsed.discord,
    );
  }
}
