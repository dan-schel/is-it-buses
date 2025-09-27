import { z } from "zod";
import { DatabaseModel } from "@dan-schel/db";
import { HistoricalAlert } from "@/server/data/alert/historical-alert";

export class HistoricalAlertModel extends DatabaseModel<
  HistoricalAlert,
  number,
  z.input<typeof HistoricalAlertModel._schema>
> {
  static instance = new HistoricalAlertModel();

  private static _schema = z.object({
    name: z.string(),
    description: z.string(),
  });

  private constructor() {
    super("historical-alerts");
  }

  getId(item: HistoricalAlert): number {
    return item.id;
  }

  serialize(
    item: HistoricalAlert,
  ): z.input<typeof HistoricalAlertModel._schema> {
    return {
      name: item.name,
      description: item.description,
    };
  }

  deserialize(id: number, item: unknown): HistoricalAlert {
    const parsed = HistoricalAlertModel._schema.parse(item);
    return new HistoricalAlert(id, parsed.name, parsed.description);
  }
}
