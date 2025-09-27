import { Collection } from "@/server/data/collection";
import { Line } from "@/server/data/line/line";

export class LineCollection extends Collection<number, Line> {
  private _ptvMap: Map<number, Line>;

  constructor(data: Line[]) {
    super(data);

    // Implement a map for PTV IDs, since this query will probably happen a lot.
    this._ptvMap = new Map(
      data.flatMap((line) => line.ptvIds.map((ptvId) => [ptvId, line])),
    );
  }

  findByPtvId(ptvId: number): Line | null {
    return this._ptvMap.get(ptvId) ?? null;
  }

  requireByPtvId(ptvId: number): Line {
    const line = this.findByPtvId(ptvId);
    if (line === null) {
      throw new Error(`No line with PTV ID "${ptvId}".`);
    }
    return line;
  }

  whichStopAt(stationId: number): Line[] {
    return this.filter((line) => line.getStations().includes(stationId));
  }

  protected _getID(item: Line): number {
    return item.id;
  }

  protected _getRequireFailError(id: number): Error {
    return new Error(`No line with ID "${id}".`);
  }

  protected _getPredicateFailError(): Error {
    return new Error("No matching line.");
  }
}
