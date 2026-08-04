import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

interface TokenPayload {
  userId: string;
  role: "USER" | "ADMIN";
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2) {
    return res.status(401).json({ error: "Erro no formato do token." });
  }

  const [scheme, token] = parts;
  if (!scheme || !/^Bearer$/i.test(scheme) || !token) {
    return res.status(401).json({ error: "Token malformado." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as TokenPayload;

    req.user = {
      id: decoded.userId,
      role: decoded.role,
    };

    return next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
}

export function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({
      error: "Acesso negado. Apenas administradores podem realizar esta ação.",
    });
  }

  return next();
}
