import { randomUUID as uuid } from "crypto";
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn
} from "typeorm";
import { UserEntity } from "./user.entity";

@Entity({ name: "tasks" })
export class TaskEntity {
  @PrimaryColumn()
  id!: string;

  @Column({ type: "varchar", nullable: false })
  title!: string;

  @Column({ type: "text", nullable: false })
  description!: string;

  @Column({ name: "user_id", type: "uuid", nullable: false })
  userId!: string;

  @ManyToOne(() => UserEntity, (user) => user.tasks)
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fk_tasks_user",
  })
  user!: UserEntity;

  @Column({ type: "boolean", default: false })
  done!: boolean;

  @Column({ type: "boolean", default: false })
  archived!: boolean;

  @Column({ name: "finished_date", type: "timestamp", nullable: true })
  finishedDate?: Date | null;

  @Column({ name: "created_at", type: "timestamp" })
  createdAt!: Date;

  @Column({ name: "updated_at", type: "timestamp" })
  updatedAt!: Date;

  @BeforeInsert()
  beforeInsert() {
    this.id = uuid();
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
