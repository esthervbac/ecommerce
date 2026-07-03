import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "./lib/prisma";
import { authMiddleware, adminMiddleware } from "./middlewares/auth";

const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

app.get("/", (req, res) => {
  res.json({ message: "E-commerce API rodando com sucesso! 🚀" });
});

app.post("/auth/signup", async (req, res) => {
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
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER",
      },
    });

    res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao registrar usuário." });
  }
});

app.post("/auth/login", async (req, res) => {
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

    res.json({
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
    res.status(500).json({ error: "Erro ao realizar login." });
  }
});

app.get("/products", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar produtos." });
  }
});

app.post("/products", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, description, price, stock, imageUrl, categoryId } = req.body;

    if (
      !name ||
      !description ||
      price === undefined ||
      stock === undefined ||
      !categoryId
    ) {
      return res
        .status(400)
        .json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
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

    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar produto." });
  }
});

app.put("/products/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!id) {
      return res.status(400).json({ error: "ID do produto é obrigatório." });
    }

    const { name, description, price, stock, imageUrl, categoryId } = req.body;

    // build data object only with provided fields to satisfy Prisma exactOptionalPropertyTypes
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

    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erro ao atualizar produto ou produto não encontrado." });
  }
});

app.delete(
  "/products/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      if (!id) {
        return res.status(400).json({ error: "ID do produto é obrigatório." });
      }

      await prisma.product.delete({
        where: { id: String(id) },
      });

      res.json({ message: "Produto removido com sucesso do catálogo!" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Erro ao deletar produto ou produto não encontrado." });
    }
  },
);

app.get("/categories", async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { products: true } },
      },
    });
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar categorias." });
  }
});

app.post("/orders", authMiddleware, async (req, res) => {
  try {
    const userId = (req as express.Request & { user?: { id: string } }).user
      ?.id;
    const { items } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Usuário não identificado." });
    }

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
        return res
          .status(404)
          .json({ error: `Produto com ID ${item.productId} não encontrado.` });
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
          items: {
            create: orderItemsData,
          },
        },
        include: { items: true },
      });

      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
          },
        });
      }

      return order;
    });

    res.status(201).json({
      message: "Pedido realizado com sucesso! 🛒",
      order: {
        ...newOrder,
        total: totalOrderPrice,
      },
      total: totalOrderPrice,
    });
  } catch (error) {
    console.error("Erro crítico na criação de pedidos:", error);
    res.status(500).json({ error: "Erro ao processar o pedido." });
  }
});

app.get("/orders/me", authMiddleware, async (req, res) => {
  try {
    const userId = (req as express.Request & { user?: { id: string } }).user
      ?.id;

    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }

    const myOrders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                imageUrl: true,
                price: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(myOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar o histórico de pedidos." });
  }
});

app.get("/orders", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedOrders = orders.map((order) => ({
      ...order,
      total: order.totalAmount,
    }));

    res.json(formattedOrders);
  } catch (error) {
    console.error("Erro ao buscar todos os pedidos:", error);
    res.status(500).json({ error: "Erro ao buscar a lista de pedidos." });
  }
});

app.get(
  "/dashboard/stats",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const totalProducts = await prisma.product.count();

      const totalOrders = await prisma.order.count({
        where: {
          totalAmount: { gt: 0 },
        },
      });

      const totalCustomers = await prisma.user.count({
        where: { role: "USER" },
      });

      res.json({
        totalProducts,
        totalOrders,
        totalCustomers,
      });
    } catch (error) {
      console.error("Erro ao carregar estatísticas do dashboard:", error);
      res.status(500).json({ error: "Erro ao carregar métricas." });
    }
  },
);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
