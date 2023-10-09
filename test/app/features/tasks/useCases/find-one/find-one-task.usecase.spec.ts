import { TaskRepository } from "@app/features/tasks/repositories/task.repository";
import { FindOneTaskUseCase } from "@app/features/tasks/useCases";
import Task from "@app/models/task.model";
import { CacheRepository } from "@app/shared/database/repositories";

function makeSut() {
  const taskRepository = new TaskRepository();
  const cacheRepository = new CacheRepository();

  const findOneTaskUseCase = new FindOneTaskUseCase(
    taskRepository,
    cacheRepository
  );

  return {
    taskRepository,
    cacheRepository,
    findOneTaskUseCase,
  }
}

describe('find-one-task-usecase', () => {
  jest.mock('@app/features/tasks/repositories/task.repository');

  it('should return http code 400 when task not found searching by id', async () => {
    const { taskRepository, cacheRepository, findOneTaskUseCase } = makeSut();

    const taskFound = new Task(
      "any_id",
      "any_title",
      "any_description",
      "any_other_userId",
      false,
      false,
      new Date()
    );

    jest.spyOn(cacheRepository, 'get').mockResolvedValue(null);
    jest.spyOn(taskRepository, 'getById').mockResolvedValue(taskFound);

    const response = await findOneTaskUseCase.execute(
      "any_id",
      "any_userId"
    );

    expect(response.body.error).toBe("Tarefa não encontrada!");
    expect(response.statusCode).toBe(400);
  })

  it('should return http code 200 when task found', async () => {
    const { taskRepository, cacheRepository, findOneTaskUseCase } = makeSut();

    const taskFound = new Task(
      "any_id",
      "any_title",
      "any_description",
      "any_userId",
      false,
      false,
      new Date()
    );

    jest.spyOn(cacheRepository, 'get').mockResolvedValue(null);
    jest.spyOn(taskRepository, 'getById').mockResolvedValue(taskFound);

    const response = await findOneTaskUseCase.execute(
      "any_id",
      "any_userId"
    );

    expect(response.body).toStrictEqual({
      success: true,
      status: "Tarefa encontrada!",
      body: taskFound,
    });
  })
})