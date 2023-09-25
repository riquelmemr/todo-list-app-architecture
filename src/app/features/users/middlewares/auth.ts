import { NextFunction, Request, Response } from "express";
import { JWTProvider } from "../../../shared/helpers";

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      auth: false,
      error: "Você precisa estar logado para realizar está ação.",
    });
  }

  try {
    const decoded = JWTProvider.decodeToken(token);
    req.user = decoded as { id: string; name: string; email: string };

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ auth: false, error: "Token expirado ou inválido." });
  }
}

export { authMiddleware };

