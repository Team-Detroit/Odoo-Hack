# 🏪 Odoo Cafe POS System

A production-inspired Point-of-Sale (POS) system for cafes built with **Node.js + React + PostgreSQL** during a 15-hour hackathon.

**Status**: 🚀 Foundation complete, ready for feature implementation

---

## 📋 What This Does

- **Orders**: Create, modify, and complete customer orders
- **Kitchen Display**: Real-time kitchen ticket system (KDS)
- **Table Management**: Track dining tables and customer status
- **Payments**: Process cash, card, and UPI payments
- **Reports**: Sales analytics by category, time period, employee
- **Self-Ordering**: QR-code-based table self-ordering
- **Real-Time Updates**: Socket.IO for live order and table status

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Backend** | Node.js + Express + TypeScript | REST API & Socket.IO server |
| **Database** | PostgreSQL + Prisma ORM | Data persistence with migrations |
| **Frontend** | React 18 + Vite + TypeScript | User interface |
| **State** | Zustand | Client-side state management |
| **Real-Time** | Socket.IO | Live updates (kitchen, tables) |
| **Styling** | Tailwind CSS + Shadcn UI | Component library |
| **HTTP** | Axios | API client with interceptors |
| **Auth** | JWT + bcrypt | Authentication & authorization |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### 1. Clone & Setup

```bash
# Backend setup
cd backend
cp .env.example .env
npm install

# Frontend setup
cd ../frontend
cp .env.example .env
npm install
```

### 2. Database Setup

```bash
cd backend

# Create migrations
npx prisma migrate dev --name init

# Seed sample data
npm run seed
```

### 3. Start Development Servers

```bash
# Terminal 1: Backend
cd backend
npm run dev          # Runs on http://localhost:5000

# Terminal 2: Frontend
cd frontend
npm run dev          # Runs on http://localhost:5173
```

### 4. View Database (Optional)

```bash
cd backend
npx prisma studio   # Opens at http://localhost:5555
```

---

## 📁 Project Structure

```
Odoo-Cafe/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── modules/        # Feature modules (auth, products, orders, etc.)
│   │   ├── database/       # Prisma ORM & migrations
│   │   ├── middleware/     # Express middleware
│   │   ├── shared/         # Enums, interfaces, validators
│   │   ├── app.ts          # Express app setup
│   │   └── server.ts       # HTTP server + Socket.IO
│   └── package.json
│
├── frontend/                # React + Vite
│   ├── src/
│   │   ├── pages/          # Page components
│   │   ├── components/     # Reusable UI components
│   │   ├── services/       # API client & services
│   │   ├── store/          # Zustand state stores
│   │   ├── App.tsx         # Root component
│   │   └── main.tsx        # Entry point
│   └── package.json
│
├── docs/
│   ├── database-schema.md  # Full data model documentation
│   └── API_CONTRACTS.md    # (to be created)
│
└── IMPLEMENTATION_GUIDE.md # Team guide for hackathon
```

---

## 📊 Database Schema

**14 Models Total:**
- **Core**: User, Session, Order, OrderItem, Table, Product, Category, Customer, Payment
- **Supporting**: Coupon, Promotion, KitchenTicket, SelfOrderToken, Floor

See [database-schema.md](docs/database-schema.md) for complete ERD and model definitions.

---

## 🔐 Authentication

- Users have roles: `ADMIN`, `EMPLOYEE`, `KITCHEN`
- Login returns JWT token stored in localStorage
- Token automatically added to all API requests
- 401 responses redirect to login page

---

## 🔄 API Routes (to be implemented)

```
POST   /api/auth/login           # Login
POST   /api/auth/register        # Register
GET    /api/auth/me              # Current user
POST   /api/auth/logout          # Logout

GET    /api/products             # List products
POST   /api/products             # Create product
GET    /api/categories           # List categories

POST   /api/orders               # Create order
GET    /api/orders/:id           # Get order details
PUT    /api/orders/:id           # Update order

POST   /api/payments             # Process payment
GET    /api/tables               # List tables
PUT    /api/tables/:id           # Update table status

GET    /api/kitchen/tickets      # Get pending kitchen tickets
PUT    /api/kitchen/tickets/:id  # Update ticket status

GET    /api/reports/sales        # Sales summary
```

