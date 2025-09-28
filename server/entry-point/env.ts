import { configDotenv } from "dotenv";
import { z } from "zod";
import { stringNumberSchema } from "@/server/utils";
import { User } from "@/server/services/auth/user";

const schema = z.object({
  RELAY_KEY: z.string().optional(),
  DATABASE_URL: z.string().optional(),
  DISCORD_TOKEN: z.string().optional(),
  DISCORD_CHANNEL: z.string().optional(),
  COMMIT_HASH: z.string().optional(),
  SUPERADMIN_USERNAME: z.string().default(User.SUPERADMIN_DEFAULT_USERNAME),
  SUPERADMIN_PASSWORD: z.string().default(User.SUPERADMIN_DEFAULT_PASSWORD),

  NODE_ENV: z
    .enum(["production", "development", "test"])
    .default("development"),

  TZ: z.literal("Etc/UTC"),
  NPM_CONFIG_PRODUCTION: z.string().default("false"),
  PORT: stringNumberSchema.prefault("3000"),
  HMR_PORT: stringNumberSchema.prefault("24678"),
});

// Loads environment variables from the `.env` file into process.env.
configDotenv({ quiet: true });

// Parses process.env using the schema (i.e. checks that `RELAY_KEY`,
// `DATABASE_URL`, etc. are there), and makes them available in the "env"
// constant for other code to use.
export const env = schema.parse(process.env);
