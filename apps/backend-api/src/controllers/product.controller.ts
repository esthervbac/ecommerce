import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class ProductController {
  static async list(req: Request, res: Response) {
    try {
      const products = await prisma.product.findMany({
        include: { category: true },
        orderBy: { createdAt: "desc" },
      });
      return res.json(products);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar produtos." });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { name, description, price, stock, imageUrl, categoryId } =
        req.body;

      if (
        !name ||
        !description ||
        price === undefined ||
        stock === undefined ||
        !categoryId
      ) {
        return res
          .status(400)
          .json({
            error: "Todos os campos obrigatórios devem ser preenchidos.",
          });
      }

      const newProduct = await prisma.product.create({
        data: {
          name,
          description,
          price: Number(price),
          stock: Number(stock),
          imageUrl,
          categoryId,
        },
      });

      return res.status(201).json(newProduct);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao criar produto." });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      if (!id)
        return res.status(400).json({ error: "ID do produto é obrigatório." });

      const { name, description, price, stock, imageUrl, categoryId } =
        req.body;
      const updateData: any = {};

      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (price !== undefined) updateData.price = Number(price);
      if (stock !== undefined) updateData.stock = Number(stock);
      if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
      if (categoryId !== undefined) updateData.categoryId = categoryId;

      const updatedProduct = await prisma.product.update({
        where: { id: String(id) },
        data: updateData,
      });

      return res.json(updatedProduct);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({
          error: "Erro ao atualizar produto ou produto não encontrado.",
        });
    }
  }

  static async remove(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      if (!id)
        return res.status(400).json({ error: "ID do produto é obrigatório." });

      await prisma.product.delete({ where: { id: String(id) } });
      return res.json({ message: "Produto removido com sucesso do catálogo!" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Erro ao deletar produto ou produto não encontrado." });
    }
  }
}
