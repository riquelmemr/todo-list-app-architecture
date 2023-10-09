import { TaskRepository } from "@app/features/tasks/repositories/task.repository";
import { IDeleteTaskRequestDTO } from "@app/features/tasks/useCases/delete/delete-task.dto";
import { CacheRepository } from "@app/shared/database/repositories";
import { HttpResponse, IHttpResponse } from "@app/shared/helpers";

class DeleteTaskUseCase {
  constructor(
    private taskRepository: TaskRepository,
    private cacheRepository: CacheRepository
  ) {}

  async execute(data: IDeleteTaskRequestDTO): Promise<IHttpResponse> {
    try {
      const { id, userId } = data;

      const task = await this.taskRepository.getById(id);

      if (!task || task.UserId !== userId) {
        throw new Error("Tarefa não encontrada para este usuário.");
      }

      await this.taskRepository.delete("id", id);
      
      await this.cacheRepository.delete(`user:${userId}-tasks`);
      await this.cacheRepository.delete(`user:${userId}-task:${id}`);

      return HttpResponse.ok({
        success: true,
        status: "Tarefa deletada com sucesso!",
        body: task,
      });
    } catch (error: any) {
      return HttpResponse.badRequest(error);
    }
  }
}

export { DeleteTaskUseCase };

