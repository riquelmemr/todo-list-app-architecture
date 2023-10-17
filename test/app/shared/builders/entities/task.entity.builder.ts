import { TaskRepository } from "@app/features/tasks/repositories/task.repository";
import Task from "@app/models/task.model";

class TaskBuilder {
  private title: string = "any_title";
  private description: string = "any_description";

  constructor(private taskRepository: TaskRepository = new TaskRepository()) {}

  static init(): TaskBuilder {
    const build = new TaskBuilder();
    return build;
  }

  async build(userId: string): Promise<Task> {
    const task = this.taskRepository.createEntityInstance({
      title: this.title,
      description: this.description,
      userId
    });

    return this.taskRepository.create(task);
  }
}

export { TaskBuilder };

