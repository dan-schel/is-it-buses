import { FlexiLength } from "@/frontend/components/map/renderer/dimensions/flexi-length";
import { FlexiPoint } from "@/frontend/components/map/renderer/dimensions/flexi-point";
import { nonNull } from "@dan-schel/js-utils";
import { z } from "zod";

export const flexiPointStringJson = schemaForCommaSeparated((x) =>
  FlexiPoint.fromString(x),
);

export const flexiLengthStringJson = schemaForCommaSeparated((x) =>
  FlexiLength.fromString(x),
);

export function createFlexiPointString(input: readonly FlexiPoint[]) {
  return toCommaSeparated(input);
}

export function createFlexiLengthString(input: readonly FlexiLength[]) {
  return toCommaSeparated(input);
}

function schemaForCommaSeparated<T extends object>(
  parser: (x: string) => T | null,
) {
  return z.string().transform((input, ctx) => {
    const numbers = input.split(",").map((x) => parser(x));
    const parsed = numbers.filter(nonNull);

    if (parsed.length !== numbers.length) {
      ctx.issues.push({
        code: "custom",
        message: "Not a valid comma separated string of numbers.",
        input,
      });
      return z.NEVER;
    }

    return parsed;
  });
}

function toCommaSeparated(input: readonly { toString: () => string }[]) {
  return input.map((x) => x.toString()).join(",");
}
