import { Migration_2025_09_26_WipeDisruptions } from "@/server/database/migrations/migration-2025-09-26-wipe-disruptions";
import { Migration_2025_09_26_WipeDisruptionsAgain } from "@/server/database/migrations/migration-2025-09-26-wipe-disruptions-again";
import { Migration_2025_09_27_WipeAlerts } from "@/server/database/migrations/migration-2025-09-27-wipe-alerts";
import { Migration } from "@dan-schel/db";

/**
 * See https://github.com/dan-schel/node-db/blob/master/docs/writing-database-migrations.md
 * for help writing a database migration.
 */
export const migrations: Migration[] = [
  // Always add new migrations to the end of the list, so that they don't run
  // out of order.
  new Migration_2025_09_26_WipeDisruptions(),
  new Migration_2025_09_26_WipeDisruptionsAgain(),
  new Migration_2025_09_27_WipeAlerts(),
];
