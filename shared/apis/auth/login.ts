import { Api } from "@/shared/apis/lib";
import z from "zod";

const argsSchema = z.object({
  username: z.string(),
  password: z.string(),
});

const resultSchema = z.object({ success: z.boolean() });

export const api: Api<typeof argsSchema, typeof resultSchema> = {
  path: "/auth/login",
  argsSchema,
  resultSchema,
};
