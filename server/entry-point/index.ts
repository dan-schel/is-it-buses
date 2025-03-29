import { createVikeHandler } from "@/server/vike-handler";
import express from "express";
import cookieParser from "cookie-parser";
import { env } from "@/server/entry-point/env";
import { createApiRouter } from "@/server/routes/api";
import { createDevMiddleware } from "vike/server";
import { App } from "@/server/app";
import { lines } from "@/server/entry-point/data/lines";
import { stations } from "@/server/entry-point/data/stations";
import { initDatabase } from "@/server/entry-point/services/database";
import { initAlertSource } from "@/server/entry-point/services/alert-source";
import { initDiscordBot } from "@/server/entry-point/services/discord";
import { RealTimeProvider } from "@/server/time-provider/real-time-provider";
import { sessionMiddleware } from "@/server/routes/middleware/authentication";

export async function run(root: string) {
  const database = await initDatabase();
  const alertSource = initAlertSource();
  const discordBot = initDiscordBot();
  const time = new RealTimeProvider();

  const app = new App(
    lines,
    stations,
    database,
    alertSource,
    discordBot,
    time,
    env.COMMIT_HASH ?? null,
    env.USER_NAME ?? null,
    env.PASSWORD ?? null,
  );

  await app.init();

  await startWebServer(app, root);
}

export async function startWebServer(app: App, root: string) {
  const server = express();

  server.use(cookieParser(env.SESSION_SECRET));
  server.use(
    sessionMiddleware(
      app,
      env.NODE_ENV === "production",
      env.SESSION_SECRET !== undefined,
    ),
  );

  if (env.NODE_ENV === "production") {
    // Required if DigitalOcean uses a proxy (e.g. nginx),
    // allows us to determine if a connection is secure (HTTPS)
    server.enable("trust proxy");

    server.use(express.static(`${root}/dist/client`));
  } else {
    const { devMiddleware } = await createDevMiddleware({ root });
    server.use(devMiddleware);
  }

  server.use("/api", express.json(), createApiRouter(app));
  server.all(/(.*)/, createVikeHandler(app));

  server.listen(env.PORT, () => {
    app.onServerReady(env.PORT);
  });

  return server;
}
