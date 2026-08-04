import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class CategoryController {
  static async list(req: Request, res: Response) {
    try {
      const categories = await prisma.category.findMany({
        include: {
          _count: { select: { products: true } },
        },
      });
      return res.json(categories);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar categorias." });
    }
  }
}
