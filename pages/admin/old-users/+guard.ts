import { PageContext } from "vike/types";

import { redirect } from "vike/abort";

export function guard(pageContext: PageContext) {
  const { user } = pageContext.custom;
  if (!user || user.role !== "super") throw redirect("/admin");
}
