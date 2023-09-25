import { Request, Response } from "express";
import { DeleteTaskUseCase } from "../../useCases";

class DeleteTaskController {
  constructor(private deleteTaskUseCase: DeleteTaskUseCase) {}

  async execute(req: Request, res: Response) {
    const { id } = req.params;
    const { id: userId } = req.user;
    
    const { statusCode, body } = await this.deleteTaskUseCase.execute({
      id,
      userId,
    });

    return res.status(statusCode).json(body);
  }
}

export { DeleteTaskController };

