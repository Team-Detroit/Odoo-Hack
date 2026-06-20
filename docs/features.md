# Features

> Detailed breakdown of all major features in the Odoo Cafe POS system — what each does, who uses it, and how it works technically.

---

## Feature Map

```mermaid
mindmap
  root((Odoo Cafe POS))
    Auth
      JWT Login
      Role-based Access
      Session Management
    POS Terminal
      Table Selection
      Order Builder
      Item Modification
      Coupon/Promo
      Bill Split
    Kitchen Display
      Live Ticket Feed
      Status Updates
      Order Details
      Priority Sorting
    Floor Editor
      Multi-floor
      Table CRUD
      Visual Layout
      QR Generation
    Admin Panel
      Menu Management
      Staff Management
      Reports and Analytics
      Discount Management
    Self-Ordering
      QR Code Scan
      Customer Menu
      Cart and Checkout
      Order Tracking
    Payments
      Cash
      Card
      UPI
      Receipt
    Reports
      Sales Summary
      Category Breakdown
      Staff Performance
      Daily Reconciliation
```

---

## 1. Authentication and Authorization

### Overview

Secure JWT-based authentication with role-based access control for all system users.

```mermaid
graph LR
    subgraph Login["Login Flow"]
        Form["Login Form<br/>email + password"]
        API["POST /api/auth/login"]
        JWT["JWT Token<br/>signed, 24h expiry"]
        Store["Stored in<br/>localStorage"]
    end

    subgraph Interceptor["All Subsequent Requests"]
        Header["Authorization: Bearer {token}"]
        Verify["Backend verifies JWT"]
        RoleCheck["Role permission check"]
    end

    Form --> API --> JWT --> Store
    Store --> Header --> Verify --> RoleCheck
```

### Features

| Feature | Description |
|---------|-------------|
| JWT Authentication | Stateless tokens, 24-hour expiry |
| Role Guard | Middleware enforces role permissions per route |
| Auto Redirect | 401 responses redirect to login |
| Token Injection | Axios interceptor adds JWT to every request |
| Password Hashing | bcrypt with salt rounds for secure storage |
| Protected Routes | React Router guards for client-side protection |

### Who Can Access What

```mermaid
graph TD
    subgraph Routes["Route Access Control"]
        AdminRoutes["/admin/*<br/>ADMIN only"]
        POSRoutes["/pos/*<br/>ADMIN + EMPLOYEE"]
        KDSRoutes["/kds<br/>All roles"]
        SelfRoutes["/self-ordering/*<br/>Public, no auth"]
    end
```

---

## 2. POS Terminal

### Overview

The primary interface for waitstaff — a full-featured point-of-sale terminal for managing tables, taking orders, and processing payments.

```mermaid
graph TD
    subgraph POS["POS Terminal"]
        FloorMap["Floor Map View<br/>Visual table grid<br/>Color-coded status"]
        TableSelect["Select Table<br/>OCCUPIED marker set"]
        OrderPanel["Order Panel<br/>Split: Menu | Cart"]
        MenuBrowse["Menu Browser<br/>Categories to Products"]
        CartView["Cart<br/>Items, qty, prices"]
        OrderActions["Order Actions<br/>Send to Kitchen<br/>Hold Order<br/>Cancel"]
        PayScreen["Payment Screen<br/>Total breakdown"]
    end

    FloorMap --> TableSelect
    TableSelect --> OrderPanel
    OrderPanel --> MenuBrowse
    OrderPanel --> CartView
    MenuBrowse -->|Add item| CartView
    CartView --> OrderActions
    OrderActions --> PayScreen
```

### Key Features

| Feature | Detail |
|---------|--------|
| Table Floor View | Color-coded tables by status (green=free, red=occupied, yellow=reserved) |
| Dual-pane UI | Left: menu browse, Right: current order cart |
| Category Filter | Filter menu by category (Coffee, Food, Drinks, etc.) |
| Quick Add | One-click add items to order |
| Quantity Adjust | + / - buttons for item quantities |
| Order Notes | Add special instructions per item |
| Coupon Code | Enter coupon code for discount |
| Live Totals | Subtotal, tax, discount, final total auto-calculate |
| Send to Kitchen | One-click send — updates order + creates KDS ticket |
| Hold Order | Save draft, attend to another table |
| Split Bill | Divide payment among multiple customers |
| Receipt Print | Generate printable receipt |

---

## 3. Kitchen Display System (KDS)

### Overview

A dedicated screen for kitchen staff showing all incoming orders in real-time with the ability to update preparation status.

```mermaid
graph TD
    subgraph KDS["Kitchen Display Screen"]
        subgraph T1["Order #42 - Table 5 - 8 min"]
            T1I["Espresso Double x2<br/>Avocado Toast x1"]
            T1S["[START] Waiting"]
        end

        subgraph T2["Order #43 - Table 2 - 3 min"]
            T2I["Cappuccino x1<br/>Club Sandwich x1"]
            T2S["[DONE] Preparing"]
        end

        subgraph T3["Order #44 - Table 7 - 1 min"]
            T3I["Latte x3"]
            T3S["Completed"]
        end
    end

    NewTicket["New order arrives<br/>via Socket.IO"] --> T1
```

