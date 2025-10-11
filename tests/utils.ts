import { assert } from "vitest";

export function expectMatchingArrays<T>(
  actual: T[],
  expected: T[],
  message: string,
  equalsFunc: (a: T, b: T) => boolean,
  formatter: (x: T) => string,
): void {
  const missingItems = expected
    .filter((expectedItem) => !actual.some((x) => equalsFunc(x, expectedItem)))
    .map(formatter);

  const extraItems = actual
    .filter((actualItem) => !expected.some((x) => equalsFunc(x, actualItem)))
    .map(formatter);

  assert(
    missingItems.length === 0,
    `${message} - Missing: ${missingItems.join(", ")}`,
  );

  assert(
    extraItems.length === 0,
    `${message} - Unexpected extras: ${extraItems.join(", ")}`,
  );
}
