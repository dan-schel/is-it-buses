// TODO: This is kinda duplicating what's in @/server/data/utils/range.ts. I
// think in the long term, a lot more of the map-related code can be moved to
// the server. That means the <Map> receives it's geometry from the server, pre-
// colored, and just spits it out onto the canvas.

// Floating point fudge factor! (Numbers this close are considered equal.)
export const fpff = 0.000001;

// The name Range is taken. As a class it's ok, but as a type I get an error! :(
type RangeObj = { min: number; max: number };

export function condense(ranges: RangeObj[]): RangeObj[] {
  if (ranges.length < 2) return ranges;

  const sortedRanges = ranges.sort((a, b) => a.min - b.min);

  const condensed: RangeObj[] = [];
  let min = sortedRanges[0].min;
  let max = sortedRanges[0].max;

  for (let i = 1; i < sortedRanges.length; i++) {
    const range = sortedRanges[i];

    if (max < range.min - fpff) {
      // If this range is not overlapping the current range, then this must be
      // the start of a new separate section.
      condensed.push({ min, max });
      min = range.min;
      max = range.max;
    } else if (range.max > max) {
      // Otherwise, if it IS overlapping, and this range pushes the max out
      // further, update the max.
      max = range.max;
    }
  }

  condensed.push({ min, max });
  return condensed;
}

export function includes(range: RangeObj, value: number): boolean {
  return range.min <= value + fpff && value - fpff <= range.max;
}

function subtract(ranges: RangeObj[], subtraction: RangeObj): RangeObj[] {
  const result: RangeObj[] = [];

  for (const range of ranges) {
    if (range.min > subtraction.max || range.max < subtraction.min) {
      // No overlap
      result.push(range);
    } else {
      // Overlap
      if (range.min < subtraction.min) {
        result.push({ min: range.min, max: subtraction.min });
      }
      if (range.max > subtraction.max) {
        result.push({ min: subtraction.max, max: range.max });
      }
    }
  }

  return result;
}

export function subtractAll(ranges: RangeObj[], subtractions: RangeObj[]) {
  let result = ranges;
  for (const subtraction of subtractions) {
    result = subtract(result, subtraction);
  }
  return result;
}
