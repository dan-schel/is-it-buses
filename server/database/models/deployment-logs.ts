import { DatabaseModel } from "@dan-schel/db";
import { z } from "zod";

export class DeploymentLog {
  constructor(
    readonly id: string,
    readonly commitHash: string,
    readonly createdAt: Date,
  ) {}
}

export class DeploymentLogModel extends DatabaseModel<
  DeploymentLog,
  string,
  z.input<typeof DeploymentLogModel._schema>
> {
  static instance = new DeploymentLogModel();

  private static _schema = z.object({
    commitHash: z.string(),
    createdAt: z.date(),
  });

  private constructor() {
    super("deployment-logs");
  }

  getId(item: DeploymentLog): string {
    return item.id;
  }

  serialize(item: DeploymentLog): { commitHash: string; createdAt: Date } {
    return {
      commitHash: item.commitHash,
      createdAt: item.createdAt,
    };
  }

  deserialize(id: string, item: unknown): DeploymentLog {
    const parsed = DeploymentLogModel._schema.parse(item);
    return new DeploymentLog(id, parsed.commitHash, parsed.createdAt);
  }
}
