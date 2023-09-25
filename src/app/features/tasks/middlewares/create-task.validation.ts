import { NextFunction, Request, Response } from "express";

function createTaskValidation(req: Request, res: Response, next: NextFunction) {
  const { title, description, finishedDate } = req.body;

  if (!title) {
    return res.status(400).json({ error: "O campo 'title' é obrigatório." });
  }

  if (!description) {
    return res
      .status(400)
      .json({ error: "O campo 'description' está vazio ou inválido." });
  }

  next();
}

export { createTaskValidation };

