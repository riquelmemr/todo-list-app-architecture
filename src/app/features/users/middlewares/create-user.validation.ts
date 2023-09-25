import { NextFunction, Request, Response } from "express";
import { regexEmail } from "../../../shared/helpers";

function createUserValidation(req: Request, res: Response, next: NextFunction) {
  const { name, email, password } = req.body;

  if (!name) {
    return res.status(400).json({ error: "O nome é obrigatório." });
  }

  if (!email || !regexEmail.test(email)) {
    return res.status(400).json({ error: "O e-mail está vazio ou inválido." });
  }

  if (!password || password.length < 6) {
    return res
      .status(400)
      .json({ error: "A senha está vazia ou tem menos de 6 caracteres." });
  }

  next();
}

export { createUserValidation };

