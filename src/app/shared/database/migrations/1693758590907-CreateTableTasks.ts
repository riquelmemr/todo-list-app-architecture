import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTableTasks1693758590907 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.createTable(
      new Table({
        name: "tasks",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            isNullable: false,
            isUnique: true,
          },
          {
            name: "title",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "description",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "user_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "done",
            type: "boolean",
            default: false,
            isNullable: false,
          },
          {
            name: "archived",
            default: false,
            type: "boolean",
            isNullable: false,
          },
          {
            name: "finished_date",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            isNullable: false,
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamp",
            isNullable: false,
            default: "now()",
          },
        ],
        foreignKeys: [
          {
            name: "fk_user_tasks",
            columnNames: ["user_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropTable("tasks", true, true, true);
  }
}
