import { App } from "@/server/app";
import { Alert } from "@/server/data/alert/alert";
import { ALERTS } from "@/server/database/models";
import { AlertModel } from "@/server/database/models/alert";
import { Repository } from "@dan-schel/db";

export class AlertRepository {
  private _database: Repository<AlertModel>;

  constructor(private readonly _app: App) {
    this._database = _app.database.of(ALERTS);
  }

  async get(id: string) {
    return await this._database.get(id);
  }

  async require(id: string) {
    return await this._database.require(id);
  }

  async all() {
    return await this._database.all();
  }

  async allInInbox() {
    return (await this.all()).filter((x) => x.isInInbox);
  }

  async create(alert: Alert) {
    await this._database.create(alert);
  }

  async update(alert: Alert) {
    await this._database.update(alert);
  }

  async delete(
    alertId: string,
    { deleteDisruptions = true }: { deleteDisruptions: boolean },
  ) {
    await this._database.delete(alertId);

    if (deleteDisruptions) {
      await this._app.disruptions.deleteAllFromAlert(alertId);
    }
  }
}
