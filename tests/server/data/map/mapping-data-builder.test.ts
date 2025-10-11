import { describe, expect, it } from "vitest";
import { LineGroup } from "@/server/data/line-group/line-group";
import { MappingDataBuilder } from "@/server/data/map/mapping-data-builder";
import { MapSegment } from "@/server/data/map/map-segment";

describe("MappingDataBuilder", () => {
  const stations = {
    STATION_1: 1,
    STATION_2: 2,
    STATION_3: 3,
  } as const;

  const mapNodes = {
    STATION_1: 10,
    STATION_2: 20,
    STATION_3: 30,
  } as const;

  const lineGroup = new LineGroup(400, [[1, 2, 3]], [100], new Map());

  describe("#auto", () => {
    it("works", () => {
      const builder = new MappingDataBuilder(lineGroup, stations, mapNodes);
      builder.auto("STATION_1", "STATION_2");

      const result = builder.build();
      expect(result.data.length).toBe(1);

      const entry = result.data[0];
      expect(entry.edge.a).toBe(1);
      expect(entry.edge.b).toBe(2);
      expect(entry.segments.length).toBe(1);
      expect(entry.segments[0].equals(MapSegment.full(10, 20))).toBe(true);
    });
  });

  describe("#spread", () => {
    it("works", () => {
      const builder = new MappingDataBuilder(lineGroup, stations, mapNodes);
      builder.spread(1, 3, MapSegment.full(10, 20));

      const result = builder.build();
      expect(result.data.length).toBe(2);

      const [segment1, segment2] = MapSegment.full(10, 20).split(0.5);

      const entry1 = result.data[0];
      expect(entry1.edge.a).toBe(1);
      expect(entry1.edge.b).toBe(2);
      expect(entry1.segments.length).toBe(1);
      expect(entry1.segments[0].equals(segment1)).toBe(true);

      const entry2 = result.data[1];
      expect(entry2.edge.a).toBe(2);
      expect(entry2.edge.b).toBe(3);
      expect(entry2.segments.length).toBe(1);
      expect(entry2.segments[0].equals(segment2)).toBe(true);
    });
  });

  describe("#manual", () => {
    it("works", () => {
      const builder = new MappingDataBuilder(lineGroup, stations, mapNodes);
      builder.manual(1, 2, MapSegment.full(10, 15), MapSegment.full(15, 20));

      const result = builder.build();
      expect(result.data.length).toBe(1);

      const entry = result.data[0];
      expect(entry.edge.a).toBe(1);
      expect(entry.edge.b).toBe(2);
      expect(entry.segments.length).toBe(2);
      expect(entry.segments[0].equals(MapSegment.full(10, 15))).toBe(true);
      expect(entry.segments[1].equals(MapSegment.full(15, 20))).toBe(true);
    });
  });

  describe("#chain", () => {
    it("works", () => {
      const builder = new MappingDataBuilder(lineGroup, stations, mapNodes);
      builder.chain(1, 2, [10, 20, 30]);

      const result = builder.build();
      expect(result.data.length).toBe(1);

      const entry = result.data[0];
      expect(entry.edge.a).toBe(1);
      expect(entry.edge.b).toBe(2);
      expect(entry.segments.length).toBe(2);
      expect(entry.segments[0].equals(MapSegment.full(10, 20))).toBe(true);
      expect(entry.segments[1].equals(MapSegment.full(20, 30))).toBe(true);
    });
  });

  describe("#build", () => {
    it("carries through the line group", () => {
      const builder = new MappingDataBuilder(lineGroup, stations, mapNodes);
      builder.auto("STATION_1", "STATION_2");

      const result = builder.build();
      expect(result.groupId).toBe(lineGroup.id);
    });
  });
});
