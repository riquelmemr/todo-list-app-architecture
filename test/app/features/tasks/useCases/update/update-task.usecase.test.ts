import { TaskRepository } from "@app/features/tasks/repositories/task.repository";
import { UpdateTaskUseCase } from "@app/features/tasks/useCases";
import { CacheRepository } from "@app/shared/database/repositories";
import { TypeORMProvider } from "@main/database";
import { TaskBuilder } from "@test/app/shared/builders/entities/task.entity.builder";
import { UserBuilder } from "@test/app/shared/builders/entities/user.entity.builder";
import { randomUUID } from "crypto";

function makeSut() {
  const taskRepository = new TaskRepository();
  const cacheRepository = new CacheRepository();

  const updateTaskUseCase = new UpdateTaskUseCase(
    taskRepository,
    cacheRepository
  );

  return updateTaskUseCase;
}

describe("update-task-usecase-integration", () => {
  afterEach(async () => {
    await TypeORMProvider.client.query("TRUNCATE tasks, users;");
  });

  it("should return http code 200 when update task", async () => {
    const updateTaskUseCase = makeSut();

    const user = await UserBuilder.init().build();
    const task = await TaskBuilder.init().build(user.Id);

    const response = await updateTaskUseCase.execute(user.Id, {
      title: "any_title_updated",
      description: "any_description_updated",
      id: task.Id,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.status).toBe("Tarefa editada com sucesso!");
    expect(response.body.body).toHaveProperty("id", task.Id);
    expect(response.body.body).toHaveProperty("title", "any_title_updated");
    expect(response.body.body).toHaveProperty(
      "description",
      "any_description_updated"
    );
  });

  it("should return http code 400 when task not found", async () => {
    const updateTaskUseCase = makeSut();

    const user = await UserBuilder.init().build();
    const task = await TaskBuilder.init().build(user.Id);

    const response = await updateTaskUseCase.execute(user.Id, {
      title: "any_title_updated",
      description: "any_description_updated",
      id: randomUUID(),
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Tarefa não encontrada para este usuário.");
  });
});
