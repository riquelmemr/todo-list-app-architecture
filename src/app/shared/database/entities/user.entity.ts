import { randomUUID as uuid } from "crypto";
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryColumn
} from "typeorm";
import { TaskEntity } from "./task.entity";

@Entity({ name: "users" })
export class UserEntity {
  @PrimaryColumn()
  id!: string;

  @Column({ type: "varchar", unique: true, nullable: false })
  name!: string;

  @Column({ type: "varchar", unique: true, nullable: false })
  email!: string;

  @Column({ type: "varchar", nullable: false })
  password!: string;

  @Column({ name: "created_at", type: "timestamp", nullable: false })
  createdAt!: Date;

  @Column({ name: "updated_at", type: "timestamp", nullable: false })
  updatedAt!: Date;

  @OneToMany(() => TaskEntity, (task) => task.user)
  tasks!: TaskEntity[];

  @BeforeInsert()
  beforeInsert() {
    this.id = uuid();
    this.createdAt = new Date();
  }
}
