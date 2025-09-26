import { App } from "@/server/app";
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

  async allInInbox() {
    return (await this._database.all()).filter((x) => x.isInInbox);
  }
}
