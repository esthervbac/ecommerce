import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class DashboardController {
  static async stats(req: Request, res: Response) {
    try {
      const totalProducts = await prisma.product.count();
      const totalOrders = await prisma.order.count({
        where: { totalAmount: { gt: 0 } },
      });
      const totalCustomers = await prisma.user.count({
        where: { role: "USER" },
      });

      return res.json({ totalProducts, totalOrders, totalCustomers });
    } catch (error) {
      console.error("Erro ao carregar estatísticas do dashboard:", error);
      return res.status(500).json({ error: "Erro ao carregar métricas." });
    }
  }
}
