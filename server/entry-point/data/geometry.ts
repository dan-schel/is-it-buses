import { Geometry } from "@/frontend/components/map/renderer/geometry";
import { GeometryBuilder } from "@/server/services/map-geometry/geometry-builder";
import { burnley } from "@/server/entry-point/data/map-geometry/lines/burnley";
import { cliftonHill } from "@/server/entry-point/data/map-geometry/lines/clifton-hill";
import { dandenong } from "@/server/entry-point/data/map-geometry/lines/dandenong";
import { frankston } from "@/server/entry-point/data/map-geometry/lines/frankston";
import { gippsland } from "@/server/entry-point/data/map-geometry/lines/gippsland";
import { newport } from "@/server/entry-point/data/map-geometry/lines/newport";
import { northern } from "@/server/entry-point/data/map-geometry/lines/northern";
import { regionalWestern } from "@/server/entry-point/data/map-geometry/lines/regional-western";
import { sandringham } from "@/server/entry-point/data/map-geometry/lines/sandringham";
import { stonyPoint } from "@/server/entry-point/data/map-geometry/lines/stony-point";
import * as interchange from "@/server/entry-point/data/map-geometry/interchanges";
import {
  BURNLEY,
  CLIFTON_HILL,
  DANDENONG,
  GIPPSLAND,
  NEWPORT,
  NORTHERN,
  REGIONAL_WESTERN,
  SANDRINGHAM,
  STONY_POINT,
} from "@/shared/map-node-ids";

/**
 * Generates the PTV map geometry.
 * This is called once when the server starts up.
 */
export function generatePtvGeometry(): Geometry {
  return new GeometryBuilder().build(
    [
      // In render (z-index) order.
      gippsland,
      regionalWestern,
      cliftonHill,
      dandenong,
      burnley,
      northern,
      newport,
      frankston,
      sandringham,
      stonyPoint,
    ],
    [
      interchange.flindersStreet,
      interchange.southernCross,
      interchange.flagstaff,
      interchange.melbourneCentral,
      interchange.parliament,
      interchange.richmond,
      interchange.northMelbourne,
      interchange.cliftonHill,
      interchange.burnley,
      interchange.camberwell,
      interchange.ringwood,
      interchange.southYarra,
      interchange.caulfield,
      interchange.clayton,
      interchange.dandenong,
      interchange.pakenham,
      interchange.footscray,
      interchange.frankston,
      interchange.broadmeadows,
      interchange.craigieburn,
      interchange.seymour,
      interchange.newport,
      interchange.laverton,
      interchange.sunshine,
      interchange.watergardens,
      interchange.sunbury,
      interchange.bendigo,
      interchange.ballarat,
      interchange.deerPark,
    ],
    [
      BURNLEY.GLEN_WAVERLEY,
      BURNLEY.ALAMEIN,
      BURNLEY.BELGRAVE,
      BURNLEY.LILYDALE,
      CLIFTON_HILL.HURSTBRIDGE,
      CLIFTON_HILL.MERNDA,
      DANDENONG.CRANBOURNE,
      DANDENONG.EAST_PAKENHAM,
      GIPPSLAND.BAIRNSDALE,
      NEWPORT.WILLIAMSTOWN,
      NEWPORT.WERRIBEE,
      NORTHERN.UPFIELD,
      REGIONAL_WESTERN.SHEPPARTON,
      REGIONAL_WESTERN.ALBURY,
      REGIONAL_WESTERN.ECHUCA,
      REGIONAL_WESTERN.SWAN_HILL,
      REGIONAL_WESTERN.WARRNAMBOOL,
      REGIONAL_WESTERN.ARARAT,
      REGIONAL_WESTERN.MARYBOROUGH,
      SANDRINGHAM.SANDRINGHAM,
      STONY_POINT.STONY_POINT,
    ],
  );
}
