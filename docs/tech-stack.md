# Tech Stack

> Complete breakdown of every technology used in the Odoo Cafe POS system, including why each was chosen.

---

## Stack Overview

```mermaid
graph TB
    subgraph Client["Client Layer"]
        React["React 19"]
        Vite["Vite 8"]
        TS_FE["TypeScript"]
        Tailwind["Tailwind CSS 4"]
        Router["React Router v7"]
        Zustand["Zustand"]
        Query["TanStack Query"]
        Axios["Axios"]
        SocketClient["Socket.IO Client"]
        QRCode["QRCode.js"]
        Lucide["Lucide Icons"]
    end

    subgraph Server["Server Layer"]
        Node["Node.js"]
        Express["Express 5"]
        TS_BE["TypeScript"]
        JWT["JWT"]
        Bcrypt["bcryptjs"]
        SocketServer["Socket.IO Server"]
        Zod["Zod Validation"]
        Helmet["Helmet"]
        Morgan["Morgan"]
        Swagger["Swagger"]
    end

    subgraph Data["Data Layer"]
        Prisma["Prisma ORM"]
        PostgreSQL["PostgreSQL"]
    end

    Client <-->|"REST API (HTTP)"| Server
    Client <-->|"WebSocket"| Server
    Server --> Data
```

---

## Frontend

| Technology | Version | Purpose | Why Chosen |
|-----------|---------|---------|------------|
| React | 19.x | UI framework | Industry standard, component model |
| Vite | 8.x | Build tool and dev server | Extremely fast HMR, modern ESM |
| TypeScript | ~6.0 | Type safety | Catches bugs at compile time |
| Tailwind CSS | 4.x | Utility-first styling | Rapid UI development |
| React Router | v7 | Client-side routing | Declarative routing, nested layouts |
| Zustand | 5.x | Global state management | Lightweight, no boilerplate vs Redux |
| TanStack Query | 5.x | Server state and caching | Automatic caching, refetching, loading states |
| Axios | 1.x | HTTP client | Interceptors for JWT injection |
| Socket.IO Client | 4.x | WebSocket client | Real-time kitchen/table updates |
| QRCode.js | 1.x | QR code generation | Per-table self-ordering QR codes |
| Lucide React | 1.x | Icon library | Clean, consistent icons |

### Frontend Architecture Pattern

```mermaid
graph TD
    Entry["main.tsx<br/>Entry Point"]
    App["App.tsx<br/>Router + Providers"]

    subgraph Pages
        Auth["auth/<br/>Login"]
        Admin["admin/<br/>Dashboard"]
        POS["pos/<br/>POS Terminal"]
        KDS["kds/<br/>Kitchen Display"]
        Self["self-ordering/<br/>QR Portal"]
        Cust["customer-display/<br/>Display Screen"]
    end

    subgraph Layers["Supporting Layers"]
        Components["components/<br/>Reusable UI"]
        Hooks["hooks/<br/>Custom React Hooks"]
        Store["store/<br/>Zustand Stores"]
        Services["services/<br/>API Calls"]
        Types["types/<br/>TypeScript Types"]
        Lib["lib/<br/>Utilities"]
    end

    Entry --> App
    App --> Pages
    Pages --> Components
    Pages --> Hooks
    Pages --> Store
    Services --> Store
    Hooks --> Services
```

---

## Backend

| Technology | Version | Purpose | Why Chosen |
|-----------|---------|---------|------------|
| Node.js | 18+ | Runtime | JavaScript on server, same language as frontend |
| Express | 5.x | Web framework | Minimal, flexible, huge ecosystem |
| TypeScript | ^6.0 | Type safety | Shared types with frontend, fewer bugs |
| Prisma ORM | 6.x | Database ORM | Type-safe queries, auto migrations |
| Socket.IO | 4.x | WebSocket server | Real-time bidirectional communication |
| JWT | 9.x | Authentication tokens | Stateless auth, role-based access |
| bcryptjs | 3.x | Password hashing | Secure password storage |
| Zod | 4.x | Input validation | Schema validation for all API inputs |
| Helmet | 8.x | Security headers | Prevent common HTTP attacks |
| Morgan | 1.x | HTTP request logging | Dev/prod logging |
| CORS | 2.x | Cross-origin requests | Allow frontend to call backend |
| Swagger | 6.x | API documentation | Auto-generate API docs |

### Backend Module Architecture

