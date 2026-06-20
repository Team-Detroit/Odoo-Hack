# System Architecture

> A complete architectural overview of the Odoo Cafe POS system — how all components connect and communicate.

---

## High-Level Architecture

```mermaid
graph TB
    subgraph Users["User Interfaces"]
        Admin["Admin<br/>Browser"]
        Waiter["Waiter<br/>Browser / Tablet"]
        Kitchen["Kitchen Staff<br/>KDS Screen"]
        Customer["Customer<br/>Smartphone QR"]
    end

    subgraph Frontend["Frontend — React + Vite (Port 5173)"]
        direction TB
        AdminPage["Admin Dashboard<br/>/admin/*"]
        POSPage["POS Terminal<br/>/pos/*"]
        KDSPage["Kitchen Display<br/>/kds"]
        SelfOrderPage["Self-Order Portal<br/>/self-ordering/:token"]
        CustDisplay["Customer Display<br/>/customer-display"]
    end

    subgraph Backend["Backend — Node.js + Express (Port 5000)"]
        direction TB
        RestAPI["REST API<br/>/api/*"]
        SocketIO["Socket.IO<br/>WebSocket Server"]
        Middleware["Middleware<br/>JWT Auth + Role Guard"]
        Modules["17 Feature Modules<br/>auth, orders, products, payments..."]
    end

    subgraph DataLayer["Data Layer"]
        Prisma["Prisma ORM"]
        PostgreSQL["PostgreSQL Database"]
    end

    Admin --> AdminPage
    Waiter --> POSPage
    Kitchen --> KDSPage
    Customer --> SelfOrderPage

    AdminPage -->|"HTTP + REST"| RestAPI
    POSPage -->|"HTTP + REST"| RestAPI
    KDSPage -->|"HTTP + REST"| RestAPI
    SelfOrderPage -->|"HTTP + REST"| RestAPI

    POSPage <-->|"WebSocket"| SocketIO
    KDSPage <-->|"WebSocket"| SocketIO

    RestAPI --> Middleware
    Middleware --> Modules
    Modules --> Prisma
    SocketIO --> Prisma
    Prisma --> PostgreSQL
```

---

## Component Breakdown

### Frontend Components

```mermaid
graph TD
    subgraph FE["Frontend Application"]
        Router["React Router v7<br/>Client-Side Routing"]

        subgraph PageRoutes["Page Routes"]
            R1["/auth/login"]
            R2["/admin/*"]
            R3["/pos/*"]
            R4["/kds"]
            R5["/self-ordering/:token"]
            R6["/customer-display"]
        end

        subgraph StateManagement["State Management"]
            Zustand["Zustand Stores<br/>authStore, orderStore<br/>tableStore, cartStore"]
            TanStack["TanStack Query<br/>Server State Cache"]
        end

        subgraph Communication["API Communication"]
            AxiosInst["Axios Instance<br/>+ JWT Interceptor"]
            SocketClient["Socket.IO Client<br/>Real-time events"]
        end
    end

    Router --> PageRoutes
    PageRoutes --> StateManagement
    PageRoutes --> Communication
    AxiosInst -->|"Injects Bearer token"| API["Backend API"]
    SocketClient <-->|"Bidirectional"| WS["Backend Socket.IO"]
```

### Backend Module Structure

```mermaid
graph TD
    subgraph Module["Feature Module Pattern"]
        Route["routes/<br/>module.routes.ts<br/>Defines HTTP endpoints<br/>Applies auth middleware"]
        Controller["controller/<br/>module.controller.ts<br/>Handles request/response<br/>Calls service layer"]
        Service["service/<br/>module.service.ts<br/>Business logic<br/>Orchestrates operations"]
        Repository["repository/<br/>module.repository.ts<br/>Data access<br/>Prisma queries only"]
        Schema["schema/<br/>module.schema.ts<br/>Zod validation schemas<br/>Request body types"]
    end

    HTTP["HTTP Request"] --> Route
    Route --> Controller
    Controller --> Service
    Service --> Repository
    Repository --> DB["Prisma to PostgreSQL"]
```

