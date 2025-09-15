import { LineGroup } from "@/server/data/line-group/line-group";
import { LineGroupEdge } from "@/server/data/line-group/line-group-edge";
import { MapSegment } from "@/server/data/map-segment";

export class MappingData {
  constructor(
    // TODO: Or should it be some sort of group ID?
    readonly lineGroup: LineGroup,

    readonly data: readonly {
      edge: LineGroupEdge;
      segments: readonly MapSegment[];
    }[],
  ) {}
}
