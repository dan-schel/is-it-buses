import { MapCorridor } from "@/server/data/map/map-point";
import {
  BURNLEY,
  CLIFTON_HILL,
  DANDENONG,
  FRANKSTON,
  GIPPSLAND,
  NEWPORT,
  NORTHERN,
  REGIONAL_WESTERN,
  SANDRINGHAM,
  STONY_POINT,
} from "@/shared/map-node-ids";

export const southYarraToCaulfield = MapCorridor.complex(
  DANDENONG.SOUTH_YARRA,
  DANDENONG.CAULFIELD,
  FRANKSTON.SOUTH_YARRA,
  FRANKSTON.CAULFIELD,
);

export const caulfieldToClayton = MapCorridor.complex(
  DANDENONG.CAULFIELD,
  DANDENONG.CLAYTON,
  GIPPSLAND.CAULFIELD,
  GIPPSLAND.CLAYTON,
);

export const claytonToDandenong = MapCorridor.complex(
  DANDENONG.CLAYTON,
  DANDENONG.DANDENONG,
  GIPPSLAND.CLAYTON,
  GIPPSLAND.DANDENONG,
);

export const dandenongToPakenham = MapCorridor.complex(
  DANDENONG.DANDENONG,
  DANDENONG.PAKENHAM,
  GIPPSLAND.DANDENONG,
  GIPPSLAND.PAKENHAM,
);

export const dandenongToCranbourne = MapCorridor.single(
  DANDENONG.DANDENONG,
  DANDENONG.CRANBOURNE,
);

export const eastPakenhamToBairnsdale = MapCorridor.single(
  GIPPSLAND.EAST_PAKENHAM,
  GIPPSLAND.BAIRNSDALE,
);

export const caulfieldToFrankston = MapCorridor.single(
  FRANKSTON.CAULFIELD,
  FRANKSTON.FRANKSTON,
);

export const frankstonToStonyPoint = MapCorridor.single(
  STONY_POINT.FRANKSTON,
  STONY_POINT.STONY_POINT,
);

export const southYarraToSandringham = MapCorridor.single(
  SANDRINGHAM.SOUTH_YARRA,
  SANDRINGHAM.SANDRINGHAM,
);

export const richmondToBurnley = MapCorridor.single(
  BURNLEY.RICHMOND,
  BURNLEY.BURNLEY,
);

export const burnleyToGlenWaverley = MapCorridor.single(
  BURNLEY.BURNLEY,
  BURNLEY.GLEN_WAVERLEY,
);

export const burnleyToCamberwell = MapCorridor.single(
  BURNLEY.BURNLEY,
  BURNLEY.CAMBERWELL,
);

export const camberwellToAlamein = MapCorridor.single(
  BURNLEY.CAMBERWELL,
  BURNLEY.ALAMEIN,
);

export const camberwellToRingwood = MapCorridor.single(
  BURNLEY.CAMBERWELL,
  BURNLEY.RINGWOOD,
);

export const ringwoodToBelgrave = MapCorridor.single(
  BURNLEY.RINGWOOD,
  BURNLEY.BELGRAVE,
);

export const ringwoodToLilydale = MapCorridor.single(
  BURNLEY.RINGWOOD,
  BURNLEY.LILYDALE,
);

export const jolimontToCliftonHill = MapCorridor.single(
  CLIFTON_HILL.JOLIMONT,
  CLIFTON_HILL.CLIFTON_HILL,
);

export const cliftonHillToMernda = MapCorridor.single(
  CLIFTON_HILL.CLIFTON_HILL,
  CLIFTON_HILL.MERNDA,
);

export const cliftonHillToHurstbridge = MapCorridor.single(
  CLIFTON_HILL.CLIFTON_HILL,
  CLIFTON_HILL.HURSTBRIDGE,
);

export const northMelbourneToUpfield = MapCorridor.single(
  NORTHERN.NORTH_MELBOURNE,
  NORTHERN.UPFIELD,
);

export const northMelbourneToBroadmeadows = MapCorridor.complex(
  NORTHERN.NORTH_MELBOURNE,
  NORTHERN.BROADMEADOWS,
  REGIONAL_WESTERN.NORTH_MELBOURNE_SEYMOUR,
  REGIONAL_WESTERN.BROADMEADOWS,
);

