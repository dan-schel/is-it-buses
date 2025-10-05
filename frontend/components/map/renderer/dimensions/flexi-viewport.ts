import { z } from "zod";

export class Viewport {
  constructor(
    readonly x: number,
    readonly y: number,
    readonly w: number,
    readonly h: number,
  ) {}

  static readonly json = z
    .object({
      x: z.number(),
      y: z.number(),
      h: z.number(),
      w: z.number(),
    })
    .transform((x) => new Viewport(x.x, x.y, x.w, x.h));

  toJSON(): z.input<typeof Viewport.json> {
    return {
      x: this.x,
      y: this.y,
      w: this.w,
      h: this.h,
    };
  }
}

export class FlexiViewport {
  constructor(
    readonly min: Viewport,
    readonly max: Viewport,
  ) {}

  amplify(amplification: number) {
    return {
      x: this.min.x + (this.max.x - this.min.x) * amplification,
      y: this.min.y + (this.max.y - this.min.y) * amplification,
      w: this.min.w + (this.max.w - this.min.w) * amplification,
      h: this.min.h + (this.max.h - this.min.h) * amplification,
    };
  }

  static readonly json = z
    .object({
      min: Viewport.json,
      max: Viewport.json,
    })
    .transform((x) => new FlexiViewport(x.min, x.max));

  toJSON(): z.input<typeof FlexiViewport.json> {
    return {
      min: this.min,
      max: this.max,
    };
  }
}
