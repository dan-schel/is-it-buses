import { LineGroup } from "@/server/data/line-group/line-group";
import { LineShapeNode } from "@/server/data/line/line-routes/line-shape";

export class LineGroupBuilder {
  private _nodes: LineShapeNode[][] = [[]];
  private _lineIds: number[] = [];

  private get _workingIndex() {
    return this._nodes.length - this._lineIds.length - 1;
  }

  add(node: LineShapeNode) {
    if (this._workingIndex < 0) {
      throw new Error("Cannot add nodes - all branches have terminated.");
    }
    this._nodes[this._workingIndex].push(node);
    return this;
  }

  split() {
    this._nodes.push([...this._nodes[this._workingIndex]]);
    return this;
  }

  terminate(lineId: number) {
    if (this._workingIndex < 0) {
      throw new Error("Cannot add nodes - all branches have terminated.");
    }
    this._lineIds.push(lineId);
    return this;
  }

  build() {
    if (this._workingIndex > 0) {
      throw new Error("Cannot build - some branches have not terminated yet.");
    }

    return new LineGroup(this._nodes, this._lineIds);
  }
}
