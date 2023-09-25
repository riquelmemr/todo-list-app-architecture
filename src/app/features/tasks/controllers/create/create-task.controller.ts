import { Request, Response } from "express";
import { CreateTaskUseCase } from "../../useCases";
import { ICreateTaskRequestDTO } from "../../useCases/create/create-task.dto";

class CreateTaskController {
  constructor(private createTaskUseCase: CreateTaskUseCase) {}

  async execute(req: Request, res: Response) {
    const { id: userId } = req.user;
    const data: ICreateTaskRequestDTO = req.body;

    const { statusCode, body } = await this.createTaskUseCase.execute({
      ...data,
      userId,
    });

    return res.status(statusCode).json(body);
  }
}

export { CreateTaskController };

