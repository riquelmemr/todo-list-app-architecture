import { NextFunction, Request, Response } from "express";

function updateTaskValidation(req: Request, res: Response, next: NextFunction) {
  const { title, description, done, archived } = req.body;

  if (!title && !description && done === undefined && archived === undefined) {
    return res.status(400).json({
      error: "É necessário informar ao menos um campo para atualizar.",
    });
  }

  if (done !== undefined) {
    try {
      req.body.done = JSON.parse(done);
    } catch (error) {
      return res.status(400).json({ error: "O campo 'done' está inválido." });
    }
  }

  if (archived !== undefined) {
    try {
      req.body.archived = JSON.parse(archived);
    } catch (error) {
      return res
        .status(400)
        .json({ error: "O campo 'archived' está inválido." });
    }
  }

  next();
}

export { updateTaskValidation };

