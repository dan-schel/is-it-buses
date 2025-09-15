import { LineGroup } from "@/server/data/line-group/line-group";
import { LineGroupNode } from "@/server/data/line-group/line-group-node";

export class LineGroupBuilder {
  private _branches: LineGroupNode[][] = [[]];
  private _lineIds: number[] = [];

  private get _workingIndex() {
    return this._branches.length - this._lineIds.length - 1;
  }

  add(node: LineGroupNode) {
    if (this._workingIndex < 0) {
      throw new Error("Cannot add nodes - all branches have terminated.");
    }
    this._branches[this._workingIndex].push(node);
    return this;
  }

  split() {
    if (this._workingIndex < 0) {
      throw new Error("Cannot split - all branches have terminated.");
    }
    const copy = [...this._branches[this._workingIndex]];
    this._branches.splice(this._workingIndex, 0, copy);
    return this;
  }

  terminate(lineId: number) {
    if (this._workingIndex < 0) {
      throw new Error("Cannot add nodes - all branches have terminated.");
    }
    this._lineIds.unshift(lineId);
    return this;
  }

  build() {
    if (this._workingIndex > 0) {
      throw new Error("Cannot build - some branches have not terminated yet.");
    }

    return new LineGroup(this._branches, this._lineIds);
  }
}
