import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { ProductController } from "../controllers/product.controller";
import { CategoryController } from "../controllers/category.controller";
import { OrderController } from "../controllers/order.controller";
import { DashboardController } from "../controllers/dashboard.controller";
import { authMiddleware, adminMiddleware } from "../middlewares/auth";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "E-commerce API rodando com sucesso! 🚀" });
});

// Auth
router.post("/auth/signup", AuthController.signup);
router.post("/auth/login", AuthController.login);

// Products
router.get("/products", ProductController.list);
router.post(
  "/products",
  authMiddleware,
  adminMiddleware,
  ProductController.create,
);
router.put(
  "/products/:id",
  authMiddleware,
  adminMiddleware,
  ProductController.update,
);
router.delete(
  "/products/:id",
  authMiddleware,
  adminMiddleware,
  ProductController.remove,
);

// Categories
router.get("/categories", CategoryController.list);

// Orders
router.post("/orders", authMiddleware, OrderController.create);
router.get("/orders/me", authMiddleware, OrderController.myOrders);
router.get("/orders", authMiddleware, adminMiddleware, OrderController.listAll);
router.patch(
  "/orders/:id/status",
  authMiddleware,
  adminMiddleware,
  OrderController.updateStatus,
);

// Dashboard
router.get(
  "/dashboard/stats",
  authMiddleware,
  adminMiddleware,
  DashboardController.stats,
);

export default router;
