import { ADMINS } from "@/server/database/models";
import { JsonSerializable } from "@/shared/json-serializable";
import { redirect } from "vike/abort";
import { PageContext } from "vike/types";

export type Data = {
  id: string;
  username: string;
};

export async function data(
  pageContext: PageContext,
): Promise<Data & JsonSerializable> {
  const { app, user } = pageContext.custom;

  if (!user) throw redirect("/admin");

  const _user = await app.database
    .of(ADMINS)
    .require(user.id)
    .catch(() => {
      throw redirect("/admin");
    });

  return { id: _user.id, username: _user.username };
}
