import { Request, Response } from "express";
import { LoginUserUseCase } from "../../useCases";
import { ILoginUserRequestDTO } from "../../useCases/login/login-user.dto";

class LoginUserController {
  constructor(private loginUserUseCase: LoginUserUseCase) {}

  async execute(req: Request, res: Response) {
    const data: ILoginUserRequestDTO = req.body;
    const { statusCode, body } = await this.loginUserUseCase.execute(data);

    return res.status(statusCode).json(body);
  }
}

export { LoginUserController };

