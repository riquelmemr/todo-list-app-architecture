import { Request, Response } from "express";
import { CreateTaskUseCase } from "../../useCases";
import { ICreateTaskRequestDTO } from "../../useCases/create/create-task.dto";

class CreateTaskController {
  constructor(private createTaskUseCase: CreateTaskUseCase) {}

  async execute(req: Request, res: Response) {
    const { id: userId } = req.user;
    const { title, description, finishedDate }: ICreateTaskRequestDTO = req.body;

    const { statusCode, body } = await this.createTaskUseCase.execute({
      title,
      description,
      finishedDate,
      userId,
    });

    return res.status(statusCode).json(body);
  }
}

export { CreateTaskController };