---

## Data Flow Diagrams

### REST API Request Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant MW as Middleware
    participant Ctrl as Controller
    participant Svc as Service
    participant Repo as Repository
    participant DB as PostgreSQL

    C->>MW: HTTP Request + JWT
    MW->>MW: Verify JWT token
    MW->>MW: Check role permissions
    MW->>Ctrl: Forward request (req, res)
    Ctrl->>Ctrl: Parse and validate body (Zod)
    Ctrl->>Svc: Call service method
    Svc->>Svc: Apply business logic
    Svc->>Repo: Data query
    Repo->>DB: Prisma SQL query
    DB->>Repo: Raw data
    Repo->>Svc: Typed Prisma objects
    Svc->>Ctrl: Processed result
    Ctrl->>C: JSON response {success, data}
```

### Real-Time Event Flow

```mermaid
sequenceDiagram
    participant POS as POS Terminal
    participant SIO as Socket.IO Server
    participant DB as Database
    participant KDS as Kitchen Display

    Note over POS,KDS: Order sent to kitchen
    POS->>SIO: emit("order:send-to-kitchen", {orderId})
    SIO->>DB: Create KitchenTicket (TO_COOK)
    SIO->>DB: Update Order status to SENT_TO_KITCHEN
    SIO->>KDS: broadcast("kitchen:new-ticket", {ticket})
    KDS->>KDS: Display new ticket

    Note over POS,KDS: Kitchen starts preparing
    KDS->>SIO: emit("kitchen:start", {ticketId})
    SIO->>DB: Update KitchenTicket to PREPARING
    SIO->>POS: broadcast("kitchen:status-changed", {ticketId, status})

    Note over POS,KDS: Food ready
    KDS->>SIO: emit("kitchen:complete", {ticketId})
    SIO->>DB: Update KitchenTicket to COMPLETED
    SIO->>DB: Update Order to COMPLETED
    SIO->>POS: broadcast("order:ready", {orderId})
    POS->>POS: Notify waiter
```

---

## Complete Project Structure

```
Odoo-Hack/
├── backend/
│   ├── src/
│   │   ├── app.ts                    # Express app + all routes
│   │   ├── server.ts                 # HTTP server + Socket.IO init
│   │   ├── modules/                  # Feature modules (17 total)
│   │   │   ├── auth/                 # Login, register, JWT
│   │   │   ├── users/                # User CRUD
│   │   │   ├── employees/            # Employee management
│   │   │   ├── products/             # Menu items
│   │   │   ├── categories/           # Product categories
│   │   │   ├── floors/               # Floor layout
│   │   │   ├── tables/               # Table management
│   │   │   ├── customers/            # Customer records
│   │   │   ├── sessions/             # Staff sessions
│   │   │   ├── orders/               # Order management
│   │   │   ├── orderItems/           # Order line items
│   │   │   ├── payments/             # Payment processing
│   │   │   ├── kds/                  # Kitchen Display
│   │   │   ├── coupons/              # Discount codes
│   │   │   ├── promotions/           # Campaigns
│   │   │   ├── selfOrder/            # QR self-ordering
│   │   │   └── reports/              # Analytics
│   │   ├── database/
│   │   │   └── prisma/
│   │   │       └── schema.prisma     # 14 Prisma models
│   │   └── shared/
│   │       ├── enums/                # Shared enumerations
│   │       ├── interfaces/           # Shared TypeScript types
│   │       └── validators/           # Shared Zod schemas
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx                   # Root + Router setup
│   │   ├── main.tsx                  # Entry point
│   │   ├── pages/
│   │   │   ├── auth/                 # Login page
│   │   │   ├── admin/                # Admin dashboard
│   │   │   ├── pos/                  # POS terminal
│   │   │   ├── kds/                  # Kitchen display
│   │   │   ├── self-ordering/        # QR portal
│   │   │   └── customer-display/     # Customer screen
│   │   ├── components/               # Reusable UI
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── store/                    # Zustand stores
│   │   ├── services/                 # API service functions
│   │   ├── types/                    # TypeScript types
│   │   ├── lib/                      # Utilities
│   │   ├── routes/                   # Route definitions
│   │   ├── layouts/                  # Layout components
│   │   └── constants/                # App constants
│   ├── vite.config.ts
│   └── package.json
│
└── docs/
    ├── README.md
    ├── project-overview.md
    ├── tech-stack.md
    ├── system-architecture.md        <- You are here
    ├── database-schema.md
    ├── project-flow.md
    └── features.md
