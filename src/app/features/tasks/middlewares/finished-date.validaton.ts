import { NextFunction, Request, Response } from "express";

export function finishedDateValidation(req: Request, res: Response, next: NextFunction) {
  const { finishedDate } = req.body;

  if (finishedDate) {
    req.body.finishedDate = new Date(finishedDate);
  }

  next();
}