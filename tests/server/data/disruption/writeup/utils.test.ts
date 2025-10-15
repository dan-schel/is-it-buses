import { formatSection } from "@/server/data/disruption/writeup/utils";
import { LineGroupNode } from "@/server/data/line-group/line-group-node";
import { LineGroupSection } from "@/server/data/line-group/line-group-section";
import { BURNLEY as BURNLEY_GROUP } from "@/shared/group-ids";
import {
  ALAMEIN,
  BELGRAVE,
  BOX_HILL,
  BURNLEY,
  CAMBERWELL,
  GLEN_WAVERLEY,
  LILYDALE,
  RINGWOOD,
} from "@/shared/station-ids";
import { createTestApp } from "@/tests/server/utils";
import { describe, expect, it } from "vitest";

describe("#formatSection", () => {
  it("works", () => {
    expect(formatBurnleyGroup("the-city", [BURNLEY])).toBe(
      "from the city to Burnley",
    );

    expect(formatBurnleyGroup("the-city", [CAMBERWELL])).toBe(
      "from the city to Burnley and Camberwell",
    );

    expect(formatBurnleyGroup(BOX_HILL, [BELGRAVE, LILYDALE])).toBe(
      "from Box Hill to Lilydale and Belgrave",
    );

    expect(formatBurnleyGroup("the-city", [BELGRAVE])).toBe(
      "from the city to Burnley, Camberwell, Ringwood, and Belgrave",
    );

    expect(formatBurnleyGroup(RINGWOOD, [LILYDALE])).toBe(
      "from Ringwood to Lilydale",
    );

    expect(formatBurnleyGroup("the-city", [GLEN_WAVERLEY, ALAMEIN])).toBe(
      "from the city to Camberwell, Alamein, and Glen Waverley",
    );
  });

  function formatBurnleyGroup(
    startNode: LineGroupNode,
    endNodes: LineGroupNode[],
  ) {
    const { app } = createTestApp();
    const section = new LineGroupSection(BURNLEY_GROUP, startNode, endNodes);
    return formatSection(app, section);
  }
});
