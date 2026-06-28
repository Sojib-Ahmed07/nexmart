<div align="center">
<h1>🛒 NexMart</h1>
<p><strong>Full-Stack Multi-Vendor E-Commerce Platform</strong></p>
<a href="https://nexmart-labs.vercel.app" target="_blank"><strong>Live Demo Website →</strong></a>
</div>

> ⚡ **Live Deployment Note:** The project is hosted on Vercel's free serverless tier. If the site hasn't been visited recently, the application instances may need a few seconds to complete a "cold start" and wake up. Subsequent page loads will be instant.

---

## ⚡ Performance Architecture & Metrics

To guarantee an instant, fluid user experience across both modern and legacy devices, NexMart has been aggressively audited and optimized using Google Lighthouse and PageSpeed Insights protocols. 

### 📊 PageSpeed Insights Benchmarks

<table>
  <tr>
    <td align="center" width="50%"><b>📱 Mobile Environment Performance (96/100)</b></td>
    <td align="center" width="50%"><b>💻 Desktop Environment Performance (87/100)</b></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/547c9c99-4a3a-452a-abd1-387f2cc72cb5" width="100%" alt="NexMart Mobile PageSpeed Score"/></td>
    <td><img src="https://github.com/user-attachments/assets/43a22b2c-d223-4eb4-a106-b79c5fa5bbf9" width="100%" alt="NexMart Desktop PageSpeed Score"/></td>
  </tr>
</table>

### 🛠️ Optimization Strategies Implemented
* **Zero-Blocking Hydration:** Achieved an ultra-low **10ms Total Blocking Time (TBT)** on mobile networks by leveraging Next.js Server Components (RSC) to ship minimal client-side JavaScript.
* **Atomic Transaction Processing:** Consolidated multi-vendor basket evaluations, stock validation, and payment webhooks inside tight database transactions to ensure processing overhead never hangs the platform runtime.
* **Smart Asset Management:** Offloaded media compression and delivery straight to a Cloudinary CDN workflow, preserving a **0.9s First Contentful Paint (FCP)** on mobile endpoints.
---

## 📸 Platform Interface Showcase

<table>
  <tr>
    <td align="center" width="50%"><b>🏠 Landing Interface</b></td>
    <td align="center" width="50%"><b>🛒 All Products</b></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/a60c7f3e-d3a6-4cdf-969f-ac78277b1566" width="100%"/></td>
    <td><img src="https://github.com/user-attachments/assets/74429b4a-809e-4535-bbaf-0c2c7a6e48df" width="100%"/></td>
  </tr>
  <tr>
    <td align="center"><b>📦 Product Details</b></td>
    <td align="center"><b>💳 Payment Gateway</b></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/d06d35a8-16e2-4249-82bb-cc0c3a67e1ae" width="100%"/></td>
    <td><img src="https://github.com/user-attachments/assets/88af1cb9-27d4-4ea3-830a-817d46dce694" width="100%"/></td>
  </tr>
  <tr>
    <td align="center"><b>Cart</b></td>
    <td align="center"><b>Checkout</b></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/ee4c8102-78b9-423d-ac15-b0dc213958f0" width="100%"/></td>
    <td><img src="https://github.com/user-attachments/assets/46a80359-5dcb-47de-bc46-3d67874bbbae" width="100%"/></td>
  </tr>
  <tr>
    <td align="center"><b>Seller Dashboard</b></td>
    <td align="center"><b>Admin Dashboard</b></td>
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
* **💵 Currency:** USD

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
Before setting up the project locally, ensure you have the following installed and configured:
* **Node.js** (Version 18 or higher)
* **PostgreSQL Database** (Local instance or cloud hosted)
* Third-party sandbox accounts: **Cloudinary**, **Brevo**, and **SSLCommerz**

---

### Local Installation & Setup

#### 1. Clone the Repository
Open your terminal and run the following commands to pull the codebase and install dependencies:

```bash
git clone [https://github.com/Sojib-Ahmed07/nexmart.git](https://github.com/Sojib-Ahmed07/nexmart.git)
cd nexmart
npm install
```

#### 2. Configure Environment Variables

Create a file named .env in the root folder of your project and populate it with your respective provider API keys using the template below:

Code snippet
```bash
# Relational Database Connection (PostgreSQL)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Authentication Configuration (Better-Auth)
BETTER_AUTH_SECRET="your-32-char-secret"
BETTER_AUTH_URL="http://localhost:3000"

# Cloud Media Delivery Pipeline (Cloudinary)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Google api key
GOOGLE_CLIENT_ID="*******"
GOOGLE_CLIENT_SECRET="*********"

# Transactional Email Engine API Key (Brevo)
BREVO_API_KEY="your-brevo-key"

# Payment Gateway Sandbox Credentials (SSLCommerz)
SSLCOMMERZ_STORE_ID="your-store-id"
SSLCOMMERZ_STORE_PASSWORD="your-store-password"
SSLCOMMERZ_IS_SANDBOX="true"
```

💡 Note on Local Gateway Testing: To accurately process transactional payment callbacks via SSLCommerz on localhost, expose your local node server environment via an automated reverse proxy tunnel (like ngrok) and synchronize your NEXT_PUBLIC_APP_URL parameter with the active ngrok URL proxy string.

3. Push Schema & Initialize Platform Runtime
Execute the following commands sequentially in your terminal to synchronize your database schemas and boot up the dynamic Next.js development server:

Bash
```bash
# Push Prisma ORM data schemas straight to your relational database instance
npx prisma db push   

# Fire up the dynamic development platform ecosystem loop
npm run dev
```
