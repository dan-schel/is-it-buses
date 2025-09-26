import {
  AlertSource,
  Details,
} from "@/server/services/alert-source/alert-source";
import {
  PtvAlert,
  ptvAlertJson,
} from "@/server/services/alert-source/ptv-alert";
import { z } from "zod";

export class VtarAlertSource extends AlertSource {
  constructor(
    private vtarUrl: string,
    private relayKey: string,
  ) {
    super();
  }

  async fetchAlerts(): Promise<PtvAlert[]> {
    const responseSchema = z.object({
      disruptions: z.object({
        general: ptvAlertJson.array(),
        metro_train: ptvAlertJson.array(),
        regional_train: ptvAlertJson.array(),
      }),
    });

    const response = await fetch(`${this.vtarUrl}/ptv-disruptions.json`, {
      headers: {
        "relay-key": this.relayKey,
      },
    });

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    const data = responseSchema.parse(await response.json());

    // Join general, metro, and regional train disruptions into one array
    const combined = [
      ...data.disruptions.general,
      ...data.disruptions.metro_train,
      ...data.disruptions.regional_train,
    ];

    return combined;
  }

  async fetchDetails(url: string): Promise<Details> {
    const responseSchema = z.union([
      z.object({
        // It's not a coincidence that these match the supported values of
        // DetailsError, but we shouldn't couple the two together. The list here
        // need to match what VTAR returns, but DetailsError is generic to any
        // alert source implementation. All that to say, it's fine to duplicate
        // the list here imo.
        error: z.enum([
          "invalid-request",
          "unknown-error",
          "not-found",
          "unsupported-url",
          "rate-limited",
        ]),
      }),
      z.object({ details: z.string() }),
    ]);

    const response = await fetch(
      `${this.vtarUrl}/ptv-disruption-details?url=${encodeURIComponent(url.replace("http://", "https://"))}`,
      {
        headers: {
          "relay-key": this.relayKey,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    const data = responseSchema.parse(await response.json());

    if ("details" in data) {
      return { details: data.details };
    } else {
      return { error: data.error };
    }
  }
}
