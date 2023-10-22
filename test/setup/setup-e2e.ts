import { TaskEntity } from "@app/shared/database/entities/task.entity";
import { UserEntity } from "@app/shared/database/entities/user.entity";
import { TypeORMProvider } from "@main/database";

afterEach(async () => {
  await TypeORMProvider.client.manager.delete(TaskEntity, {});
  await TypeORMProvider.client.manager.delete(UserEntity, {});
});