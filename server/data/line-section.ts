import { LineGroupNode } from "@/server/data/line-group/line-group-node";
import { z } from "zod";

/**
 * Represents a series of stations on a particular line, e.g. "East Pakenham to
 * Westall on the Pakenham line". CANNOT represent a commute, as a commute can
 * span multiple lines. Can be converted to a collection of RouteGraphEdges, for
 * use in disruptions.
 */
export class LineSection {
  constructor(
    readonly line: number,
    readonly a: LineGroupNode,
    readonly b: LineGroupNode,
  ) {
    if (a === b) {
      throw new Error("Line section must exist between two different nodes.");
    }
  }

  static readonly bson = z
    .object({
      line: z.number(),
      a: z.union([z.number(), z.literal("the-city")]),
      b: z.union([z.number(), z.literal("the-city")]),
    })
    .transform((x) => new LineSection(x.line, x.a, x.b));

  toBson(): z.input<typeof LineSection.bson> {
    return {
      line: this.line,
      a: this.a,
      b: this.b,
    };
  }
}
