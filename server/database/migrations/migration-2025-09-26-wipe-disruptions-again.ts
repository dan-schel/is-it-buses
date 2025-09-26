import { Migration, Migrator } from "@dan-schel/db";

export class Migration_2025_09_26_WipeDisruptionsAgain extends Migration {
  constructor() {
    super("2025-09-26-wipe-disruptions-again");
  }

  async run(migrator: Migrator): Promise<void> {
    migrator.drop({
      collection: "disruptions",
    });
  }
}
