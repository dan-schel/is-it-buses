import { createVikeHandler } from "@/server/vike-handler";
import express from "express";
import cookieParser from "cookie-parser";
import { env } from "@/server/entry-point/env";
import { createDevMiddleware } from "vike/server";
import { App } from "@/server/app";
import { lines } from "@/server/entry-point/data/lines";
import { stations } from "@/server/entry-point/data/stations";
import { initDatabase } from "@/server/entry-point/services/database";
import { initAlertSource } from "@/server/entry-point/services/alert-source";
import { initDiscordBot } from "@/server/entry-point/services/discord";
import { RealTimeProvider } from "@/server/services/time-provider/real-time-provider";
import { ConsoleLogger } from "@/server/services/logger/console-logger";
import { AlertParsingRulesBuilder } from "@/server/data/alert/parsing/lib/alert-parsing-pipeline";
import { createApiRouter } from "@/server/api";

export async function run(root: string) {
  const database = await initDatabase();
  const alertSource = initAlertSource();
  const discordBot = initDiscordBot();
  const time = new RealTimeProvider();
  const logger = new ConsoleLogger();

  const alertParsingRules: AlertParsingRulesBuilder = (_app) => [
    // new BusReplacementsParsingRule(app),
  ];

  const app = new App(
    lines,
    stations,
    database,
    alertSource,
    discordBot,
    time,
    env.NODE_ENV,
    env.COMMIT_HASH ?? null,
    logger,
    alertParsingRules,
    env.SUPERADMIN_USERNAME,
    env.SUPERADMIN_PASSWORD,
  );

  await app.init();

  await startWebServer(app, root);
}

async function startWebServer(app: App, root: string) {
  const server = express();
  server.use(cookieParser());

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
