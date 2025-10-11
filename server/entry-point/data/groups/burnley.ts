import * as groupId from "@/shared/group-ids";
import * as station from "@/shared/station-ids";
import * as line from "@/shared/line-ids";
import { LineGroupBuilder } from "@/server/data/line-group/line-group-builder";
import { cityLoopOverride } from "@/server/entry-point/data/station-mapping-overrides";

export const group = new LineGroupBuilder(groupId.BURNLEY)
  .add("the-city")
  .add(station.RICHMOND)
  .add(station.EAST_RICHMOND)
  .add(station.BURNLEY)

  // Glen Waverley line
  .split()
  .add(station.HEYINGTON)
  .add(station.KOOYONG)
  .add(station.TOORONGA)
  .add(station.GARDINER)
  .add(station.GLEN_IRIS)
  .add(station.DARLING)
  .add(station.EAST_MALVERN)
  .add(station.HOLMESGLEN)
  .add(station.JORDANVILLE)
  .add(station.MOUNT_WAVERLEY)
  .add(station.SYNDAL)
  .add(station.GLEN_WAVERLEY)
  .terminate(line.GLEN_WAVERLEY)

  .add(station.HAWTHORN)
  .add(station.GLENFERRIE)
  .add(station.AUBURN)
  .add(station.CAMBERWELL)

  // Alamein line
  .split()
  .add(station.RIVERSDALE)
  .add(station.WILLISON)
  .add(station.HARTWELL)
  .add(station.BURWOOD)
  .add(station.ASHBURTON)
  .add(station.ALAMEIN)
  .terminate(line.ALAMEIN)

  .add(station.EAST_CAMBERWELL)
  .add(station.CANTERBURY)
  .add(station.CHATHAM)
  .add(station.UNION)
  .add(station.BOX_HILL)
  .add(station.LABURNUM)
  .add(station.BLACKBURN)
  .add(station.NUNAWADING)
  .add(station.MITCHAM)
  .add(station.HEATHERDALE)
  .add(station.RINGWOOD)

  // Lilydale line
  .split()
  .add(station.RINGWOOD_EAST)
  .add(station.CROYDON)
  .add(station.MOOROOLBARK)
  .add(station.LILYDALE)
  .terminate(line.LILYDALE)

  // Belgrave line
  .add(station.HEATHMONT)
  .add(station.BAYSWATER)
  .add(station.BORONIA)
  .add(station.FERNTREE_GULLY)
  .add(station.UPPER_FERNTREE_GULLY)
  .add(station.UPWEY)
  .add(station.TECOMA)
  .add(station.BELGRAVE)
  .terminate(line.BELGRAVE)

  .build([cityLoopOverride]);
