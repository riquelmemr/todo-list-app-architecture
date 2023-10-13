import { TaskRepository } from "@app/features/tasks/repositories/task.repository";
import { CreateTaskUseCase } from "@app/features/tasks/useCases";
import Task from "@app/models/task.model";
import { TaskEntity } from "@app/shared/database/entities/task.entity";
import { CacheRepository } from "@app/shared/database/repositories";

function makeSut() {
  const taskRepository = new TaskRepository();
  const cacheRepository = new CacheRepository();

  const createTaskUseCase = new CreateTaskUseCase(
    taskRepository,
    cacheRepository
  )

  return {
    taskRepository,
    cacheRepository,
    createTaskUseCase
  }
}

describe("create-task-usecase-unit", () => {
  jest.mock(
    "@app/features/tasks/repositories/task.repository"
  );

  it("should return http code 400 when error is thrown", async () => {
    const { taskRepository, createTaskUseCase } = makeSut();

    jest.spyOn(taskRepository, "createEntityInstance").mockReturnValue({} as TaskEntity);
    jest.spyOn(taskRepository, "create").mockImplementationOnce(
      () => {
        throw new Error("Ocorreu um erro não esperado.");
      }
    )
    
    const response = await createTaskUseCase.execute({
      title: "any_title",
      description: "any_description",
      userId: "any_user_id",
    });

    expect(response).toStrictEqual({
      body: { error: "Ocorreu um erro não esperado." },
      statusCode: 400,
    })
  })

  it("should return http code 201 created task", async () => {
    const { taskRepository, createTaskUseCase } = makeSut();

    const taskCreated = new Task(
      "any_id",
      "any_title",
      "any_description",
      "any_user_id",
      false,
      false,
      new Date()
    );

    jest.spyOn(taskRepository, "createEntityInstance").mockReturnValue({} as TaskEntity);
    jest.spyOn(taskRepository, "create").mockResolvedValue(taskCreated);

    const response = await createTaskUseCase.execute({
      title: "any_title",
      description: "any_description",
      userId: "any_user_id",
    });

    expect(response).toStrictEqual({
      body: {
        success: true,
        status: "Tarefa criada com sucesso!",
        body: taskCreated,
      },
      statusCode: 201,
    });
  });
});
