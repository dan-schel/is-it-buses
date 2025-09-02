import { LineRoute } from "@/server/data/line/line-routes/line-route";

// TODO: Rename this. LineCategory? LineMode?
type LineGroup = "suburban" | "regional";

// TODO: Redefine a line as one (or more - in the case of branching regional
// lines) branches of a LineGroup, i.e. we shouldn't have to list out all the
// stations twice.
export class Line {
  readonly id: number;
  readonly name: string;
  readonly ptvIds: readonly number[];
  readonly route: LineRoute;
  readonly lineGroup: LineGroup;

  constructor({
    id,
    name,
    ptvIds,
    route,
    lineGroup,
  }: {
    id: number;
    name: string;
    ptvIds: readonly number[];
    route: LineRoute;
    lineGroup: LineGroup;
  }) {
    this.id = id;
    this.name = name;
    this.ptvIds = ptvIds;
    this.route = route;
    this.lineGroup = lineGroup;
  }
}
