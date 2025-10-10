import * as station from "@/shared/station-ids";
import * as line from "@/shared/line-ids";
import { LineGroupBuilder } from "@/server/data/line-group/line-group-builder";
import { cityLoopOverride } from "@/server/entry-point/data/station-mapping-overrides";
import {
  addFootscrayToSunbury,
  sunburyIsSeparateGroup,
} from "@/server/entry-point/data/groups/sunbury";

export const group = new LineGroupBuilder()
  .add("the-city")
  .add(station.NORTH_MELBOURNE)

  // Upfield line
  .split()
  .add(station.MACAULAY)
  .add(station.FLEMINGTON_BRIDGE)
  .add(station.ROYAL_PARK)
  .add(station.JEWELL)
  .add(station.BRUNSWICK)
  .add(station.ANSTEY)
  .add(station.MORELAND)
  .add(station.COBURG)
  .add(station.BATMAN)
  .add(station.MERLYNSTON)
  .add(station.FAWKNER)
  .add(station.GOWRIE)
  .add(station.UPFIELD)
  .terminate(line.UPFIELD)

  // Craigieburn line
  .do(splitIfSunburyLineIncluded)
  .add(station.KENSINGTON)
  .add(station.NEWMARKET)
  .add(station.ASCOT_VALE)
  .add(station.MOONEE_PONDS)
  .add(station.ESSENDON)
  .add(station.GLENBERVIE)
  .add(station.STRATHMORE)
  .add(station.PASCOE_VALE)
  .add(station.OAK_PARK)
  .add(station.GLENROY)
  .add(station.JACANA)
  .add(station.BROADMEADOWS)
  .add(station.COOLAROO)
  .add(station.ROXBURGH_PARK)
  .add(station.CRAIGIEBURN)
  .terminate(line.CRAIGIEBURN)

  // Sunbury line
  .do(addFootscrayToSunburyIfIncluded)

  .build([cityLoopOverride]);

function splitIfSunburyLineIncluded(builder: LineGroupBuilder) {
  return !sunburyIsSeparateGroup ? builder.split() : builder;
}

function addFootscrayToSunburyIfIncluded(builder: LineGroupBuilder) {
  return !sunburyIsSeparateGroup ? addFootscrayToSunbury(builder) : builder;
}
