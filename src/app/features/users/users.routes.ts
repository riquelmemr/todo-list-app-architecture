import { Router } from "express";
import { CreateUserController, LoginUserController } from "./controllers";
import { createUserValidation, loginUserValidation } from "./middlewares";
import { userRepository } from "./repositories/user.repository";
import { CreateUserUseCase, LoginUserUseCase } from "./useCases";

export const userRoutes = Router();

userRoutes.post("/create", createUserValidation, (req, res) => {
  const createUserUseCase = new CreateUserUseCase(userRepository);
  const createUserController = new CreateUserController(createUserUseCase);
  return createUserController.execute(req, res)
})

userRoutes.post('/login', loginUserValidation, (req, res) => {
  const loginUserUseCase = new LoginUserUseCase(userRepository);
  const loginUserController = new LoginUserController(loginUserUseCase);
  return loginUserController.execute(req, res)
})