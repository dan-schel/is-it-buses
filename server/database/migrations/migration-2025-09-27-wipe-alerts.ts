import { Migration, Migrator } from "@dan-schel/db";

export class Migration_2025_09_27_WipeAlerts extends Migration {
  constructor() {
    super("2025-09-26-wipe-alerts");
  }

  async run(migrator: Migrator): Promise<void> {
    migrator.drop({
      collection: "alerts",
    });
  }
}
