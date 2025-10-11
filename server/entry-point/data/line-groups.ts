import * as group from "@/server/entry-point/data/groups";
import { LineGroupCollection } from "@/server/data/line-group/line-group-collection";
import { nonNull } from "@dan-schel/js-utils";

export const lineGroups = new LineGroupCollection(
  Object.values(group).filter(nonNull),
);
