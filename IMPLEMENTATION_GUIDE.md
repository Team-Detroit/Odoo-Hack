# Odoo Cafe POS - Implementation Guide

## 🏗️ Architecture Overview

This is a production-inspired Cafe POS system built for a 15-hour hackathon with 4-person team.

**Key Philosophy**: *"Humans love arguing about APIs, but databases quietly decide who's actually in charge."* 

The database schema is the foundation—all architecture decisions flow from it.

---

## 📋 What's Complete ✅

### Phase 1: Foundation (DONE)
- [x] **Database Schema** (`docs/database-schema.md`)
  - 14 models with full relationships
  - 7 enumerations (UserRole, SessionStatus, OrderStatus, PaymentStatus, etc.)
  - Entity-relationship diagram

- [x] **Prisma Schema** (`backend/src/database/prisma/schema.prisma`)
  - All models with cascade deletes, indexes, and constraints
  - Ready for migrations

- [x] **Seed Data** (`backend/src/database/seed.ts`)
  - 4 users (admin, employee, kitchen, cashier)
  - 3 categories with 5 products
  - Sample floor, tables, customers
  - Example order with items and kitchen ticket

- [x] **Backend Scaffolding**
  - `server.ts` - Express + Socket.IO setup
  - `app.ts` - Middleware & error handling

- [x] **Frontend Scaffolding**
  - `App.tsx` - React Router setup with placeholder pages
  - `main.tsx` - Entry point
  - `store/authStore.ts` - Zustand auth state management

- [x] **Frontend Services**
  - `services/apiClient.ts` - Axios client with interceptors
  - `services/auth.service.ts` - Login/register/logout API calls
  - `services/products.service.ts` - CRUD operations example

---

## 🚀 What's Next (Priority Order)

### **IMMEDIATE (Next 1-2 hours):**

#### 1. **Setup Environment**
   - Create `.env.example` and `.env` files
   - Configure PostgreSQL connection string
   - Set Node.js/npm versions

#### 2. **Initialize Database**
   ```bash
   # Backend
   cd backend
   npm install
   npx prisma migrate dev --name init
   npm run seed
   ```

#### 3. **Implement Auth Module** (Backend Priority)
   - **Route**: `backend/src/modules/auth/routes/index.ts`
   - **Controller**: `backend/src/modules/auth/controller/index.ts`
   - **Service**: `backend/src/modules/auth/service/index.ts`
   - **DTOs**: `backend/src/modules/auth/dto/`
   - **Endpoints**: POST /auth/login, POST /auth/register, GET /auth/me, POST /auth/logout
   - Use bcrypt for passwords, JWT for tokens

#### 4. **Implement Products Module** (Backend)
   - **Endpoints**: GET /products, POST /products, PUT /products/:id, DELETE /products/:id
   - **Endpoints**: GET /categories, POST /categories, etc.

---

### **PHASE 2 (Hours 3-6):**

#### 5. **Frontend Login Page**
   - Use auth.service.ts to call backend
   - Store token in authStore
   - Redirect to dashboard on success

#### 6. **Frontend Dashboard**
   - Display basic statistics
   - Use Socket.IO to show real-time updates

#### 7. **Orders Module** (Backend + Frontend)
   - Create order, add items, calculate totals
   - Real-time kitchen ticket generation

---

### **PHASE 3 (Hours 7-10):**

#### 8. **Table Management**
   - View tables, change status
   - Assign orders to tables

#### 9. **Kitchen Display System (KDS)**
   - Show pending tickets
   - Update ticket status
   - Real-time updates via Socket.IO

#### 10. **Payments**
   - Process payment (cash, card, UPI)
   - Mark order as paid

---

### **PHASE 4 (Hours 11-15):**

#### 11. **Reports Dashboard**
   - Daily sales summary
   - Category-wise breakdown
   - Time-based analytics

#### 12. **Self-Ordering (QR-based)**
   - Generate QR tokens for tables
   - Customers scan → place orders independently

#### 13. **Polish & Deploy**
   - Error handling & validation
   - UI/UX refinement
   - Deploy to Azure/Heroku

---

## 📁 Project Structure

