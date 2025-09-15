import { LineGroup } from "@/server/data/line-group/line-group";
import { LineSection } from "@/server/data/line-section";
import { LineRoute } from "@/server/data/line/line-routes/line-route";

type LineType = "suburban" | "regional";

export class Line {
  readonly id: number;
  readonly name: string;
  readonly ptvIds: readonly number[];
  readonly route: LineRoute; // TODO: [DS] Current mission - Remove this.
  readonly lineType: LineType;
  private readonly _group: LineGroup;

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
    this._group = group;
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
}
