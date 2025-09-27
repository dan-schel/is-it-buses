import { MapPoint } from "@/server/data/map/map-point";

export class Station {
  readonly id: number;
  readonly name: string;
  readonly ptvIds: readonly number[];

  readonly mapLocation: MapPoint | null;

  constructor({
    id,
    name,
    ptvIds,
    mapLocation,
  }: {
    id: number;
    name: string;
    ptvIds: readonly number[];
    mapLocation: MapPoint | null;
  }) {
    this.id = id;
    this.name = name;
    this.ptvIds = ptvIds;
    this.mapLocation = mapLocation ?? null;
  }
}
