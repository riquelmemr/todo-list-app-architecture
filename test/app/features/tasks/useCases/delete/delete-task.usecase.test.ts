import { TaskRepository } from "@app/features/tasks/repositories/task.repository";
import { DeleteTaskUseCase } from "@app/features/tasks/useCases";
import { CacheRepository } from "@app/shared/database/repositories";
import { TypeORMProvider } from "@main/database";
import { TaskBuilder } from "@test/app/shared/builders/entities/task.entity.builder";
import { UserBuilder } from "@test/app/shared/builders/entities/user.entity.builder";
import { randomUUID } from "crypto";

function makeSut() {
  const taskRepository = new TaskRepository();
  const cacheRepository = new CacheRepository();

  const deleteTaskUseCase = new DeleteTaskUseCase(
    taskRepository,
    cacheRepository
  );

  return deleteTaskUseCase;
}

describe("delete-task-usecase-integration", () => {
  afterEach(async () => {
    await TypeORMProvider.client.query("TRUNCATE tasks, users;");
  });

  it("should return http code 200 when delete task", async () => {
    const deleteTaskUseCase = makeSut();

    const user = await UserBuilder.init().build();
    const task = await TaskBuilder.init().build(user.Id);

    const response = await deleteTaskUseCase.execute({
      userId: user.Id,
      id: task.Id,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.status).toBe("Tarefa deletada com sucesso!");
    expect(response.body.body).toHaveProperty("id");
    expect(response.body.body).toHaveProperty("title", task.Title);
    expect(response.body.body).toHaveProperty("description", task.Description);
  });

  it("should return http code 400 when task not found", async () => {
    const deleteTaskUseCase = makeSut();

    const user = await UserBuilder.init().build();
    const task = await TaskBuilder.init().build(user.Id);

    const response = await deleteTaskUseCase.execute({
      userId: randomUUID(),
      id: task.Id,
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Tarefa não encontrada para este usuário.");
  });
});
