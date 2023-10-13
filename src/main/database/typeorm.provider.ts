import { DataSource } from "typeorm";
import { dataSource } from "../config";

class TypeORMProvider {
   static client: DataSource;

   static async connect(): Promise<void> {
      this.client = dataSource;
      await this.client.initialize();
      console.log("Database connected.");
   }

   static async disconnect(): Promise<void> {
      await this.client.destroy();
   }
}

export { TypeORMProvider };

