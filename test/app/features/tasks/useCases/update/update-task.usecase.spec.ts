import { TaskRepository } from "@app/features/tasks/repositories/task.repository";
import { UpdateTaskUseCase } from "@app/features/tasks/useCases";
import Task from "@app/models/task.model";
import { CacheRepository } from "@app/shared/database/repositories";

function makeSut() {
  const taskRepository = new TaskRepository();
  const cacheRepository = new CacheRepository();

  const updateTaskUseCase = new UpdateTaskUseCase(
    taskRepository,
    cacheRepository
  )

  return {
    taskRepository,
    cacheRepository,
    updateTaskUseCase
  }
}

describe('update-task-usecase', () => {
  jest.mock('@app/features/tasks/repositories/task.repository');

  it('should return http code 400 when task not found searching by id', async () => {
    const { taskRepository, updateTaskUseCase } = makeSut();

    jest.spyOn(taskRepository, 'getById').mockResolvedValue(null);

    const response = await updateTaskUseCase.execute('any_userId', {
      id: 'any_id',
      title: undefined,
      description: 'any_description_updated',
      done: true,
      finishedDate: new Date(),
    });

    expect(response.body.error).toBe('Tarefa não encontrada para este usuário.');
    expect(response.statusCode).toBe(400);
  });

  it('should return http code 400 when task found and not updated', async () => {
    const { taskRepository, updateTaskUseCase } = makeSut();

    const taskFound = new Task(
      'any_id',
      'any_title',
      'any_description',
      'any_userId',
      false,
      false,
      new Date()
    );

    jest.spyOn(taskRepository, 'getById').mockResolvedValue(taskFound);
    jest.spyOn(taskRepository, 'update').mockResolvedValue(null);

    const response = await updateTaskUseCase.execute('any_userId', {
      id: 'any_id',
      title: undefined,
      description: 'any_description_updated',
      done: true,
      finishedDate: new Date(),
    })

    expect(response.body.error).toBe('Ocorreu um erro ao atualizar a tarefa.');
    expect(response.statusCode).toBe(400);
  })

  it('should return http code 200 when task updated', async () => {
    const { taskRepository, updateTaskUseCase } = makeSut();

    const taskFound = new Task(
      'any_id',
      'any_title',
      'any_description',
      'any_userId',
      false,
      false,
      new Date()
    );

    const taskUpdated = new Task(
      'any_id',
      'any_title_updated',
      'any_description_updated',
      'any_userId',
      true,
      false,
      taskFound.CreatedAt
    );

    jest.spyOn(taskRepository, 'getById').mockResolvedValue(taskFound);
    jest.spyOn(taskRepository, 'update').mockResolvedValue(taskUpdated);

    const response = await updateTaskUseCase.execute('any_userId', {
      id: 'any_id',
      title: 'any_title_updated',
      description: 'any_description_updated',
      done: true,
    });

    expect(response.body.success).toBe(true);
    expect(response.body.status).toBe('Tarefa editada com sucesso!');
    expect(response.body.body).toStrictEqual(taskUpdated);
  });
});