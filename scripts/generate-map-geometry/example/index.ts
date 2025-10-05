import { flexi } from "@/frontend/components/map/renderer/dimensions/flexi-length";
import { fp } from "@/frontend/components/map/renderer/dimensions/flexi-point";
import { InterchangeBlueprint } from "@/scripts/generate-map-geometry/lib/interchange-blueprint";
import { GeometryBuilder } from "@/scripts/generate-map-geometry/lib/geometry-builder";
import { LineBuilder } from "@/scripts/generate-map-geometry/lib/line-builder";
import {
  curve,
  straight,
} from "@/scripts/generate-map-geometry/lib/segment-instructions";

const node = {
  CYAN_1: 1,
  CYAN_2: 2,
  CYAN_3: 3,
  CYAN_4: 4,
  PURPLE_1: 5,
  PURPLE_2: 6,
  PURPLE_3: 7,
};

const interchange = InterchangeBlueprint.simple(
  1,
  [node.CYAN_2, node.PURPLE_2],
  node.CYAN_2,
  "left-edge",
  node.PURPLE_2,
  "right-edge",
);

const line1 = new LineBuilder(node.CYAN_1, fp([0, 0]), 0, "cyan")
  .to(node.CYAN_2, [straight(flexi(45, 90))])
  .split((s) =>
    s.to(node.CYAN_3, [
      straight(flexi(5)),
      curve(flexi(15), 45),
      straight(flexi(25, 50)),
    ]),
  )
  .to(node.CYAN_4, [
    straight(flexi(5)),
    curve(flexi(10), -45),
    straight(flexi(45, 90)),
  ]);

const line2 = new LineBuilder(node.PURPLE_1, fp([0, 5]), 0, "purple")
  .to(node.PURPLE_2, [straight(flexi(45, 90))])
  .to(node.PURPLE_3, [
    straight(flexi(5)),
    curve(flexi(10), 45),
    straight(flexi(45, 90)),
  ]);

const geometry = new GeometryBuilder().build(
  [line1, line2],
  [interchange],
  [node.CYAN_1, node.CYAN_3, node.CYAN_4, node.PURPLE_1, node.PURPLE_3],
);

export default geometry;
