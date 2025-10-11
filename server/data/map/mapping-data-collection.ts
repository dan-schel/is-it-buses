import { MappingData } from "@/server/data/map/mapping-data";

export class MappingDataCollection {
  private readonly _mappingDataByGroupId: Map<number, MappingData>;

  constructor(mappingData: MappingData[]) {
    this._mappingDataByGroupId = new Map(
      mappingData.map((x) => [x.groupId, x]),
    );
  }

  getForGroup(groupId: number) {
    return this._mappingDataByGroupId.get(groupId) ?? null;
  }
}
