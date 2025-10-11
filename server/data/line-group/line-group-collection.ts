import { Collection } from "@/server/data/collection";
import { LineGroup } from "@/server/data/line-group/line-group";

export class LineGroupCollection extends Collection<number, LineGroup> {
  protected _getID(item: LineGroup): number {
    return item.id;
  }

  protected _getRequireFailError(id: number): Error {
    return new Error(`No line group with ID "${id}".`);
  }

  protected _getPredicateFailError(): Error {
    return new Error("No matching line group.");
  }
}
