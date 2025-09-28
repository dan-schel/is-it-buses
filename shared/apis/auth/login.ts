import { Api } from "@/shared/apis/lib";
import { UserProfile } from "@/shared/user-profile";
import z from "zod";

const argsSchema = z.object({
  username: z.string(),
  password: z.string(),
});

const resultSchema = z.union([
  z.object({ success: z.literal(true), profile: UserProfile.json }),
  z.object({
    success: z.literal(false),
    error: z.enum(["invalid-credentials"]),
  }),
]);

export const api: Api<typeof argsSchema, typeof resultSchema> = {
  path: "/auth/login",
  argsSchema,
  resultSchema,
};
