import { flexi } from "@/frontend/components/map/renderer/dimensions/flexi-length";
import { interchangeEdgeOffset } from "@/server/services/map-geometry/utils";
import {
  defaultRadius,
  diagonal,
  lineGap,
  long45,
  short45,
} from "@/server/entry-point/data/map-geometry/utils";

export const richmondToSouthYarra = flexi(20, 20);
export const southYarraToCaulfield = flexi(30, 60);
export const caulfieldToClayton = flexi(30, 60);
export const claytonToDandenong = flexi(30, 60);
export const dandenongToHallamCurve = flexi(20);
export const hallamToPakenham = flexi(30, 80);
export const pakenhamToEastPakenham = flexi(15, 20);

export const hallamCurvePakenham = defaultRadius;
export const hallamCurveGippland = hallamCurvePakenham.plus(lineGap);

export const newmarketStraight = flexi(40);
export const newmarketCurveCraigieburn = defaultRadius;
export const newmarketCurveSeymour = newmarketCurveCraigieburn.plus(lineGap);
export const broadmeadowsStraight = flexi(40, 80);
export const craigieburnStraight = flexi(25, 50);

export const tottenhamStraight = flexi(30, 60);
export const sunshineJunctionDiagonal = flexi(0);
export const sunshineExitDiagonal = flexi(5);
export const sunshineCurvesSunbury = defaultRadius;
export const sunshineCurvesBendigo = sunshineCurvesSunbury.plus(lineGap);
export const sunshineJunctionStraight = sunshineCurvesSunbury
  .times(long45)
  .plus(sunshineJunctionDiagonal.times(diagonal))
  .plus(lineGap)
  .plus(sunshineCurvesSunbury.times(short45))
  .plus(sunshineJunctionDiagonal.times(diagonal))
  .minus(interchangeEdgeOffset);
export const deerParkStraight = flexi(50, 60).minus(sunshineJunctionStraight);
export const watergardensStraight = flexi(25, 50);
export const sunburyStraight = flexi(20, 30);
