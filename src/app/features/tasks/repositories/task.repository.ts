import { DeepPartial, FindOptionsWhere, ILike, Repository } from "typeorm";
import { TypeORMProvider } from "../../../../main/database";
import Task from "../../../models/task.model";
import { TaskEntity } from "../../../shared/database/entities/task.entity";
import { IFindAllTasksFilterDTO } from "../useCases/find-all/find-all-tasks.dto";

class TaskRepository {
  private getRepository(): Repository<TaskEntity> {
    return TypeORMProvider.client.getRepository(TaskEntity);
  }

  async create(task: TaskEntity): Promise<Task> {
    const repository = this.getRepository();
    const result = await repository.save(task);

    return this.mapToModel(result);
  }

  async getById(id: string): Promise<Task | null> {
    const repository = this.getRepository();
    const item = await repository.findOne({
      where: { ["id" as keyof TaskEntity]: id } as FindOptionsWhere<TaskEntity>,
    });

    return item ? this.mapToModel(item) : null;
  }

  async update(
    id: string,
    item: DeepPartial<TaskEntity>
  ): Promise<Task | null> {
    const repository = this.getRepository();
    const result = await repository.update(id, item);

    if (result.affected === 0) {
      return null;
    }

    const updatedItem = await repository.findOne({
      where: { ["id"]: id },
    });

    return updatedItem ? this.mapToModel(updatedItem) : null;
  }

  async delete(key: string, value: string): Promise<void> {
    const repository = this.getRepository();
    const result = await repository.delete({
      [key]: value,
    });

    if (result.affected === 0) {
      throw new Error("Ocorreu um erro ao deletar este item.");
    }
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

  public createEntityInstance(item: DeepPartial<TaskEntity>): TaskEntity {
    return TypeORMProvider.client.manager.create(
      TaskEntity,
      item
    ) as TaskEntity;
  }

  private mapToModel(item: TaskEntity): Task {
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