```mermaid
graph TD
    Entry["server.ts<br/>HTTP Server + Socket.IO"]
    App["app.ts<br/>Express App + Middleware"]

    subgraph Middleware["Middleware"]
        Auth["authenticate.ts<br/>JWT Verify"]
        Authorize["authorize.ts<br/>Role Guard"]
        ErrorHandler["errorHandler.ts"]
    end

    subgraph Modules["Feature Modules (17 total)"]
        direction LR
        M1["auth/"]
        M2["products/"]
        M3["orders/"]
        M4["payments/"]
        M5["kds/"]
        M6["tables/"]
        M7["floors/"]
        M8["categories/"]
        M9["customers/"]
        M10["sessions/"]
        M11["coupons/"]
        M12["promotions/"]
        M13["selfOrder/"]
        M14["reports/"]
        M15["users/"]
        M16["employees/"]
        M17["orderItems/"]
    end

    subgraph ModuleStructure["Module Internal Structure"]
        Routes["routes/*.routes.ts"]
        Controller["controller/*.controller.ts"]
        Service["service/*.service.ts"]
        Repo["repository/*.repository.ts"]
        Schema["schema/*.schema.ts (Zod)"]
    end

    Entry --> App
    App --> Middleware
    App --> Modules
    Routes --> Controller
    Controller --> Service
    Service --> Repo
    Repo -->|Prisma Client| PG["PostgreSQL"]
```

---

## Database

| Technology | Version | Purpose | Why Chosen |
|-----------|---------|---------|------------|
| PostgreSQL | 12+ | Primary database | ACID compliance, complex queries |
| Prisma ORM | 6.x | ORM and migrations | Type-safe, schema-first, auto-complete |

### Data Flow

```mermaid
graph LR
    FE["Frontend<br/>React"]
    BE["Backend<br/>Express"]
    ORM["Prisma ORM<br/>Type-safe layer"]
    DB["PostgreSQL<br/>Database"]

    FE -->|"HTTP Request / JSON"| BE
    BE -->|"Prisma Query / TypeScript"| ORM
    ORM -->|"SQL Queries"| DB
    DB -->|"Raw Results"| ORM
    ORM -->|"Typed Objects"| BE
    BE -->|"HTTP Response / JSON"| FE
```

---

## Real-Time (Socket.IO)

### Event Architecture

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant SO as Socket.IO Server
    participant DB as Database

    Note over FE,DB: Kitchen Order Update
    FE->>SO: connect (with JWT)
    SO->>SO: Authenticate socket
    SO->>FE: connected

    FE->>SO: emit("kitchen:update", {orderId, status})
    SO->>DB: Update KitchenTicket status
    SO->>FE: broadcast("kitchen:status-changed", data)

    Note over FE,DB: Table Status Update
    FE->>SO: emit("table:status-change", {tableId, status})
    SO->>DB: Update Table status
    SO->>FE: broadcast("table:updated", data)
```

### Socket.IO Events Reference

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `kitchen:order-update` | Client to Server | `{orderId, status}` | Update kitchen ticket |
| `kitchen:status-changed` | Server to Client | `{ticket}` | Broadcast to all KDS screens |
| `table:status-change` | Client to Server | `{tableId, status}` | Update table status |
| `table:updated` | Server to Client | `{table}` | Broadcast to all POS terminals |
| `order:new` | Server to Client | `{order}` | New order created |
| `order:paid` | Server to Client | `{orderId}` | Order payment confirmed |

---

## Authentication Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant API as Express API
    participant DB as Database

    C->>API: POST /api/auth/login {email, password}
    API->>DB: Find user by email
    DB->>API: User record
    API->>API: bcrypt.compare(password, hash)
    API->>API: jwt.sign({userId, role}, JWT_SECRET)
    API->>C: {token, user}

    Note over C,API: Subsequent requests
    C->>API: GET /api/orders Authorization: Bearer <token>
    API->>API: jwt.verify(token, JWT_SECRET)
    API->>API: Check role permissions
    API->>DB: Execute query
    DB->>API: Data
    API->>C: JSON response
```

---

## Stack Decision Summary

```mermaid
mindmap
  root((Odoo Cafe POS Stack))
    Frontend
      React 19
      Vite
      Tailwind CSS
      Zustand
      TanStack Query
    Backend
      Node.js
      Express 5
      JWT Auth
      Zod Validation
    Data
      PostgreSQL
      Prisma ORM
    Realtime
      Socket.IO
      Kitchen Sync
      Table Sync
```

---

## Environment Configuration

### Backend (`.env`)

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/odoo_cafe
JWT_SECRET=your_super_secret_key
PORT=5000
NODE_ENV=development
```

### Frontend (`.env`)

```bash
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## Development Scripts

| Command | Location | Purpose |
|---------|----------|---------|
| `npm run dev` | `backend/` | Start backend with hot-reload |
| `npm run dev` | `frontend/` | Start Vite dev server |
| `npm run build` | `backend/` | Compile TypeScript |
| `npm run build` | `frontend/` | Build production bundle |
| `npx prisma migrate dev` | `backend/` | Apply schema migrations |
| `npx prisma studio` | `backend/` | Visual DB browser |
| `npx prisma generate` | `backend/` | Regenerate Prisma client |

---

*Previous: [Project Overview](./project-overview.md) | Next: [System Architecture](./system-architecture.md)*