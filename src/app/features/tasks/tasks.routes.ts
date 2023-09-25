import { Router } from "express";
import { CacheRepository } from "../../shared/database/repositories";
import { authMiddleware } from "../users/middlewares";
import {
  CreateTaskController,
  DeleteTaskController,
  FindAllTasksController,
  FindOneTaskController,
  UpdateTaskController,
} from "./controllers";
import {
  createTaskValidation,
  finishedDateValidation,
  updateTaskValidation,
} from "./middlewares";
import { taskRepository } from "./repositories/task.repository";
import {
  CreateTaskUseCase,
  DeleteTaskUseCase,
  FindAllTasksUseCase,
  FindOneTaskUseCase,
  UpdateTaskUseCase,
} from "./useCases";

export const taskRoutes = Router();

taskRoutes.post(
  "/create",
  authMiddleware,
  createTaskValidation,
  finishedDateValidation,
  (req, res) => {
    const cacheRepository = new CacheRepository();
    const createTaskUseCase = new CreateTaskUseCase(
      taskRepository,
      cacheRepository
    );
    const createTaskController = new CreateTaskController(createTaskUseCase);
    return createTaskController.execute(req, res);
  }
);

taskRoutes.delete("/delete/:id", authMiddleware, (req, res) => {
  const cacheRepository = new CacheRepository();
  const deleteTaskUseCase = new DeleteTaskUseCase(
    taskRepository,
    cacheRepository
  );
  const deleteTaskController = new DeleteTaskController(deleteTaskUseCase);
  return deleteTaskController.execute(req, res);
});

taskRoutes.get("/", authMiddleware, (req, res) => {
  const cacheRepository = new CacheRepository();
  const findAllTasksUseCase = new FindAllTasksUseCase(
    taskRepository,
    cacheRepository
  );
  const findAllTasksController = new FindAllTasksController(
    findAllTasksUseCase
  );
  return findAllTasksController.execute(req, res);
});

taskRoutes.put(
  "/update/:id",
  authMiddleware,
  updateTaskValidation,
  finishedDateValidation,
  (req, res) => {
    const cacheRepository = new CacheRepository();
    const updateTaskUseCase = new UpdateTaskUseCase(
      taskRepository,
      cacheRepository
    );
    const updateTaskController = new UpdateTaskController(updateTaskUseCase);
    return updateTaskController.execute(req, res);
  }
);

taskRoutes.get("/:id", authMiddleware, (req, res) => {
  const cacheRepository = new CacheRepository();
  const findOneTaskUseCase = new FindOneTaskUseCase(
    taskRepository,
    cacheRepository
  );
  const findOneTaskController = new FindOneTaskController(findOneTaskUseCase);
  return findOneTaskController.execute(req, res);
});