```
Odoo-Cafe/
├── backend/
│   ├── src/
│   │   ├── config/           # Configuration files
│   │   ├── database/         # Prisma ORM
│   │   │   ├── prisma/
│   │   │   │   ├── schema.prisma ✅ DONE
│   │   │   │   └── migrations/
│   │   │   └── seed.ts ✅ DONE
│   │   ├── middleware/       # Express middleware
│   │   ├── modules/          # Feature modules
│   │   │   ├── auth/         # Authentication
│   │   │   │   ├── controller/
│   │   │   │   ├── service/
│   │   │   │   ├── repository/
│   │   │   │   ├── dto/
│   │   │   │   ├── routes/
│   │   │   │   └── index.ts
│   │   │   ├── users/
│   │   │   ├── products/
│   │   │   ├── orders/
│   │   │   ├── payments/
│   │   │   ├── tables/
│   │   │   ├── sessions/
│   │   │   ├── customers/
│   │   │   ├── categories/
│   │   │   ├── employees/
│   │   │   ├── promotions/
│   │   │   ├── kds/
│   │   │   ├── reports/
│   │   │   └── selfOrder/
│   │   ├── shared/           # Cross-module code
│   │   │   ├── enums/
│   │   │   ├── interfaces/
│   │   │   └── validators/
│   │   ├── sockets/          # Socket.IO handlers
│   │   ├── types/
│   │   ├── utils/
│   │   ├── app.ts ✅ DONE
│   │   └── server.ts ✅ DONE
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/       # Reusable components
│   │   ├── constants/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── lib/
│   │   ├── pages/            # Page components (one per route)
│   │   │   ├── LoginPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── OrderPage.tsx
│   │   │   ├── KitchenPage.tsx
│   │   │   └── ReportsPage.tsx
│   │   ├── routes/
│   │   ├── services/         # API services
│   │   │   ├── apiClient.ts ✅ DONE
│   │   │   ├── auth.service.ts ✅ DONE
│   │   │   └── products.service.ts ✅ DONE
│   │   ├── store/            # Zustand stores
│   │   │   └── authStore.ts ✅ DONE
│   │   ├── styles/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx ✅ DONE
│   │   └── main.tsx ✅ DONE
│   ├── package.json
│   └── vite.config.ts
│
├── docs/
│   ├── database-schema.md ✅ DONE
│   ├── API_CONTRACTS.md
│   └── DEPLOYMENT.md
│
├── .github/
│   └── workflows/
│
└── README.md
```

---

## 🔧 Backend Module Pattern

Each module follows this structure (DRY principle):

```
modules/auth/
├── controller/
│   └── index.ts          # HTTP request handlers
├── service/
│   └── index.ts          # Business logic
├── repository/
│   └── index.ts          # Database queries
├── dto/
│   └── index.ts          # Data transfer objects
├── routes/
│   └── index.ts          # Express routes
└── index.ts              # Exports everything
```

**Example Pattern:**
```typescript
// routes/index.ts
router.post("/login", authController.login);
router.post("/register", authController.register);

// controller/index.ts
const authController = {
  login: async (req, res) => {
    const user = await authService.login(req.body);
    // validation & response
  },
};

// service/index.ts
const authService = {
  login: async (credentials) => {
    const user = await authRepository.findByEmail(credentials.email);
    // business logic
  },
};

// repository/index.ts
const authRepository = {
  findByEmail: async (email) => {
    return prisma.user.findUnique({ where: { email } });
  },
};
```

---

## 📊 Database Models (Quick Reference)

| Model | Purpose | Key Fields |
|-------|---------|-----------|
| **User** | Authentication | email, password, role |
| **Session** | Staff shifts | userId, status (OPEN/CLOSED) |
| **Order** | Transaction | sessionId, tableId, status, total |
| **OrderItem** | Line items | orderId, productId, quantity |
| **Table** | Seating | number, seats, status |
| **Product** | Menu items | name, price, tax, isKitchenItem |
| **Category** | Product taxonomy | name, color |
| **Customer** | Loyalty/delivery | name, email, phone |
| **Payment** | Checkout | orderId, method, status |
| **KitchenTicket** | KDS | orderId, status |
| **Coupon** | Discount codes | code, discount |
| **Promotion** | Campaigns | name, discount |
| **Floor** | Layout | name |
| **SelfOrderToken** | QR tokens | tableId, token |

---

## 🔄 Real-Time Flow (Socket.IO Events)

```
Frontend                          Backend                           Kitchen
   │                                │                                  │
   ├─ table:status-change ────────→ │                                  │
   │                                ├─ io.emit(table:updated) ────────→│
   │ ←──────── table:updated ────────┤                                  │
   │                                │                                  │
   ├─ order:created ───────────────→ │                                  │
   │                                ├─ kitchen:order-update ─────────→ │
   │ ←──────── kitchen:status-changed─────────────────────── ←─────────┤
   │                                │                                  │
```

---

## 🎯 Team Work Distribution

### Backend Developers:
- [ ] Auth module (most critical)
- [ ] Products module
- [ ] Orders module
- [ ] Payments module
- [ ] Reports queries

### Frontend Developers:
- [ ] Login page
- [ ] Dashboard
- [ ] Order page
- [ ] Kitchen display
- [ ] Reports page

---

## ⚡ Quick Start Commands

```bash
# Backend
cd backend
npm install
npm run dev              # Start dev server (hot reload)
npx prisma studio      # View database

# Frontend
cd frontend
npm install
npm run dev             # Start Vite dev server

# Database
npx prisma migrate dev
npm run seed
```

---

## 📝 Checklist for Hackathon

- [x] Database schema designed
- [x] Folder structure ready
- [x] Seed data created
- [ ] Auth module implemented
- [ ] Products module implemented
- [ ] Orders workflow working
- [ ] Kitchen display functional
- [ ] Payments integrated
- [ ] Reports dashboard
- [ ] Self-ordering QR feature
- [ ] Deployment ready

---

## 🎓 Key Principles

1. **Database First**: Schema decisions propagate through entire architecture
2. **No Overengineering**: Skip guards, decorators, interceptors—keep it simple
3. **Module Independence**: Each module can be developed in parallel
4. **Real-Time First**: Socket.IO for kitchen & table updates
5. **Speed Over Perfection**: Working features > perfect code

---

## 📞 Getting Help

- Check `docs/database-schema.md` for data model questions
- Check module pattern in this file for code structure questions
- Use `npm run seed` to reset database anytime

**Good luck! 🚀**
