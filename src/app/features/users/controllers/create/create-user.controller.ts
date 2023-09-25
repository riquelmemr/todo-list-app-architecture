import { Request, Response } from "express";
import { CreateUserUseCase } from "../../useCases";
import { ICreateUserRequestDTO } from "../../useCases/create/create-user.dto";

class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  async execute(req: Request, res: Response) {
    const data: ICreateUserRequestDTO = req.body;
    const { statusCode, body } = await this.createUserUseCase.execute(data);

    return res.status(statusCode).json(body);
  }
}

export { CreateUserController };

