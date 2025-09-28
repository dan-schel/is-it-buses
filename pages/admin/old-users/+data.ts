import { PageContext } from "vike/types";
import { ADMINS } from "@/server/database/models";
import { JsonSerializable } from "@/shared/json-serializable";
import { calculateUserDefaultAvatarIndex, User } from "discord.js";

export type Data = {
  admins: {
    id: string;
    username: string;
    role: "admin" | "super";
    discord: string | null;
  }[];
  discord: {
    id: string;
    username: string;
    avatar: string;
  }[];
};

export async function data(
  pageContext: PageContext,
): Promise<Data & JsonSerializable> {
  const { app } = pageContext.custom;
  const admins = await app.database.of(ADMINS).find({
    where: {
      role: "admin",
    },
  });
  let discord: User[] = [];
  if (app.discordBot) {
    discord = await app.discordBot.getMembers();
  }

  return {
    admins: admins.map(({ password: _, ...user }) => user),
    discord: discord
      .filter(
        (user) => admins.findIndex((admin) => admin.discord === user.id) === -1,
      )
      .map(({ id, username, avatar }) => ({
        id,
        username,
        avatar: hashToSrc(id, avatar),
      })),
  };
}

function hashToSrc(id: string, avatar: string | null) {
  const baseURL = "https://cdn.discordapp.com/";
  if (!avatar) {
    return baseURL + `embed/avatars/${calculateUserDefaultAvatarIndex(id)}.png`;
  }

  return (
    baseURL +
    `avatars/${id}/${avatar}.${avatar.startsWith("a_") ? "gif" : "png"}`
  );
}
