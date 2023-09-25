import Task from "../../../../models/task.model";
import { CacheRepository } from "../../../../shared/database/repositories";
import { HttpResponse, IHttpResponse } from "../../../../shared/helpers";
import { TaskRepository } from "../../repositories/task.repository";
import { TaskJSON } from "./find-one-task.dto";

class FindOneTaskUseCase {
  constructor(
    private taskRepository: TaskRepository,
    private cacheRepository: CacheRepository
  ) {}

  async execute(id: string, userId: string): Promise<IHttpResponse> {
    try {
      let task: TaskJSON | Task | null;

      task = await this.cacheRepository.get<TaskJSON>(
        `user:${userId}-task:${id}`
      );

      if (!task) {
        task = await this.taskRepository.getById(id);

        if (!task || task.UserId !== userId) {
          throw new Error("Tarefa não encontrada!");
        }

        await this.cacheRepository.set<Task>(
          `user:${userId}-task:${id}`,
          task
        )
      }

      return HttpResponse.ok({
        success: true,
        status: "Tarefa encontrada!",
        body: task,
      });
    } catch (error: any) {
      return HttpResponse.badRequest(error);
    }
  }
}

export { FindOneTaskUseCase };

