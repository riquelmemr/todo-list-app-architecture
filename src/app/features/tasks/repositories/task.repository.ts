import { FindOptionsWhere, ILike } from "typeorm";
import Task from "../../../models/task.model";
import { TaskEntity } from "../../../shared/database/entities/task.entity";
import { BaseRepository } from "../../../shared/database/repositories";
import { IFindAllTasksFilterDTO } from "../useCases/find-all/find-all-tasks.dto";

class TaskRepository extends BaseRepository<TaskEntity, Task> {
  constructor() {
    super();
    this.entityClass = TaskEntity;
  }

  async getAllByUserId(
    userId: string,
    filters: IFindAllTasksFilterDTO
  ): Promise<Task[]> {
    const { done, archived, title } = filters;
    const repository = this.getRepository();

    const options: FindOptionsWhere<TaskEntity> = { userId: userId };

    if (done !== undefined) {
      options.done = done;
    }

    if (archived !== undefined) {
      options.archived = archived;
    }

    if (title) {
      options.title = ILike(`%${title}%`);
    }

    const tasks = await repository.find({
      where: options,
      order: { createdAt: "DESC" },
    });

    return tasks.map((task) => this.mapToModel(task));
  }

  mapToModel(item: TaskEntity): Task {
    return new Task(
      item.id,
      item.title,
      item.description,
      item.userId,
      item.done,
      item.archived,
      item.createdAt,
      item.finishedDate
    );
  }
}

export { TaskRepository };

export const taskRepository = new TaskRepository();

