import { nonNull, parseFloatNull } from "@dan-schel/js-utils";

export class FlexiLength {
  // Note: "min" == the compressed length, "max" == the stretched length. In
  // some rare cases, "max" may be less than "min"!
  constructor(
    readonly min: number,
    readonly max: number,
  ) {}

  amplify(amplification: number) {
    return this.min + (this.max - this.min) * amplification;
  }

  plus(other: FlexiLength): FlexiLength {
    return new FlexiLength(this.min + other.min, this.max + other.max);
  }

  minus(other: FlexiLength): FlexiLength {
    return new FlexiLength(this.min - other.min, this.max - other.max);
  }

  times(factor: number): FlexiLength {
    return new FlexiLength(this.min * factor, this.max * factor);
  }

  divide(factor: number): FlexiLength {
    return new FlexiLength(this.min / factor, this.max / factor);
  }

  toString() {
    const min = this.min.toFixed(2);
    const max = this.max.toFixed(2);
    return `${min} ${max}`;
  }

  static fromString(s: string) {
    const parsed = s
      .split(" ")
      .map((n) => parseFloatNull(n))
      .filter(nonNull);

    if (parsed.length !== 2) {
      return null;
    }

    return new FlexiLength(parsed[0], parsed[1]);
  }
}

export function flexi(min: number, max?: number) {
  return new FlexiLength(min, max ?? min);
}