export const broadmeadowsToCraigieburn = MapCorridor.complex(
  NORTHERN.BROADMEADOWS,
  NORTHERN.CRAIGIEBURN,
  REGIONAL_WESTERN.BROADMEADOWS,
  REGIONAL_WESTERN.CRAIGIEBURN,
);

export const craigieburnToSeymour = MapCorridor.single(
  REGIONAL_WESTERN.CRAIGIEBURN,
  REGIONAL_WESTERN.SEYMOUR,
);

export const seymourToShepparton = MapCorridor.single(
  REGIONAL_WESTERN.SEYMOUR,
  REGIONAL_WESTERN.SHEPPARTON,
);

export const seymourToAlbury = MapCorridor.single(
  REGIONAL_WESTERN.SEYMOUR,
  REGIONAL_WESTERN.ALBURY,
);

export const northMelbourneToFootscray = MapCorridor.complex(
  NORTHERN.NORTH_MELBOURNE,
  NORTHERN.FOOTSCRAY,
  NEWPORT.NORTH_MELBOURNE,
  NEWPORT.FOOTSCRAY,
);

export const footscrayToNewport = MapCorridor.single(
  NEWPORT.FOOTSCRAY,
  NEWPORT.NEWPORT,
);

export const newportToWilliamstown = MapCorridor.single(
  NEWPORT.NEWPORT,
  NEWPORT.WILLIAMSTOWN,
);

export const newportToLavertonLoop = MapCorridor.single(
  NEWPORT.NEWPORT,
  NEWPORT.LAVERTON_LOOP,
);

export const lavertonToWerribee = MapCorridor.single(
  NEWPORT.LAVERTON_LOOP,
  NEWPORT.WERRIBEE,
);

export const footscrayToSunshineJunction = MapCorridor.complex(
  NORTHERN.FOOTSCRAY,
  NORTHERN.SUNSHINE_JUNCTION,
  REGIONAL_WESTERN.FOOTSCRAY,
  REGIONAL_WESTERN.SUNSHINE_JUNCTION,
);

export const sunshineToWatergardens = MapCorridor.complex(
  NORTHERN.SUNSHINE,
  NORTHERN.WATERGARDENS,
  REGIONAL_WESTERN.SUNSHINE_BENDIGO,
  REGIONAL_WESTERN.WATERGARDENS,
);

export const watergardensToSunbury = MapCorridor.complex(
  NORTHERN.WATERGARDENS,
  NORTHERN.SUNBURY,
  REGIONAL_WESTERN.WATERGARDENS,
  REGIONAL_WESTERN.SUNBURY,
);

export const sunburyToBendigo = MapCorridor.single(
  REGIONAL_WESTERN.SUNBURY,
  REGIONAL_WESTERN.BENDIGO,
);

export const bendigoToEchuca = MapCorridor.single(
  REGIONAL_WESTERN.BENDIGO,
  REGIONAL_WESTERN.ECHUCA,
);

export const bendigoToSwanHill = MapCorridor.single(
  REGIONAL_WESTERN.BENDIGO,
  REGIONAL_WESTERN.SWAN_HILL,
);

export const sunshineToDeerPark = MapCorridor.single(
  REGIONAL_WESTERN.SUNSHINE_DEER_PARK,
  REGIONAL_WESTERN.DEER_PARK,
);

export const deerParkToBallarat = MapCorridor.single(
  REGIONAL_WESTERN.DEER_PARK,
  REGIONAL_WESTERN.BALLARAT,
);

export const ballaratToArarat = MapCorridor.single(
  REGIONAL_WESTERN.BALLARAT,
  REGIONAL_WESTERN.ARARAT,
);

export const ballaratToMaryborough = MapCorridor.single(
  REGIONAL_WESTERN.BALLARAT,
  REGIONAL_WESTERN.MARYBOROUGH,
);

export const deerParkToWarrnambool = MapCorridor.single(
  REGIONAL_WESTERN.DEER_PARK,
  REGIONAL_WESTERN.WARRNAMBOOL,
);
