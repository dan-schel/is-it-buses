export class Point {
  constructor(
    readonly x: number,
    readonly y: number,
  ) {}

  move(length: number, angle: number) {
    return new Point(
      this.x + length * Math.cos(rad(angle)),
      this.y + length * Math.sin(rad(angle)),
    );
  }
}

function rad(deg: number) {
  return deg * (Math.PI / 180);
}
