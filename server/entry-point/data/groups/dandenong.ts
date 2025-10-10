import * as station from "@/shared/station-ids";
import * as line from "@/shared/line-ids";
import { LineGroupBuilder } from "@/server/data/line-group/line-group-builder";
import {
  cityLoopOverride,
  metroTunnelStations,
} from "@/server/entry-point/data/station-mapping-overrides";
import { config } from "@/server/entry-point/config";

const withoutMetroTunnel = new LineGroupBuilder()
  .add("the-city")
  .add(station.RICHMOND)
  .add(station.SOUTH_YARRA)
  .do(addCaulfieldToPakenhamAndCranbourne)
  .build([cityLoopOverride]);

const hybrid = new LineGroupBuilder()
  .add("the-city")
  .do(addCaulfieldToPakenhamAndCranbourne)
  .build([
    {
      node: "the-city",
      stations: [
        ...cityLoopOverride.stations,
        ...metroTunnelStations,
        station.RICHMOND,
        station.SOUTH_YARRA,
      ],
    },
  ]);

const withoutCityLoop = new LineGroupBuilder()
  .add(station.TOWN_HALL)
  .add(station.ANZAC)
  .do(addCaulfieldToPakenhamAndCranbourne)
  .build([]);

export const group = {
  "not-open": withoutMetroTunnel,
  hybrid: hybrid,
  "fully-open": withoutCityLoop,
}[config.METRO_TUNNEL_STATE];

function addCaulfieldToPakenhamAndCranbourne(builder: LineGroupBuilder) {
  return (
    builder
      .add(station.CAULFIELD)
      .add(station.CARNEGIE)
      .add(station.MURRUMBEENA)
      .add(station.HUGHESDALE)
      .add(station.OAKLEIGH)
      .add(station.HUNTINGDALE)
      .add(station.CLAYTON)
      .add(station.WESTALL)
      .add(station.SPRINGVALE)
      .add(station.SANDOWN_PARK)
      .add(station.NOBLE_PARK)
      .add(station.YARRAMAN)
      .add(station.DANDENONG)

      // Cranbourne line
      .split()
      .add(station.LYNBROOK)
      .add(station.MERINDA_PARK)
      .add(station.CRANBOURNE)
      .terminate(line.CRANBOURNE)

      // Pakenham line
      .add(station.HALLAM)
      .add(station.NARRE_WARREN)
      .add(station.BERWICK)
      .add(station.BEACONSFIELD)
      .add(station.OFFICER)
      .add(station.CARDINIA_ROAD)
      .add(station.PAKENHAM)
      .add(station.EAST_PAKENHAM)
      .terminate(line.PAKENHAM)
  );
}
