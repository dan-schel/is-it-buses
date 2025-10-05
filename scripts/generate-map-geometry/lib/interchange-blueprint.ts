type RelativePosition =
  | "left-edge"
  | "left-inner"
  | "right-inner"
  | "right-edge";

export type NodeWithRelativePosition = {
  readonly nodeId: number;
  readonly position: RelativePosition;
};

export class InterchangeBlueprint {
  constructor(
    readonly station: number,
    readonly nodeIds: number[],
    readonly thickLines: NodeWithRelativePosition[][],
    readonly thinLine: NodeWithRelativePosition[] | null,
  ) {
    const noThickLines = thickLines.length === 0;
    const thickLinesInvalid = thickLines.some((l) => l.length < 2);
    const thinLineInvalid = thinLine != null && thinLine.length < 2;
    const invalidNodeIds =
      thickLines.some((l) => l.some((p) => !nodeIds.includes(p.nodeId))) ||
      (thinLine != null && thinLine.some((p) => !nodeIds.includes(p.nodeId)));

    if (
      noThickLines ||
      thickLinesInvalid ||
      thinLineInvalid ||
      invalidNodeIds
    ) {
      throw new Error("Invalid interchange blueprint.");
    }
  }

  static single(station: number, nodeId: number): InterchangeBlueprint {
    return new InterchangeBlueprint(
      station,
      [nodeId],
      [
        [
          { nodeId, position: "left-edge" },
          { nodeId, position: "right-edge" },
        ],
      ],
      null,
    );
  }

  static simple(
    station: number,
    nodeIds: number[],
    startNodeId: number,
    startEdge: RelativePosition,
    endNodeId: number,
    endEdge: RelativePosition,
  ): InterchangeBlueprint {
    return new InterchangeBlueprint(
      station,
      nodeIds,
      [
        [
          { nodeId: startNodeId, position: startEdge },
          { nodeId: endNodeId, position: endEdge },
        ],
      ],
      null,
    );
  }
}
