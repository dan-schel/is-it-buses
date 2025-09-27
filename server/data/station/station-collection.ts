import { Collection } from "@/server/data/collection";
import { Station } from "@/server/data/station/station";

export class StationCollection extends Collection<number, Station> {
  private _ptvMap: Map<number, Station>;

  constructor(data: Station[]) {
    super(data);

    // Implement a map for PTV IDs, since this query will probably happen a lot.
    this._ptvMap = new Map(
      data.flatMap((station) =>
        station.ptvIds.map((ptvId) => [ptvId, station]),
      ),
    );
  }

  findByName(name: string): Station | null {
    return this.first((station) => station.name === name);
  }

  requireByName(name: string): Station {
    const station = this.findByName(name);
    if (station === null) {
      throw new Error(`No station with name "${name}".`);
    }
    return station;
  }

  findByPtvId(ptvId: number): Station | null {
    return this._ptvMap.get(ptvId) ?? null;
  }

  requireByPtvId(ptvId: number): Station {
    const station = this.findByPtvId(ptvId);
    if (station === null) {
      throw new Error(`No station with PTV ID "${ptvId}".`);
    }
    return station;
  }

  protected _getID(item: Station): number {
    return item.id;
  }

  protected _getRequireFailError(id: number): Error {
    return new Error(`No station with ID "${id}".`);
  }

  protected _getPredicateFailError(): Error {
    return new Error("No matching station.");
  }
}