```

---

## API Architecture

### Route Namespacing

All API routes are mounted under `/api`:

```mermaid
graph LR
    Base["/api"] --> Auth["/auth<br/>POST /login<br/>POST /register<br/>GET /me"]
    Base --> Products["/products<br/>GET, POST, PUT, DELETE"]
    Base --> Categories["/categories<br/>GET, POST, PUT, DELETE"]
    Base --> Floors["/floors<br/>GET, POST, PUT, DELETE"]
    Base --> Tables["/tables<br/>GET, POST, PUT, DELETE"]
    Base --> Orders["/orders<br/>GET, POST, PUT, DELETE"]
    Base --> OrderItems["/order-items<br/>GET, POST, PUT, DELETE"]
    Base --> Payments["/payments<br/>GET, POST"]
    Base --> KDS["/kds<br/>GET tickets<br/>PUT status"]
    Base --> Sessions["/sessions<br/>GET, POST, PUT"]
    Base --> SelfOrder["/self-order<br/>GET, POST"]
    Base --> Reports["/reports<br/>GET sales, summary"]
    Base --> Coupons["/coupons<br/>GET, POST, PUT"]
    Base --> Promotions["/promotions<br/>GET, POST, PUT"]
    Base --> Users["/users<br/>GET, PUT, DELETE"]
    Base --> Customers["/customers<br/>GET, POST, PUT"]
    Base --> Employees["/employees<br/>GET, POST, PUT"]
```

---

## Security Architecture

```mermaid
graph TD
    Request["Incoming HTTP Request"]

    Request --> Helmet["Helmet<br/>Security Headers"]
    Helmet --> CORS["CORS<br/>Origin Validation"]
    CORS --> Morgan["Morgan<br/>Request Logging"]
    Morgan --> AuthCheck{Is route public?}

    AuthCheck -->|Yes - Login/Register| Public["Public Route<br/>No auth needed"]
    AuthCheck -->|No| JWTVerify["JWT Verification<br/>authenticate middleware"]

    JWTVerify -->|Invalid| Reject["401 Unauthorized"]
    JWTVerify -->|Valid| RoleCheck["Role Check<br/>authorize middleware"]

    RoleCheck -->|Insufficient| Forbidden["403 Forbidden"]
    RoleCheck -->|Authorized| ZodValidate["Zod Schema<br/>Input Validation"]

    ZodValidate -->|Invalid| BadRequest["400 Bad Request"]
    ZodValidate -->|Valid| Controller["Controller<br/>Process Request"]
```

---

## Deployment Architecture

```mermaid
graph TB
    subgraph Cloud["Cloud Deployment"]
        subgraph FrontendDeploy["Frontend (Vercel/Netlify)"]
            StaticBuild["React Static Build<br/>dist/ folder"]
        end

        subgraph BackendDeploy["Backend (Render/Railway)"]
            NodeServer["Node.js Server<br/>Port 5000"]
        end

        subgraph DBDeploy["Database (Neon/Heroku PG)"]
            PGCloud["PostgreSQL<br/>Managed Instance"]
        end
    end

    Browser["Browser"] -->|"HTTPS"| StaticBuild
    StaticBuild -->|"REST API"| NodeServer
    StaticBuild <-->|"WebSocket WSS"| NodeServer
    NodeServer -->|"Prisma Connection / SSL"| PGCloud
```

---

*Previous: [Tech Stack](./tech-stack.md) | Next: [Database Schema](./database-schema.md)*