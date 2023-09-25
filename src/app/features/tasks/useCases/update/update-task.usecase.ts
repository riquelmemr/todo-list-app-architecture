import Task from "../../../../models/task.model";
import { CacheRepository } from "../../../../shared/database/repositories";
import { HttpResponse } from "../../../../shared/helpers";
import { TaskRepository } from "../../repositories/task.repository";
import { IUpdateTaskRequestDTO } from "./update-task.dto";

class UpdateTaskUseCase {
  constructor(
    private taskRepository: TaskRepository,
    private cacheRepository: CacheRepository
  ) {}

  async execute(userId: string, data: IUpdateTaskRequestDTO) {
    try {
      const { id, title, description, done, archived, finishedDate } = data;

      const task = await this.taskRepository.getById(id);

      if (!task || task.UserId !== userId) {
        throw new Error("Tarefa não encontrada para este usuário.");
      }

      const taskUpdated = await this.taskRepository.update(id, {
        title: title || task.Title,
        description: description || task.Description,
        done: done !== undefined ? done : task.Done,
        archived: archived !== undefined ? archived : task.Archived,
        finishedDate: finishedDate || task.FinishedDate,
        updatedAt: new Date(),
      });

      if (!taskUpdated) {
        throw new Error("Ocorreu um erro ao atualizar a tarefa.");
      }

      await this.cacheRepository.delete(`user:${userId}-tasks`);
      await this.cacheRepository.set<Task>(
        `user:${userId}-task:${taskUpdated.Id}`,
        taskUpdated
      );

      return HttpResponse.ok({
        success: true,
        status: "Tarefa editada com sucesso!",
        body: taskUpdated,
      });
    } catch (error: any) {
      return HttpResponse.badRequest(error);
    }
  }
}

export { UpdateTaskUseCase };

