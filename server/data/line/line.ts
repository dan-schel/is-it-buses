import { LineGroup } from "@/server/data/line-group/line-group";
import { LineSection } from "@/server/data/line-section";
import { MapSegment } from "@/server/data/map-segment";
import { MappingData } from "@/server/data/map/mapping-data";

type LineType = "suburban" | "regional";

export class Line {
  readonly id: number;
  readonly name: string;
  readonly ptvIds: readonly number[];
  readonly lineType: LineType;
  private readonly _group: LineGroup;
  private readonly _mappingData: MappingData | null;

  constructor({
    id,
    name,
    ptvIds,
    lineType,
    group,
    mappingData,
  }: {
    id: number;
    name: string;
    ptvIds: readonly number[];
    lineType: LineType;
    group: LineGroup;
    mappingData: MappingData | null;
  }) {
    this.id = id;
    this.name = name;
    this.ptvIds = ptvIds;
    this.lineType = lineType;
    this._group = group;
    this._mappingData = mappingData;
  }

  getNodes() {
    return this._group.getNodesOnLine(this.id);
  }

  isValidSection(section: LineSection) {
    const nodes = this.getNodes();
    return nodes.includes(section.a) && nodes.includes(section.b);
  }

  getStations() {
    return this._group.getStationsOnLine(this.id);
  }

  getMapSegmentsInSection(section: LineSection): readonly MapSegment[] {
    const mappingData = this._mappingData;
    if (mappingData == null) return [];

    const edges = this._group.getEdgesBetween(section.a, section.b);
    return edges.flatMap((edge) => mappingData.getMapSegmentsForEdge(edge));
  }
}
