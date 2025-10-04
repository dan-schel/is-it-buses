import { Api, buildAuthProtectedResultSchema } from "@/shared/apis/lib";
import z from "zod";

const argsSchema = z.object({
  id: z.string(),
});

const resultSchema = buildAuthProtectedResultSchema(
  z.object({ success: z.literal(true) }),
  ["is-superadmin", "user-not-found", "is-you"],
);

export const api: Api<typeof argsSchema, typeof resultSchema> = {
  path: "/users/delete",
  argsSchema,
  resultSchema,
};
