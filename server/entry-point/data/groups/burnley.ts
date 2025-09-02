import * as stations from "@/shared/station-ids";
import * as lines from "@/shared/line-ids";
import { LineGroupBuilder } from "@/server/data/line-group/line-group-builder";

export const burnley = new LineGroupBuilder()
  .add("the-city")
  .add(stations.RICHMOND)
  .add(stations.EAST_RICHMOND)
  .add(stations.BURNLEY)

  // Glen Waverley line
  .split()
  .add(stations.HEYINGTON)
  .add(stations.KOOYONG)
  .add(stations.TOORONGA)
  .add(stations.GARDINER)
  .add(stations.GLEN_IRIS)
  .add(stations.DARLING)
  .add(stations.EAST_MALVERN)
  .add(stations.HOLMESGLEN)
  .add(stations.JORDANVILLE)
  .add(stations.MOUNT_WAVERLEY)
  .add(stations.SYNDAL)
  .add(stations.GLEN_WAVERLEY)
  .terminate(lines.GLEN_WAVERLEY)

  .add(stations.HAWTHORN)
  .add(stations.GLENFERRIE)
  .add(stations.AUBURN)
  .add(stations.CAMBERWELL)

  // Alamein line
  .split()
  .add(stations.RIVERSDALE)
  .add(stations.WILLISON)
  .add(stations.HARTWELL)
  .add(stations.BURWOOD)
  .add(stations.ASHBURTON)
  .add(stations.ALAMEIN)
  .terminate(lines.ALAMEIN)

  .add(stations.EAST_CAMBERWELL)
  .add(stations.CANTERBURY)
  .add(stations.CHATHAM)
  .add(stations.UNION)
  .add(stations.BOX_HILL)
  .add(stations.LABURNUM)
  .add(stations.BLACKBURN)
  .add(stations.NUNAWADING)
  .add(stations.MITCHAM)
  .add(stations.HEATHERDALE)
  .add(stations.RINGWOOD)

  // Lilydale line
  .split()
  .add(stations.RINGWOOD_EAST)
  .add(stations.CROYDON)
  .add(stations.MOOROOLBARK)
  .add(stations.LILYDALE)
  .terminate(lines.LILYDALE)

  // Belgrave line
  .add(stations.HEATHMONT)
  .add(stations.BAYSWATER)
  .add(stations.BORONIA)
  .add(stations.FERNTREE_GULLY)
  .add(stations.UPPER_FERNTREE_GULLY)
  .add(stations.UPWEY)
  .add(stations.TECOMA)
  .add(stations.BELGRAVE)
  .terminate(lines.BELGRAVE)

  .build();