### Real-Time Update Flow

```mermaid
sequenceDiagram
    participant POS as POS Terminal
    participant SIO as Socket.IO
    participant KDS as Kitchen Display

    POS->>SIO: Order sent (emit: kitchen:new-ticket)
    SIO->>KDS: Broadcast new ticket
    KDS->>KDS: Display ticket (TO_COOK)

    Note over KDS: Chef clicks "START"
    KDS->>SIO: emit(kitchen:start, {ticketId})
    SIO->>KDS: Update status (PREPARING)
    SIO->>POS: Notify POS

    Note over KDS: Chef clicks "DONE"
    KDS->>SIO: emit(kitchen:complete, {ticketId})
    SIO->>KDS: Remove / mark done (COMPLETED)
    SIO->>POS: Order ready notification
```

### Features

| Feature | Detail |
|---------|--------|
| Live Ticket Feed | Real-time via Socket.IO — no refresh needed |
| Status Buttons | START to PREPARING, DONE to COMPLETED |
| Ticket Timer | Shows how long each ticket has been waiting |
| Item Count | Clear quantity display per item |
| Priority Sorting | Oldest tickets appear first |
| Audio Alert | Sound notification for new tickets |
| Completed Archive | Recent completed orders viewable briefly |
| Kitchen-Only Items | Only products with `isKitchenItem: true` shown |

---

## 4. Floor Editor (Admin)

### Overview

An admin tool for configuring the physical restaurant layout — floors, tables, and QR code generation.

```mermaid
graph TD
    subgraph FloorEditor["Floor Editor"]
        FloorList["Floor List<br/>Ground Floor<br/>First Floor<br/>Rooftop"]
        FloorSelect["Select Floor"]
        TableGrid["Visual Table Grid"]

        subgraph TableOps["Table Operations"]
            AddTable["Add Table<br/>number, seats"]
            EditTable["Edit Table"]
            DeleteTable["Delete Table"]
            GenQR["Generate QR<br/>SelfOrderToken"]
        end
    end

    FloorList --> FloorSelect
    FloorSelect --> TableGrid
    TableGrid --> TableOps
```

### Features

| Feature | Detail |
|---------|--------|
| Multi-Floor Support | Unlimited floors (Ground, First, Rooftop, etc.) |
| Table CRUD | Add/edit/delete tables with number and seat count |
| Visual Grid | See all tables at a glance |
| Table Status View | Real-time color-coded status (live data) |
| QR Generation | Generate per-table QR codes for self-ordering |
| QR Invalidation | Regenerating a QR invalidates the old one |
| Seat Capacity | Set number of seats per table |

---

## 5. Self-Ordering Portal

### Overview

A customer-facing web page (no app install required) accessed by scanning the table QR code. Customers can browse the menu and place orders directly.

```mermaid
graph TD
    subgraph SelfOrder["Self-Ordering Portal (Public, no login)"]
        QR["Scan QR code<br/>at table"]
        MenuPage["Menu Browser<br/>Grouped by category"]
        Cart["Cart<br/>Item quantities"]
        Checkout["Checkout<br/>Confirm order"]
        Confirm["Order placed<br/>Estimated time"]
    end

    QR -->|"/self-ordering/{token}"| MenuPage
    MenuPage --> Cart
    Cart --> Checkout
    Checkout -->|"POST /api/self-order"| Confirm
    Confirm -->|"Socket.IO to KDS"| Kitchen["Kitchen"]
```

### Features

| Feature | Detail |
|---------|--------|
| No Login Required | Customers access via QR only |
| Token Validation | Each QR token tied to a specific table |
| Full Menu Browse | Categories, products, descriptions, prices |
| Cart Management | Add/remove items, adjust quantities |
| Real-Time Confirmation | Instant order confirmation screen |
| Kitchen Integration | Order goes directly to KDS via Socket.IO |
| Mobile Optimized | Responsive design for smartphones |

---

## 6. Admin Dashboard

### Overview

Central management hub for administrators to control every aspect of the system.

```mermaid
graph TD
    AdminDash["Admin Dashboard"] --> Sections

    subgraph Sections["Dashboard Sections"]
        subgraph Menu["Menu Management"]
            Cat["Categories<br/>name, color"]
            Prod["Products<br/>name, price, tax, isKitchenItem"]
        end

        subgraph Staff["Staff Management"]
            Users["User Accounts<br/>ADMIN / EMPLOYEE / KITCHEN"]
            Employees["Employee Records"]
        end

        subgraph Layout["Floor and Tables"]
            Floors["Floors<br/>Create / rename"]
            Tables["Tables<br/>Add / configure / QR"]
        end

        subgraph Discounts["Promotions"]
            Coupons["Coupon Codes<br/>SAVE20, HAPPY10..."]
            Promos["Promotions<br/>Happy Hour, Weekend Deal..."]
        end

        subgraph Analytics["Reports"]
            Sales["Sales Summary<br/>By date range"]
            Category["By Category"]
            Employee["By Employee"]
            TopSellers["Top Selling Items"]
        end
    end
```

