import { env } from "@/server/entry-point/env";
import { DiscordBot } from "@/server/services/discord/bot";

export function initDiscordBot(): DiscordBot | null {
  if (env.DISCORD_TOKEN && env.DISCORD_CHANNEL) {
    return new DiscordBot(env.DISCORD_TOKEN, env.DISCORD_CHANNEL);
  } else {
    return null;
  }
}
