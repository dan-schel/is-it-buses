import { DatabaseModel } from "@dan-schel/db";
import { z } from "zod";

export class Session {
  constructor(
    readonly id: string,
    readonly expires: Date,
    readonly userId: string,
    readonly userRole: "super" | "admin",
  ) {}
}

export class SessionModel extends DatabaseModel<
  Session,
  string,
  z.input<typeof SessionModel._schema>
> {
  static instance = new SessionModel();

  private static _schema = z.object({
    expires: z.date(),
    userId: z.string(),
    userRole: z.enum(["super", "admin"]),
  });

  private constructor() {
    super("sessions");
  }

  getId(item: Session): string {
    return item.id;
  }

  serialize(item: Session): {
    expires: Date;
    userId: string;
    userRole: "super" | "admin";
  } {
    return {
      expires: item.expires,
      userId: item.userId,
      userRole: item.userRole,
    };
  }

  deserialize(id: string, item: unknown): Session {
    const parsed = SessionModel._schema.parse(item);
    return new Session(id, parsed.expires, parsed.userId, parsed.userRole);
  }
}
