import { describe, expect, it } from "vitest";

describe("#env", () => {
  it("has TZ set to UTC", () => {
    // Require tests to run under UTC timezone, since that's the timezone the
    // server uses.
    expect(process.env.TZ).toBe("Etc/UTC");
  });
});
