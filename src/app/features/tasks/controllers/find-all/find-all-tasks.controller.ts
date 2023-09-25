import { Request, Response } from "express";
import { FindAllTasksUseCase } from "../../useCases";

class FindAllTasksController {
  constructor(private findAllTasksUseCase: FindAllTasksUseCase) {}

  async execute(req: Request, res: Response) {
    const { id: userId } = req.user;
    const { done, archived, title } = req.query;

    const { statusCode, body } = await this.findAllTasksUseCase.execute(
      userId,
      {
        done: done !== undefined ? JSON.parse(done as string) : undefined,
        archived: archived !== undefined ? JSON.parse(archived as string) : undefined,
        title: title ? String(title) : undefined,
      }
    );

    return res.status(statusCode).json(body);
  }
}

export { FindAllTasksController };

