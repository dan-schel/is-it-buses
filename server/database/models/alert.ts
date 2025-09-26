import { z } from "zod";
import { Alert, alertStateJson } from "@/server/data/alert/alert";
import { DatabaseModel } from "@dan-schel/db";
import { AlertData } from "@/server/data/alert/alert-data";

export class AlertModel extends DatabaseModel<
  Alert,
  string,
  z.input<typeof AlertModel._schema>
> {
  static instance = new AlertModel();

  private static _schema = z.object({
    state: alertStateJson,
    data: AlertData.bson,
    updatedData: AlertData.bson.nullable(),
    appearedAt: z.date(),
    processedAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
    deleteAt: z.date().nullable(),
  });

  private constructor() {
    super("alerts");
  }

  getId(item: Alert): string {
    return item.id;
  }

  serialize(item: Alert): z.input<typeof AlertModel._schema> {
    return {
      state: item.state,
      data: item.data.toBson(),
      updatedData: item.updatedData?.toBson() ?? null,
      appearedAt: item.appearedAt,
      processedAt: item.processedAt,
      updatedAt: item.updatedAt,
      deleteAt: item.deleteAt,
    };
  }

  deserialize(id: string, item: unknown): Alert {
    const parsed = AlertModel._schema.parse(item);
    return new Alert(
      id,
      parsed.state,
      parsed.data,
      parsed.updatedData,
      parsed.appearedAt,
      parsed.processedAt,
      parsed.updatedAt,
      parsed.deleteAt,
    );
  }
}
