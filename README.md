<div align="center">
<h1>🛒 NexMart</h1>
<p><strong>Full-Stack Multi-Vendor E-Commerce Platform</strong></p>
<a href="https://nexmart-labs.vercel.app" target="_blank"><strong>Live Demo Website →</strong></a>
</div>

---

## 📸 Platform Interface Showcase

<table>
  <tr>
    <td align="center" width="50%"><b>🏠 Landing Interface</b></td>
    <td align="center" width="50%"><b>🛒 Dynamic Product Catalog</b></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/a60c7f3e-d3a6-4cdf-969f-ac78277b1566" width="100%"/></td>
    <td><img src="https://github.com/user-attachments/assets/74429b4a-809e-4535-bbaf-0c2c7a6e48df" width="100%"/></td>
  </tr>
  <tr>
    <td align="center"><b>📦 Dynamic Nested Product Scope</b></td>
    <td align="center"><b>💳 Payment Gateway Verification</b></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/d06d35a8-16e2-4249-82bb-cc0c3a67e1ae" width="100%"/></td>
    <td><img src="https://github.com/user-attachments/assets/88af1cb9-27d4-4ea3-830a-817d46dce694" width="100%"/></td>
  </tr>
  <tr>
    <td align="center"><b>🏪 Merchant Dashboard Architecture</b></td>
    <td align="center"><b>🛡️ Administrative Command Core</b></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/ee4c8102-78b9-423d-ac15-b0dc213958f0" width="100%"/></td>
    <td><img src="https://github.com/user-attachments/assets/46a80359-5dcb-47de-bc46-3d67874bbbae" width="100%"/></td>
  </tr>
  <tr>
    <td align="center"><b>🔐 Quick Demo Identity Injection</b></td>
    <td align="center"><b>📋 Real-Time Order Lifecycle Pipeline</b></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/3da77dfb-30b4-46a4-81e2-eec99410651a" width="100%"/></td>
    <td><img src="https://github.com/user-attachments/assets/051a2921-1c3f-400e-99bc-9a35c743f4f3" width="100%"/></td>
  </tr>
</table>

---

## 🧩 What Is NexMart?
NexMart is a production-ready, multi-vendor e-commerce marketplace where independent sellers can open their own storefronts, list products, and receive real payments — all managed under a single platform by an admin.

Think of it as a mini Amazon: shoppers browse and buy, sellers manage their own stores and orders, and an admin oversees the entire ecosystem — approving sellers, managing categories, and monitoring platform health.

## 🛠️ Built With

| Technology | Purpose |
| :--- | :--- |
| **⚡ Next.js 16 (App Router)** | Full-stack framework — SSR, Server Actions, API routes |
| **🔷 TypeScript** | End-to-end type safety |
| **🗄️ PostgreSQL + Prisma** | Relational database with type-safe ORM |
| **🔐 better-auth** | Authentication — sessions, email verification, password reset |
| **💳 SSLCommerz** | Payment gateway (bKash, Nagad, cards, internet banking) |
| **☁️ Cloudinary** | Product image upload and delivery |
| **📧 Brevo** | Transactional emails (verification, password reset) |
| **🎨 Tailwind CSS v4** | Utility-first styling |

---

## 👥 Three Roles, One Platform
NexMart is built around a role-based system — every user belongs to one of three roles, each with its own dashboard and capabilities.

### 🛍️ Shopper
* Browse the marketplace and filter products by category
* Add items from multiple sellers into a single persistent cart
* Checkout securely via SSLCommerz (bKash, Nagad, Visa, Mastercard)
* Track order status in real time: `Pending` → `Processing` → `Shipped` → `Delivered`
* Apply to become a seller directly from the dashboard

### 🏪 Seller
* Apply for a storefront — goes live only after Admin approval
* Set up store with name, description, logo, and banner image
* Full product management: create, edit, delete listings with image uploads
* View and fulfill incoming orders — update status for each delivery

### 🛡️ Admin
* Approve or suspend seller storefronts from a dedicated management panel
* Manage all registered users (view, delete)
* Create and manage global product categories used across the marketplace
* Monitor platform health: total users, active stores, pending seller applications

---

## 🔐 Security & Auth
* **Email verification** — new accounts must verify their email before accessing the platform, enforced via better-auth with magic-link emails sent through Brevo
* **Password reset** — full forgot-password flow with time-limited reset links, also sent via Brevo
* **Session management** — sessions are stored in PostgreSQL, not just cookies, making them revocable and persistent
* **Server-side role enforcement** — every dashboard route and data mutation checks the session role on the server; there is no client-side gating
* **Protected Server Actions** — all write operations (creating products, updating orders, approving stores) verify the authenticated session before executing

---

## 💳 Payment Integration
Payments run through SSLCommerz, a real Bangladeshi payment gateway, supporting:
* **📱 Mobile banking** — bKash, Nagad, Rocket
* **💳 Cards** — Visa, Mastercard, Amex
* **🏦 Internet banking** — multiple banks
* **💵 Currency:** BDT

The checkout flow creates an order in the database first (status: `PAYMENT_PENDING`), then redirects the user to SSLCommerz. On return:
* **Success** — order is marked paid, and stock is decremented atomically in a single database transaction
* **Failure / Cancel** — order is marked cancelled and the user is notified
* **Duplicate-payment guard** — if SSLCommerz fires the success webhook more than once, the second call is rejected before any database changes run.

---

## ✨ UI Highlights
* **🌙 Dark / Light mode** — system-aware theme toggle powered by `next-themes`, persists across sessions
* **🎠 Hero carousel** — Embla Carousel with autoplay and auto-scroll on the landing page
* **⬆️ Page progress bar** — `nextjs-toploader` provides a smooth loading indicator on every navigation
* **📱 Fully responsive** — mobile-first layout using Tailwind CSS, works on all screen sizes
* **🔁 Persistent cart** — cart state survives page refreshes using `localStorage`, with hydration handled safely to avoid SSR mismatches

---

## 🚀 Getting Started

### Prerequisites
Node.js 18+, PostgreSQL database, Cloudinary account, Brevo account, SSLCommerz sandbox account

### Setup
```bash
git clone [https://github.com/Sojib-Ahmed07/nexmart.git](https://github.com/Sojib-Ahmed07/nexmart.git)
cd nexmart
npm install
