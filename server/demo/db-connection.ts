import { Db, MongoClient } from "mongodb";

export abstract class DatabaseConnection {
  abstract saveDisruption(data: string): Promise<void>;
}

export class MongoDBConnection extends DatabaseConnection {
  private db: Db;

  private constructor(private _client: MongoClient) {
    super();
    this.db = _client.db("train-disruptions");
  }

  static async init(connectionString: string): Promise<MongoDBConnection> {
    const client = new MongoClient(connectionString);
    await client.connect();
    return new MongoDBConnection(client);
  }

  async saveDisruption(data: string): Promise<void> {
    await this.db.collection("test").insertOne({ data });
    // eslint-disable-next-line no-console
    console.log("🟢 Database connection working!");
  }
}

// For testing purposes.
export class FakeDatabaseConnection extends DatabaseConnection {
  async saveDisruption(_data: string): Promise<void> {
    // eslint-disable-next-line no-console
    console.log("🟡 No database set up yet.");
  }
}
