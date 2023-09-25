import Task from "../../../../models/task.model";
import { CacheRepository } from "../../../../shared/database/repositories";
import { HttpResponse, IHttpResponse } from "../../../../shared/helpers";
import { TaskRepository } from "../../repositories/task.repository";
import { ICreateTaskRequestDTO } from "./create-task.dto";

class CreateTaskUseCase {
  constructor(
    private taskRepository: TaskRepository,
    private cacheRepository: CacheRepository
  ) {}

  async execute(data: ICreateTaskRequestDTO): Promise<IHttpResponse> {
    try {
      const { title, description, finishedDate, userId } = data;

      const task = this.taskRepository.createEntityInstance({
        title,
        description,
        finishedDate: finishedDate || null,
        userId,
      });

      const taskCreated = await this.taskRepository.create(task);

      await this.cacheRepository.delete(`user:${userId}-tasks`);
      await this.cacheRepository.set<Task>(
        `user:${userId}-task:${taskCreated.Id}`,
        taskCreated
      );

      return HttpResponse.created({
        success: true,
        status: "Tarefa criada com sucesso!",
        body: taskCreated,
      });
    } catch (error: any) {
      return HttpResponse.badRequest(error);
    }
  }
}

export { CreateTaskUseCase };

