import { z } from "zod";

export const ptvAlertJson = z
  .object({
    disruption_id: z.number(),
    title: z.string(),
    url: z.url(),
    description: z.string(),
    last_updated: z.iso.datetime(),
    from_date: z.iso.datetime(),
    to_date: z.iso.datetime().nullable(),
    routes: z
      .object({
        route_id: z.number(),
      })
      .array(),
    stops: z
      .object({
        stop_id: z.number(),
      })
      .array(),
  })
  .transform((x) => ({
    id: x.disruption_id,
    title: x.title,
    url: x.url,
    description: x.description,
    lastUpdated: x.last_updated,
    fromDate: x.from_date,
    toDate: x.to_date,
    routeIds: x.routes.map((r) => r.route_id),
    stopIds: x.stops.map((r) => r.stop_id),
  }));

export type PtvAlert = z.infer<typeof ptvAlertJson>;
