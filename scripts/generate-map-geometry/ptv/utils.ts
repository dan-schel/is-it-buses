import {
  flexi,
  FlexiLength,
} from "@/frontend/components/map/renderer/dimensions/flexi-length";

export const lineGap = flexi(5);
export const long45 = Math.cos(Math.PI / 4);
export const short45 = 1 - long45;
export const diagonal = 1 / Math.sqrt(2);
export const defaultRadius = flexi(15);
export const standardDiagonal = flexi(5, 15);

export const east = 0;
export const southEast = 45;
export const south = 90;
/** @knipignore */
export const southWest = 135;
export const west = 180;
export const northWest = 225;
export const north = 270;
/** @knipignore */
export const northEast = 315;

export function measure45CurveLockedDiagonal(
  longLength: FlexiLength,
  shortLength: FlexiLength,
  diagonalLength: FlexiLength,
): { straightLength: FlexiLength; radius: FlexiLength } {
  const radius = shortLength
    .minus(diagonalLength.times(diagonal))
    .divide(short45);

  const straightLength = longLength
    .minus(radius.times(long45))
    .minus(diagonalLength.times(diagonal));

  return { straightLength, radius };
}

export function measure45CurveLockedStraight(
  longLength: FlexiLength,
  shortLength: FlexiLength,
  straightLength: FlexiLength,
): { diagonalLength: FlexiLength; radius: FlexiLength } {
  const radius = longLength
    .minus(shortLength)
    .minus(straightLength)
    .divide(long45 - short45);

  const diagonalLength = shortLength
    .minus(radius.times(short45))
    .divide(diagonal);

  return { diagonalLength, radius };
}

export function measure45CurveLockedRadius(
  longLength: FlexiLength,
  shortLength: FlexiLength,
  radius: FlexiLength,
): { straightLength: FlexiLength; diagonalLength: FlexiLength } {
  const diagonalLength = shortLength
    .minus(radius.times(short45))
    .divide(diagonal);

  const straightLength = longLength
    .minus(radius.times(long45))
    .minus(diagonalLength.times(diagonal));

  return { diagonalLength, straightLength };
}
