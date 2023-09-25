import Task from "../../../../models/task.model";
import { CacheRepository } from "../../../../shared/database/repositories";
import { HttpResponse, IHttpResponse } from "../../../../shared/helpers";
import { TaskRepository } from "../../repositories/task.repository";
import { TaskJSON } from "../find-one/find-one-task.dto";
import { IFindAllTasksFilterDTO } from "./find-all-tasks.dto";

class FindAllTasksUseCase {
  constructor(
    private taskRepository: TaskRepository,
    private cacheRepository: CacheRepository
  ) {}

  async execute(
    userId: string,
    filters: IFindAllTasksFilterDTO
  ): Promise<IHttpResponse> {
    try {
      const { done, archived, title } = filters;
      const cacheTasks = await this.cacheRepository.get<TaskJSON[]>(
        `user:${userId}-tasks`
      );

      let tasks: Task[] | TaskJSON[] = [];

      if (!cacheTasks) {
        tasks = await this.taskRepository.getAllByUserId(userId, filters);

        if (done === undefined && archived === undefined && !title) {
          await this.cacheRepository.set(`user:${userId}-tasks`, tasks);
        }
      } else {
        tasks = cacheTasks;

        if (done !== undefined) {
          tasks = tasks.filter((task) => task.done === done);
        }

        if (archived !== undefined) {
          tasks = tasks.filter((task) => task.archived === archived);
        }

        if (title) {
          tasks = tasks.filter((task) => task.title.includes(title as string));
        }
      }

      return HttpResponse.ok({
        success: true,
        status:
          tasks.length > 0
            ? "Tarefas encontradas com sucesso!"
            : "Nenhuma tarefa cadastrada ou encontrada.",
        body: tasks,
      });
    } catch (error: any) {
      return HttpResponse.badRequest(error);
    }
  }
}

export { FindAllTasksUseCase };

