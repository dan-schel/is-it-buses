import { Session } from "@/server/services/auth/session";
import { DatabaseModel } from "@dan-schel/db";
import { z } from "zod";

export class SessionModel extends DatabaseModel<
  Session,
  string,
  z.input<typeof SessionModel._schema>
> {
  static instance = new SessionModel();

  private static _schema = z.object({
    token: z.string(),
    userId: z.string(),
    expiresAt: z.date(),
  });

  private constructor() {
    super("sessions");
  }

  getId(item: Session): string {
    return item.id;
  }

  serialize(item: Session): z.input<typeof SessionModel._schema> {
    return {
      token: item.token,
      userId: item.userId,
      expiresAt: item.expiresAt,
    };
  }

  deserialize(id: string, item: unknown): Session {
    const parsed = SessionModel._schema.parse(item);
    return new Session(id, parsed.token, parsed.userId, parsed.expiresAt);
  }
}
