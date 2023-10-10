import { Request, Response } from "express";
import { UpdateTaskUseCase } from "../../useCases";
import { IUpdateTaskRequestDTO } from "../../useCases/update/update-task.dto";

class UpdateTaskController {
  constructor(private updateTaskUseCase: UpdateTaskUseCase) {}

  async execute(req: Request, res: Response) {
    const {
      title,
      description,
      done,
      archived,
      finishedDate,
    }: IUpdateTaskRequestDTO = req.body;
    
    const { id } = req.params;
    const { id: userId } = req.user;

    const { statusCode, body } = await this.updateTaskUseCase.execute(userId, {
      id,
      title,
      description,
      done,
      archived,
      finishedDate: finishedDate || null,
    });

    return res.status(statusCode).json(body);
  }
}

export { UpdateTaskController };

