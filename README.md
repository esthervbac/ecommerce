# E-Commerce Monorepo

This is a complete e-commerce project structured as a **monorepo**, containing a customer storefront (`storefront`), an administrative dashboard (`admin-dashboard`), and a backend API (`backend-api`).

---

## 📁 Project Structure

The repository is divided into the following main modules inside the `apps/` directory:

- **`storefront`**: Customer-facing frontend application (product showcase, shopping cart, authentication, and full checkout flow with credit card and Pix).
- **`admin-dashboard`**: Administrative panel for store management.
- **`backend-api`**: API responsible for business rules, authentication, product and order management, and database integration.

---

## 🚀 Technologies Used

- **Frontend:** Next.js, React, Tailwind CSS, Lucide React, React Hook Form, Axios.
- **Backend:** Node.js / REST API.
- **Tools:** Git, monorepo management.

---

## 🔑 Access Credentials & Test Data

To test authentication and checkout flows across the applications, use the following credentials and mock data:

- **Login Email:** `esther@teste.com`
- **Password:** `senha123_super_segura`
- **Credit Card Mock (for checkout):** `1234123412341234`

---

## 🔌 Backend API Routes

Here is the list of available endpoints in the backend API:

### Authentication (`/auth`)

- `POST /auth/signup` - Register a new user account.
- `POST /auth/login` - Authenticate a user and return a JWT token.

### Products (`/products`)

- `GET /products` - List all available products.
- `GET /products/:id` - Retrieve details of a specific product.
- `POST /products` - Create a new product (Admin only).
- `PUT /products/:id` - Update an existing product (Admin only).
- `DELETE /products/:id` - Remove a product (Admin only).

### Orders (`/orders`)

- `GET /orders` - List all orders (User-specific or all for admins).
- `POST /orders` - Create a new order/checkout (Requires authentication).
- `PATCH /orders/:id/status` - Update an order's status (Admin only).

---

## 🛠️ How to Run the Project

Since this is a monorepo, each application has its own directory and dependencies. Follow the steps below to run the environment:

### 1. Configure and Start the Backend

Open a terminal at the project root and navigate to the API:

```bash
cd apps/backend-api
npm install
npm run dev
```

### 2. Start the Storefront

In another terminal, access the storefront directory:

```bash
cd apps/storefront
npm install
npm run dev
```

(The application will typically be accessible at http://localhost:3000 or the configured port).

### 3. Start the Admin Dashboard

In a third terminal, access the administrative panel directory:

```bash
cd apps/admin-dashboard
npm install
npm run dev
```
