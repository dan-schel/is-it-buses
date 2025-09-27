import { Api } from "@/shared/apis/lib";
import z from "zod";

const argsSchema = z.object({
  username: z.string(),
});

const resultSchema = z.union([
  z.object({ success: z.literal(true), password: z.string() }),
  z.object({ success: z.literal(false), error: z.enum(["username-taken"]) }),
]);

export const api: Api<typeof argsSchema, typeof resultSchema> = {
  path: "/users/create",
  argsSchema,
  resultSchema,
};