### Features

| Module | Features |
|--------|---------|
| Menu Management | CRUD for categories (with color), products (price, tax, kitchen flag) |
| Staff Management | Create/edit/deactivate staff accounts, assign roles |
| Floor Management | Multi-floor layout, table configuration |
| Coupon Management | Create/activate/deactivate coupon codes with discount amounts |
| Promotion Management | Campaign-based auto-applied discounts |
| Sales Reports | Revenue by date, category, employee, time-of-day |
| Session Review | Review all sessions by staff member |

---

## 7. Payment Processing

### Overview

Multi-method payment processing with full audit trail and receipt generation.

```mermaid
graph LR
    subgraph Methods["Payment Methods"]
        Cash["Cash<br/>Enter amount<br/>Show change"]
        Card["Card<br/>Enter transaction ID<br/>External terminal"]
        UPI["UPI<br/>Show QR / UPI ID<br/>Confirm manually"]
    end

    Methods --> Payment["Create Payment Record<br/>PENDING to PAID"]
    Payment --> OrderPaid["Order to PAID"]
    OrderPaid --> TableFree["Table to AVAILABLE"]
    TableFree --> Receipt["Receipt Generated"]
```

### Features

| Feature | Detail |
|---------|--------|
| Cash | Enter received amount, calculate and display change |
| Card | Record transaction ID from external card terminal |
| UPI | Display UPI QR/ID, manual confirmation |
| Discount Application | Coupon/promotion applied before total |
| Tax Calculation | Per-product tax rates computed automatically |
| Receipt | Itemized receipt with taxes, discounts, totals |
| Payment History | All payments stored with method, amount, timestamp |
| Refund Note | Manual refund process via admin |

---

## 8. Reports and Analytics

### Overview

Business intelligence for administrators — track revenue, popular items, and staff performance.

```mermaid
graph TD
    subgraph Reports["Reports Dashboard"]
        subgraph DateFilter["Date Filter"]
            Today["Today"]
            Week["This Week"]
            Month["This Month"]
            Custom["Custom Range"]
        end

        subgraph Charts["Report Types"]
            Sales["Total Sales<br/>Revenue over time"]
            Category["By Category<br/>Which categories earn most"]
            TopItems["Top Items<br/>Best-selling products"]
            Staff["By Employee<br/>Orders per staff member"]
            Sessions["Sessions<br/>Shift reconciliation"]
            Payment["By Payment Method<br/>Cash vs Card vs UPI"]
        end
    end

    DateFilter --> Charts
```

### Key Metrics

| Metric | Description |
|--------|-------------|
| Total Revenue | Sum of all paid orders in period |
| Order Count | Number of completed orders |
| Average Order Value | Revenue divided by order count |
| Top Products | Ranked by quantity sold |
| Category Breakdown | Revenue percentage by menu category |
| Staff Performance | Orders taken per employee per session |
| Peak Hours | Orders by hour of day |
| Payment Mix | Cash / Card / UPI ratio |

---

## 9. Real-Time Notifications

### Overview

Socket.IO-powered live updates that keep all terminals synchronized without page refreshes.

```mermaid
graph TD
    subgraph Events["Socket.IO Event Bus"]
        subgraph ServerEmits["Server to Client"]
            E1["kitchen:new-ticket<br/>New order for KDS"]
            E2["kitchen:status-changed<br/>Ticket status update"]
            E3["order:ready<br/>Food ready notification"]
            E4["order:paid<br/>Payment confirmed"]
            E5["table:updated<br/>Table status changed"]
        end

        subgraph ClientEmits["Client to Server"]
            C1["kitchen:start<br/>Begin preparing"]
            C2["kitchen:complete<br/>Food ready"]
            C3["table:status-change<br/>Update table"]
            C4["order:send-to-kitchen<br/>New order"]
        end
    end

    POS["POS"] <-->|WebSocket| Events
    KDS["KDS"] <-->|WebSocket| Events
    Admin["Admin"] <-->|WebSocket| Events
```

---

## Feature Implementation Status

| Feature | Backend | Frontend | Real-Time | Status |
|---------|:-------:|:--------:|:---------:|--------|
| Auth (Login/JWT) | Done | Done | — | Ready |
| POS Terminal | Done | Done | Done | Ready |
| Kitchen Display | Done | Done | Done | Ready |
| Floor Editor | Done | Done | — | Ready |
| Self-Ordering | Done | Done | Done | Ready |
| Admin Dashboard | Done | Done | — | Ready |
| Payment Processing | Done | Done | Done | Ready |
| Reports | Done | Done | — | Ready |
| Coupon/Promo | Done | Done | — | Ready |
| Customer Display | Done | Done | Done | In Progress |
| Deployment Config | — | — | — | Pending |

---

*Previous: [Project Flow](./project-flow.md) | Back to: [README](./README.md)*
