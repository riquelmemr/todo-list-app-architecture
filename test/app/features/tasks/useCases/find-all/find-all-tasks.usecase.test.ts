import { TaskRepository } from "@app/features/tasks/repositories/task.repository";
import { FindAllTasksUseCase } from "@app/features/tasks/useCases";
import { CacheRepository } from "@app/shared/database/repositories";
import { TypeORMProvider } from "@main/database";
import { TaskBuilder } from "@test/app/shared/builders/entities/task.entity.builder";
import { UserBuilder } from "@test/app/shared/builders/entities/user.entity.builder";

function makeSut() {
  const taskRepository = new TaskRepository();
  const cacheRepository = new CacheRepository();

  const findAllTasksUseCase = new FindAllTasksUseCase(
    taskRepository,
    cacheRepository
  );

  return findAllTasksUseCase;
}

describe("find-all-tasks-usecase-integration", () => {
  afterEach(async () => {
    await TypeORMProvider.client.query("TRUNCATE tasks, users;");
  });

  it("should return http code 200 when find all tasks", async () => {
    const findAllTasksUseCase = makeSut();

    const user = await UserBuilder.init().build();
    
    await TaskBuilder.init().build(user.Id);
    await TaskBuilder.init().build(user.Id);
    await TaskBuilder.init().build(user.Id);

    const response = await findAllTasksUseCase.execute(user.Id, {});

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.status).toBe("Tarefas encontradas com sucesso!");
    expect(response.body.body).toHaveLength(3);
  });
})