import { TaskRepository } from "@app/features/tasks/repositories/task.repository";
import { FindAllTasksUseCase } from "@app/features/tasks/useCases";
import Task from "@app/models/task.model";
import { CacheRepository } from "@app/shared/database/repositories";

function makeSut() {
  const taskRepository = new TaskRepository();
  const cacheRepository = new CacheRepository();

  const findAllTasksUseCase = new FindAllTasksUseCase(
    taskRepository,
    cacheRepository
  );

  return {
    taskRepository,
    cacheRepository,
    findAllTasksUseCase,
  };
}

function createInstanceTask(
  id: string,
  title?: string,
  description?: string,
  done?: boolean,
  archived?: boolean
) {
  return new Task(
    id,
    title || "any_title",
    description || "any_description",
    "any_userId",
    done !== undefined ? done : false,
    archived !== undefined ? archived : false,
    new Date()
  );
}

describe("find-all-tasks-usecase", () => {
  jest.mock("@app/features/tasks/repositories/task.repository");

  it("should return http code 200 when empty array of tasks", async () => {
    const { findAllTasksUseCase, cacheRepository } = makeSut();

    jest.spyOn(cacheRepository, "get").mockResolvedValue([]);

    const response = await findAllTasksUseCase.execute("any_userId", {});

    expect(response.body.success).toBe(true);
    expect(response.body.status).toBe(
      "Nenhuma tarefa cadastrada ou encontrada."
    );
    expect(response.body.body).toEqual([]);
  });

  it("should return http code  when unexpected error", async () => {
    const { findAllTasksUseCase, cacheRepository } = makeSut();

    jest
      .spyOn(cacheRepository, "get")
      .mockRejectedValue(new Error("Ocorreu um erro inesperado."));

    const response = await findAllTasksUseCase.execute("any_userId", {});

    expect(response.body.error).toBe("Ocorreu um erro inesperado.");
    expect(response.statusCode).toBe(400);
  });

  it("should return http code 200 when tasks found in cache", async () => {
    const { findAllTasksUseCase, cacheRepository } = makeSut();

    const cacheTasks = [createInstanceTask("any_id")];

    jest.spyOn(cacheRepository, "get").mockResolvedValue(cacheTasks);

    const response = await findAllTasksUseCase.execute("any_userId", {});

    expect(response.body.success).toBe(true);
    expect(response.body.status).toBe("Tarefas encontradas com sucesso!");
    expect(response.body.body).toEqual(cacheTasks);
  });

  it("should return http code 200 when tasks found in cache and use filter of title", async () => {
    const { findAllTasksUseCase, cacheRepository } = makeSut();

    const cacheTasks = [
      createInstanceTask("any_id", "any_first_title"),
      createInstanceTask("any_id", "any_second_title"),
    ];

    jest.spyOn(cacheRepository, "get").mockResolvedValue(cacheTasks);

    const response = await findAllTasksUseCase.execute("any_userId", {
      title: "any_first_title",
    });

    expect(response.body.success).toBe(true);
    expect(response.body.status).toBe("Tarefas encontradas com sucesso!");
    expect(response.body.body).toEqual(
      cacheTasks.filter((task) => {
        return task.Title === "any_first_title";
      })
    );
  });

  it("should return http code 200 when tasks found in cache and use filter of done", async () => {
    const { findAllTasksUseCase, cacheRepository } = makeSut();

    const cacheTasks = [
      createInstanceTask("any_id", "any_title_finished", undefined, true),
      createInstanceTask("any_id", undefined, undefined, false),
    ];

    jest.spyOn(cacheRepository, "get").mockResolvedValue(cacheTasks);

    const response = await findAllTasksUseCase.execute("any_userId", {
      done: true,
    });

    expect(response.body.success).toBe(true);
    expect(response.body.status).toBe("Tarefas encontradas com sucesso!");
    expect(response.body.body).toEqual(
      cacheTasks.filter((task) => {
        return task.Done === true;
      })
    );
  });

  it("should return http code 200 when tasks found in cache and use filter of archived", async () => {
    const { findAllTasksUseCase, cacheRepository } = makeSut();

    const cacheTasks = [
      createInstanceTask(
        "any_id",
        "any_title_archived",
        undefined,
        false,
        true
      ),
      createInstanceTask("any_id", undefined, undefined, false, false),
    ];

    jest.spyOn(cacheRepository, "get").mockResolvedValue(cacheTasks);

    const response = await findAllTasksUseCase.execute("any_userId", {
      archived: true,
    });

    expect(response.body.success).toBe(true);
    expect(response.body.status).toBe("Tarefas encontradas com sucesso!");
    expect(response.body.body).toEqual(
      cacheTasks.filter((task) => {
        return task.Archived === true;
      })
    );
  });

  it("should return http code 200 when tasks found in db", async () => {
    const { findAllTasksUseCase, taskRepository, cacheRepository } = makeSut();

    const task = createInstanceTask("any_id");

    jest.spyOn(cacheRepository, "get").mockResolvedValue(null);
    jest.spyOn(taskRepository, "getAllByUserId").mockResolvedValue([task]);

    const response = await findAllTasksUseCase.execute("any_userId", {});

    expect(response.body.success).toBe(true);
    expect(response.body.status).toBe("Tarefas encontradas com sucesso!");
    expect(response.body.body).toEqual([task]);
  });
});
