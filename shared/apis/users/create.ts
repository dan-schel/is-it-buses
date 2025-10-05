import { Api, buildAuthProtectedResultSchema } from "@/shared/apis/lib";
import z from "zod";

const permissionLevels = ["admin", "standard"] as const;
export type PermissionLevel = (typeof permissionLevels)[number];
const permissionLevelJson = z.enum(permissionLevels);

const argsSchema = z.object({
  username: z.string(),
  permissions: permissionLevelJson,
});

const resultSchema = buildAuthProtectedResultSchema(
  z.object({ password: z.string() }),
  ["username-taken", "invalid-username"],
);

export const api: Api<typeof argsSchema, typeof resultSchema> = {
  path: "/users/create",
  argsSchema,
  resultSchema,
};
