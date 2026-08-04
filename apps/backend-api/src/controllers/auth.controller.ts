import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export class AuthController {
  static async signup(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res
          .status(400)
          .json({ error: "Preencha todos os campos obrigatórios." });
      }

      const userExists = await prisma.user.findUnique({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: "Este e-mail já está em uso." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: { name, email, password: hashedPassword, role: "USER" },
      });

      return res.status(201).json({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao registrar usuário." });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Preencha e-mail e senha." });
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: "Credenciais inválidas." });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Credenciais inválidas." });
      }

      const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
        expiresIn: "1d",
      });

      return res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao realizar login." });
    }
  }
}
