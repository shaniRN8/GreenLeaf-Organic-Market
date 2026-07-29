# 🌱 GreenLeaf Organic Market - Full-Stack E-Commerce Application

A full-stack organic e-commerce web application built using **React, Express, Node.js, and MongoDB** featuring secure JWT authentication, role-based access control, interactive shopping cart with promo discounts, order tracking, and a comprehensive Admin Dashboard.

![GreenLeaf Market Banner](https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=80)

---

## 🚀 Key Features

### 🛒 Customer Storefront
- **Organic Catalog (16 Items)**: Browse 100% certified organic items across 5 categories (*Produce*, *Dairy & Eggs*, *Bakery*, *Superfoods*, *Beverages*).
- **Live Search & Category Filtering**: Instant keyword search, category pills, and sorting (Price Low/High, Rating, Featured).
- **Quick View Modal**: Inspect product details, farm origin, USDA Organic certifications, and reviews.
- **Cart & Promo System**: Slide-over drawer with quantity controls, subtotal calculation, and promo code support (e.g. `ORGANIC10` for 10% off).
- **Checkout & Tracking**: Address entry, payment selection, instant order confirmation receipt, and real-time order status tracking.

### 🔐 Secure User Authentication
- **JWT Authentication**: Token-based login and registration with hashed passwords.
- **Role-Based Authorization**: Distinguishes between standard `customer` and privileged `admin` accounts.
- **Pre-Seeded Demo Accounts**:
  - 👑 **Admin Portal**: `admin@greenleaf.com` / `admin123`
  - 🛒 **Customer Account**: `customer@greenleaf.com` / `user123`

### 📊 Admin Control Panel
- **Metrics Overview**: Store revenue counters, order statistics, catalog items count, low stock alerts (≤ 10 items), and visual category progress bars.
- **Inventory Management**: Add new items, edit prices & stock levels inline, and remove products.
- **Order Fulfillments**: View incoming customer orders and update status (`Processing`, `Shipped`, `Delivered`).

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Vanilla CSS (Glassmorphism & Emerald Organic Theme), Lucide Icons
- **Backend**: Node.js, Express framework
- **Database**: MongoDB (Mongoose ORM) + Automatic fallback in-memory database pre-seeded out of the box
- **Authentication**: JWT, `crypto` / `bcrypt`

---

## 📁 Project Structure

```
GreenLeaf Organic Market/
├── README.md                 # Project documentation
├── package.json              # Main project setup & scripts
├── vite.config.js            # Vite bundler configuration
├── server/                   # Node.js & Express Backend
│   ├── index.js              # Server entry point & static hosting
│   ├── config/db.js          # DB connection & in-memory store
│   ├── middleware/auth.js    # JWT & Admin permission middleware
│   ├── models/               # Schemas for User, Product, Order
│   └── routes/               # Express API routes (auth, products, orders, stats)
├── client/                   # React Frontend Source
│   ├── index.html            # HTML entry point with Google Fonts
│   └── src/
│       ├── main.jsx          # React app entry point
│       ├── App.jsx           # Main App layout & state
│       ├── styles/index.css  # Premium Organic design system
│       ├── utils/api.js      # API fetch wrapper
│       └── components/       # UI Components & Admin Dashboard
└── dist/                     # Production build output
```

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new account | Public |
| `POST` | `/api/auth/login` | Login user & receive JWT | Public |
| `GET` | `/api/auth/me` | Fetch current user profile | Authenticated |
| `GET` | `/api/auth/products` | Get catalog items (filter/search) | Public |
| `POST` | `/api/products` | Add new organic product | Admin Only |
| `PUT` | `/api/products/:id` | Update product price & stock | Admin Only |
| `DELETE` | `/api/products/:id` | Remove product from catalog | Admin Only |
| `POST` | `/api/orders` | Create checkout order | Authenticated |
| `GET` | `/api/orders/my-orders` | Fetch user order history | Authenticated |
| `GET` | `/api/orders` | Fetch all customer orders | Admin Only |
| `PUT` | `/api/orders/:id/status` | Update order status | Admin Only |
| `GET` | `/api/stats/overview` | Admin dashboard analytics | Admin Only |

---

## 💻 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Build Frontend Bundle
```bash
npm run build
```

### 3. Start Application
```bash
npm run dev
# or
node server/index.js
```

Access the application in your browser at:
👉 **`http://localhost:5000`**
