import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class OrderController {
  static async create(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { items, status } = req.body;

      if (!userId)
        return res.status(401).json({ error: "Usuário não identificado." });
      if (!items || items.length === 0) {
        return res
          .status(400)
          .json({ error: "O carrinho não pode estar vazio." });
      }

      let totalOrderPrice = 0;
      const orderItemsData: {
        productId: string;
        quantity: number;
        price: number;
      }[] = [];

      for (const item of items) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });
        if (!product) {
          return res.status(404).json({
            error: `Produto com ID ${item.productId} não encontrado.`,
          });
        }
        if (product.stock < item.quantity) {
          return res.status(400).json({
            error: `Estoque insuficiente para o produto: ${product.name}.`,
          });
        }

        totalOrderPrice += product.price * item.quantity;
        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
        });
      }

      const newOrder = await prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
          data: {
            userId,
            totalAmount: totalOrderPrice,
            status: status || "PENDING",
            items: { create: orderItemsData },
          },
          include: { items: true },
        });

        for (const item of items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }

        return order;
      });

      return res.status(201).json({
        message: "Pedido realizado com sucesso! 🛒",
        order: { ...newOrder, total: totalOrderPrice },
        total: totalOrderPrice,
      });
    } catch (error) {
      console.error("Erro crítico na criação de pedidos:", error);
      return res.status(500).json({ error: "Erro ao processar o pedido." });
    }
  }

  static async myOrders(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId)
        return res.status(401).json({ error: "Usuário não autenticado." });

      const myOrders = await prisma.order.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              product: { select: { name: true, imageUrl: true, price: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return res.json(myOrders);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Erro ao buscar o histórico de pedidos." });
    }
  }

  static async listAll(req: Request, res: Response) {
    try {
      const orders = await prisma.order.findMany({
        include: {
          user: { select: { name: true, email: true } },
          items: { include: { product: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      const formattedOrders = orders.map((order) => ({
        ...order,
        total: order.totalAmount,
      }));

      return res.json(formattedOrders);
    } catch (error) {
      console.error("Erro ao buscar todos os pedidos:", error);
      return res
        .status(500)
        .json({ error: "Erro ao buscar a lista de pedidos." });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const allowedAdminStatuses = ["SHIPPED", "CANCELLED"];

      if (!status || !allowedAdminStatuses.includes(status)) {
        return res.status(400).json({
          error:
            "Ação não permitida. O admin só pode alterar o status para ENVIADO (SHIPPED) ou CANCELADO (CANCELLED).",
        });
      }

      const updatedOrder = await prisma.order.update({
        where: { id: String(id) },
        data: { status },
      });

      return res.json({
        message: "Status atualizado com sucesso!",
        order: updatedOrder,
      });
    } catch (error) {
      console.error("Erro ao atualizar status do pedido:", error);
      return res
        .status(500)
        .json({ error: "Erro ao atualizar status no banco de dados." });
    }
  }
}
