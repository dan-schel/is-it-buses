import { describe, expect, it } from "vitest";
import { MappingDataBuilder } from "@/server/data/map/mapping-data-builder";
import { MapSegment } from "@/server/data/map-segment";
import { LineGroup } from "@/server/data/line-group/line-group";

describe("MappingDataBuilder", () => {
  const lineGroup = new LineGroup([[1, 2, 3]], [100]);

  describe("#add", () => {
    it("can assign multiple map segments to a single line shape edge", () => {
      const builder = new MappingDataBuilder(lineGroup);
      const mappingData = builder.add(1, 2, [10, 20, 30]).build();

      expect(mappingData.data).toHaveLength(1);
      const entry = mappingData.data[0];
      expect(entry.edge.a).toBe(1);
      expect(entry.edge.b).toBe(2);
      expect(entry.segments).toHaveLength(2);
      expect(entry.segments[0].equals(MapSegment.full(10, 20))).toBe(true);
      expect(entry.segments[1].equals(MapSegment.full(20, 30))).toBe(true);
    });

    it("divides a single map segment among multiple line shape edges", () => {
      const mapSegment = MapSegment.full(10, 20);
      const builder = new MappingDataBuilder(lineGroup);
      const mappingData = builder
        .add(1, 3, [mapSegment.mapNodeA, mapSegment.mapNodeB])
        .build();

      expect(mappingData.data).toHaveLength(2);

      const first = mappingData.data[0];
      expect(first.edge.a).toBe(1);
      expect(first.edge.b).toBe(2);
      expect(first.segments).toHaveLength(1);
      expect(first.segments[0].equals(mapSegment.part(1, 2))).toBe(true);

      const second = mappingData.data[1];
      expect(second.edge.a).toBe(2);
      expect(second.edge.b).toBe(3);
      expect(second.segments).toHaveLength(1);
      expect(second.segments[0].equals(mapSegment.part(2, 2))).toBe(true);
    });

    it("ensures either a single line shape edge OR single map section", () => {
      const builder = new MappingDataBuilder(lineGroup);

      expect(() => builder.add(1, 1, [10, 20])).toThrow();
      expect(() => builder.add(1, 2, [10])).toThrow();
      expect(() => builder.add(1, 3, [10, 20, 30])).toThrow();
    });
  });

  describe("#build", () => {
    it("builds a MappingData object referencing the line group", () => {
      const builder = new MappingDataBuilder(lineGroup);
      const mappingData = builder.add(1, 2, [10, 20, 30]).build();
      expect(mappingData.lineGroup).toBe(lineGroup);
    });
  });
});
