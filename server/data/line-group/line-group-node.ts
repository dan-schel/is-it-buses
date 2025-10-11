import z from "zod";

export type LineGroupNode = number | "the-city";

export const lineGroupNodeJson = z.union([z.number(), z.literal("the-city")]);
