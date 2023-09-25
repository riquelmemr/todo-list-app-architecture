import { NextFunction, Request, Response } from "express";
import { regexEmail } from "../../../shared/helpers";

function loginUserValidation(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;

  if (!email || !regexEmail.test(email)) {
    return res
      .status(400)
      .json({ error: "O campo 'email' está vazio ou inválido." });
  }

  if (!password || password.length < 6) {
    return res
      .status(400)
      .json({
        error: "O campo 'password' está vazio ou tem menos de 6 caracteres.",
      });
  }

  next();
}

export { loginUserValidation };

