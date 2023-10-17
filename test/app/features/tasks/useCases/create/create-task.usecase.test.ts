import { TaskRepository } from "@app/features/tasks/repositories/task.repository";
import { CreateTaskUseCase } from "@app/features/tasks/useCases";
import { CacheRepository } from "@app/shared/database/repositories";
import { TypeORMProvider } from "@main/database";
import { UserBuilder } from "@test/app/shared/builders/entities/user.entity.builder";

function makeSut() {
  const taskRepository = new TaskRepository();
  const cacheRepository = new CacheRepository();

  const createTaskUseCase = new CreateTaskUseCase(
    taskRepository,
    cacheRepository
  );

  return createTaskUseCase;
}

describe("create-task-usecase-integration", () => {
  afterEach(async () => {
    await TypeORMProvider.client.query("TRUNCATE tasks, users;");
  });

  it("should return http code 200 when create task", async () => {
    const createTaskUseCase = makeSut();

    const user = await UserBuilder.init().build();

    const response = await createTaskUseCase.execute({
      title: "any_title",
      description: "any_description",
      userId: user.Id,
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.status).toBe("Tarefa criada com sucesso!");
    expect(response.body.body).toHaveProperty("id");
    expect(response.body.body).toHaveProperty("title", "any_title");
    expect(response.body.body).toHaveProperty("description", "any_description");
  });
});
