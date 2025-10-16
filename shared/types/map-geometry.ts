import { z } from "zod";

// Serialized types for map geometry that can be sent over the wire
// The actual Geometry class lives in frontend/components/map/renderer/geometry.ts
// These types match the toJSON() output format which uses compressed string representations

/** @knipignore */
export const SerializedSegment = z.object({
  startNodeId: z.number(),
  endNodeId: z.number(),
  color: z.enum([
    "red",
    "yellow",
    "green",
    "cyan",
    "blue",
    "purple",
    "pink",
    "grey",
  ]),
  points: z.string(), // Compressed FlexiPoint array
  distances: z.string(), // Compressed FlexiLength array
});

export type SerializedSegment = z.infer<typeof SerializedSegment>;

/** @knipignore */
export const SerializedInterchange = z.object({
  nodeIds: z.number().array().readonly(),
  thick: z.string().array(), // Array of compressed FlexiPoint arrays
  thin: z.string().optional(), // Optional compressed FlexiPoint array
});

export type SerializedInterchange = z.infer<typeof SerializedInterchange>;

/** @knipignore */
export const SerializedTerminus = z.object({
  nodeId: z.number(),
  color: z.enum([
    "red",
    "yellow",
    "green",
    "cyan",
    "blue",
    "purple",
    "pink",
    "grey",
  ]),
  points: z.string(), // Compressed FlexiPoint array
});

export type SerializedTerminus = z.infer<typeof SerializedTerminus>;

/** @knipignore */
export const SerializedViewport = z.object({
  x: z.number(),
  y: z.number(),
  w: z.number(),
  h: z.number(),
});

export type SerializedViewport = z.infer<typeof SerializedViewport>;

/** @knipignore */
export const SerializedFlexiViewport = z.object({
  min: SerializedViewport,
  max: SerializedViewport,
});

export type SerializedFlexiViewport = z.infer<typeof SerializedFlexiViewport>;

export const SerializedGeometry = z.object({
  segments: SerializedSegment.array(),
  interchanges: SerializedInterchange.array(),
  termini: SerializedTerminus.array(),
  viewport: SerializedFlexiViewport,
});

export type SerializedGeometry = z.infer<typeof SerializedGeometry>;
