import { LineGroup } from "@/server/data/line-group/line-group";
import { LineSection } from "@/server/data/line-section";
import { LineRoute } from "@/server/data/line/line-routes/line-route";

type LineType = "suburban" | "regional";

export class Line {
  readonly id: number;
  readonly name: string;
  readonly ptvIds: readonly number[];
  readonly route: LineRoute;
  readonly lineType: LineType;
  readonly group: LineGroup;

  constructor({
    id,
    name,
    ptvIds,
    route,
    lineType,
    group,
  }: {
    id: number;
    name: string;
    ptvIds: readonly number[];
    route: LineRoute;
    lineType: LineType;
    group: LineGroup;
  }) {
    this.id = id;
    this.name = name;
    this.ptvIds = ptvIds;
    this.route = route;
    this.lineType = lineType;
    this.group = group;
  }

  getNodes() {
    return this.group.getNodesOnLine(this.id);
  }

  isValidSection(section: LineSection) {
    const nodes = this.getNodes();
    return nodes.includes(section.a) && nodes.includes(section.b);
  }

  getStations() {
    return this.group.getStationsOnLine(this.id);
  }
}