---

## 📡 Real-Time Events (Socket.IO)

```javascript
// Kitchen updates
socket.emit("kitchen:order-update", { orderId, status });
socket.on("kitchen:status-changed", (data) => {});

// Table updates
socket.emit("table:status-change", { tableId, status });
socket.on("table:updated", (data) => {});
```

---

## 📋 Implementation Priority

### Phase 1 (Hours 0-2): Foundation ✅ DONE
- [x] Database schema
- [x] Folder structure
- [x] Seed data
- [x] Starter files

### Phase 2 (Hours 2-4): MVP Features
- [ ] Auth module (login/register)
- [ ] Products & Categories CRUD
- [ ] Basic order creation

### Phase 3 (Hours 4-8): Core Features
- [ ] Orders with items & pricing
- [ ] Kitchen display system
- [ ] Payment processing

### Phase 4 (Hours 8-12): Polish
- [ ] Table management UI
- [ ] Reports dashboard
- [ ] Real-time updates

### Phase 5 (Hours 12-15): Extra Features
- [ ] Self-ordering (QR)
- [ ] Promotions/coupons
- [ ] Deploy

---

## 🎯 Hackathon Strategy

**Philosophy**: *"Database first, then build."*

1. **Schema is locked** → Everyone works from same data model
2. **Modules are independent** → Backend & frontend can work in parallel
3. **Socket.IO for real-time** → No polling, stay responsive
4. **Skip overengineering** → Focus on working features
5. **Deploy early** → Get something live ASAP

---

## 🧪 Testing

```bash
# Backend: Run tests (once implemented)
npm test

# Frontend: Run tests
npm test
```

---

## 📦 Environment Variables

See `.env.example` in both `backend/` and `frontend/` directories.

**Critical for backend**:
```
DATABASE_URL=postgresql://user:password@localhost:5432/odoo_cafe
JWT_SECRET=your_secret_key
PORT=5000
```

---

## 🚢 Deployment

- Backend: Deploy to Heroku, Render, or Railway
- Frontend: Deploy to Vercel, Netlify, or Cloudflare Pages
- Database: Heroku PostgreSQL or Neon DB

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) (to be created).

---

## 🐛 Troubleshooting

### Database connection error
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT version();"

# Verify DATABASE_URL in .env
# Format: postgresql://user:password@localhost:5432/dbname
```

### Port already in use
```bash
# Backend (5000)
lsof -ti:5000 | xargs kill -9

# Frontend (5173)
lsof -ti:5173 | xargs kill -9
```

### Prisma migration error
```bash
# Reset database (clears all data)
npx prisma migrate reset
```

---

## 📚 Documentation

- [Database Schema](docs/database-schema.md) - Complete data model
- [Implementation Guide](IMPLEMENTATION_GUIDE.md) - Team guide for hackathon
- API Contracts (coming soon)
- Deployment Guide (coming soon)

---

## 👥 Team Roles

| Role | Responsibility |
|------|-----------------|
| **Backend Dev 1** | Auth module + core CRUD |
| **Backend Dev 2** | Orders + payments + reports |
| **Frontend Dev 1** | Auth UI + dashboard |
| **Frontend Dev 2** | Orders + kitchen display |

---

## 📝 Notes

- **Database schema is immutable** during hackathon (no changes without team discussion)
- Each module should have isolated tests
- Socket.IO events for real-time features (don't poll)
- Always validate user input on backend
- Use TypeScript for type safety

---

## 🎓 Learning Resources

- [Prisma Docs](https://www.prisma.io/docs/)
- [Express.js Guide](https://expressjs.com/)
- [React Hooks](https://react.dev/reference/react/hooks)
- [Socket.IO Documentation](https://socket.io/docs/)

---

## 📄 License

MIT

---

**Let's build something great! 🚀**

For questions, check [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) first.
