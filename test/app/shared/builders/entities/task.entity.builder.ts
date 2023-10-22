import { TaskRepository } from "@app/features/tasks/repositories/task.repository";
import Task from "@app/models/task.model";

interface TaskOptions {
  title?: string;
  description?: string;
  done?: boolean;
  archived?: boolean;
}
class TaskBuilder {
  private title: string = "any_title";
  private description: string = "any_description";

  constructor(private taskRepository: TaskRepository = new TaskRepository()) {}

  static init(): TaskBuilder {
    const build = new TaskBuilder();
    return build;
  }

  async build(userId: string, options?: TaskOptions): Promise<Task> {
    const { title, description, done, archived } = options || {};

    const task = this.taskRepository.createEntityInstance({
      title: title || this.title,
      description: description || this.description,
      done: done !== undefined ? done : false,
      archived: archived !== undefined ? archived : false,
      userId
    });

    return this.taskRepository.create(task);
  }
}

export { TaskBuilder };

