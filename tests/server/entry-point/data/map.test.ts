import { describe, expect, it } from "vitest";
import * as mapData from "@/server/entry-point/data/map";

// Add a snapshot test, and then:
// Test that every station is accounted for? (That's probably already handled
//   when we do the "automatically find the stop" thing while constructing
//   those).
// Test that every section of the map in the JSON is used by a group?
// Test that no section of the map in the JSON is used by more than one group?
// Test that the ID names sorta line up with the map segment names (e.g.
//   map.CLIFTON_HILL.JOLIMONT used with station.JOLIMONT). There'll be
//   exceptions but maybe it's a good sanity check?
// Test that each group only uses map segments from its own group?

describe("Melbourne mapping data", () => {
  it("", () => {
    expect(mapData).toMatchSnapshot();
    expect(true).toBe(false);
  });
});
