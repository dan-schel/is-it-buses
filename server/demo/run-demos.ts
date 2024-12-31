import { config } from "../config";
import { initDatabase } from "../database/init-database";
import { CRAYONS } from "../database/models/models";
import { env } from "../env";
import {
  FakeDisruptionSource,
  VtarDisruptionSource,
} from "./disruption-source";

export async function runDemos() {
  try {
    const disruptionSource = setupDisruptionSource();
    await disruptionSource.fetchDisruptions();
  } catch (error) {
    console.warn("🔴 Failed to fetch disruptions.");
    console.warn(error);
  }

  // TODO: [DS] Update this to restore the traffic light status.
  const db = await initDatabase();
  const result = await db.of(CRAYONS).find({
    where: {
      usesLeft: { gt: 10 },
    },
  });
  // eslint-disable-next-line no-console
  console.log(result);
}

function setupDisruptionSource() {
  if (env.RELAY_KEY != null) {
    return new VtarDisruptionSource(config.VTAR_ENDPOINT_URL, env.RELAY_KEY);
  } else {
    return new FakeDisruptionSource();
  }
}
