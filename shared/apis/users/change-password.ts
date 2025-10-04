import { Api, buildAuthProtectedResultSchema } from "@/shared/apis/lib";
import z from "zod";

const argsSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string(),
});

const resultSchema = buildAuthProtectedResultSchema(
  z.object({ success: z.literal(true) }),
  ["is-superadmin", "incorrect-old-password"],
);

export const api: Api<typeof argsSchema, typeof resultSchema> = {
  path: "/users/change-password",
  argsSchema,
  resultSchema,
};
