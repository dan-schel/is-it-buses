import { Api } from "@/shared/apis/lib";
import z from "zod";

const argsSchema = z.null();

const resultSchema = z.object({ success: z.boolean() });

export const api: Api<typeof argsSchema, typeof resultSchema> = {
  path: "/auth/logout",
  argsSchema,
  resultSchema,
};
