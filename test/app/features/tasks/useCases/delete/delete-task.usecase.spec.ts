import { TaskRepository } from "@app/features/tasks/repositories/task.repository";
import { DeleteTaskUseCase } from "@app/features/tasks/useCases";
import Task from "@app/models/task.model";
import { CacheRepository } from "@app/shared/database/repositories";

function makeSut() {
  const taskRepository = new TaskRepository();
  const cacheRepository = new CacheRepository();

  const deleteTaskUseCase = new DeleteTaskUseCase(
    taskRepository,
    cacheRepository
  );

  return {
    taskRepository,
    cacheRepository,
    deleteTaskUseCase,
  };
}

describe("delete-task-usecase", () => {
  jest.mock("@app/features/tasks/repositories/task.repository");

  it("should return http code 400 when task not found searching by id", async () => {
    const { taskRepository, deleteTaskUseCase } = makeSut();

    const taskFound = new Task(
      "any_id",
      "any_title",
      "any_description",
      "any_other_userId",
      false,
      false,
      new Date()
    );

    jest.spyOn(taskRepository, "getById").mockResolvedValue(taskFound);

    const response = await deleteTaskUseCase.execute({
      id: "any_id",
      userId: "any_userId",
    });

    expect(response.body.error).toBe("Tarefa não encontrada para este usuário.");
    expect(response.statusCode).toBe(400);
  });

  it("should return http code 200 when task deleted", async () => {
    const { taskRepository, deleteTaskUseCase } = makeSut();

    const taskFound = new Task(
      "any_id",
      "any_title",
      "any_description",
      "any_userId",
      false,
      false,
      new Date()
    );

    jest.spyOn(taskRepository, "getById").mockResolvedValue(taskFound);
    jest.spyOn(taskRepository, "delete").mockResolvedValue();

    const response = await deleteTaskUseCase.execute({
      id: "any_id",
      userId: "any_userId",
    });

    expect(response.body.success).toBe(true);
    expect(response.body.body).toBe(taskFound);
    expect(response.body.status).toBe("Tarefa deletada com sucesso!");
    expect(response.statusCode).toBe(200);
  })
});
