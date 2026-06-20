# Database Schema

> Complete data model documentation for the Odoo Cafe POS system. Built with Prisma ORM on PostgreSQL. 14 models covering the full restaurant lifecycle.

---

## Entity Relationship Diagram (Full ERD)

```mermaid
erDiagram
    User {
        String id PK
        String name
        String email UK
        String password
        UserRole role
        DateTime createdAt
        DateTime updatedAt
    }

    Session {
        String id PK
        String userId FK
        SessionStatus status
        DateTime openedAt
        DateTime closedAt
    }

    Floor {
        String id PK
        String name
        DateTime createdAt
        DateTime updatedAt
    }

    Table {
        String id PK
        Int number
        Int seats
        TableStatus status
        String floorId FK
        DateTime createdAt
        DateTime updatedAt
    }

    SelfOrderToken {
        String id PK
        String token UK
        String tableId FK
        Boolean active
    }

    Category {
        String id PK
        String name
        String color
        DateTime createdAt
        DateTime updatedAt
    }

    Product {
        String id PK
        String name
        String description
        Float price
        Float tax
        Boolean isKitchenItem
        String categoryId FK
        DateTime createdAt
        DateTime updatedAt
    }

    Customer {
        String id PK
        String name
        String email
        String phone
        DateTime createdAt
    }

    Order {
        String id PK
        String sessionId FK
        String tableId FK
        String customerId FK
        OrderStatus status
        Float subtotal
        Float discount
        Float tax
        Float total
        DateTime createdAt
        DateTime updatedAt
    }

    OrderItem {
        String id PK
        String orderId FK
        String productId FK
        Int quantity
        Float price
        Float total
    }

    Payment {
        String id PK
        String orderId FK
        PaymentMethod method
        PaymentStatus status
        Float amount
        String transactionId
        DateTime paidAt
    }

    KitchenTicket {
        String id PK
        String orderId FK
        KitchenStatus status
        DateTime updatedAt
    }

    Coupon {
        String id PK
        String code UK
        Float discount
        Boolean active
    }

    Promotion {
        String id PK
        String name
        String description
        Float discount
        Boolean active
    }

    User ||--o{ Session : "has many"
    Session ||--o{ Order : "has many"
    Floor ||--o{ Table : "has many"
    Table ||--o{ Order : "has many"
    Table ||--o| SelfOrderToken : "has one"
    Category ||--o{ Product : "has many"
    Product ||--o{ OrderItem : "appears in"
    Order ||--o{ OrderItem : "has many"
    Order ||--o| Payment : "has one"
    Order ||--o| KitchenTicket : "has one"
    Customer ||--o{ Order : "places"
```

---

## Relationship Map

```mermaid
graph TD
    subgraph Auth["Auth and Staff"]
        User["User<br/>ADMIN/EMPLOYEE/KITCHEN"]
        Session["Session<br/>OPEN/CLOSED"]
    end

    subgraph Layout["Floor Layout"]
        Floor["Floor<br/>Ground, First..."]
        Table["Table<br/>AVAILABLE/OCCUPIED..."]
        SelfToken["SelfOrderToken<br/>QR Token"]
    end

    subgraph Catalog["Menu Catalog"]
        Category["Category<br/>Coffee, Food..."]
        Product["Product<br/>with price and tax"]
    end

    subgraph Transaction["Transaction"]
        Customer["Customer<br/>optional"]
        Order["Order<br/>DRAFT to PAID"]
        OrderItem["OrderItem<br/>line items"]
        Payment["Payment<br/>CASH/CARD/UPI"]
        KitchenTicket["KitchenTicket<br/>TO_COOK to COMPLETED"]
    end

    subgraph Discounts["Discounts"]
        Coupon["Coupon<br/>code-based"]
        Promotion["Promotion<br/>campaign-based"]
    end

    User -->|"1:N"| Session
    Session -->|"1:N"| Order
    Floor -->|"1:N"| Table
    Table -->|"1:N"| Order
    Table -->|"1:0-1"| SelfToken
    Category -->|"1:N"| Product
    Product -->|"1:N"| OrderItem
    Customer -->|"1:N"| Order
    Order -->|"1:N"| OrderItem
    Order -->|"1:0-1"| Payment
    Order -->|"1:0-1"| KitchenTicket
```

---

## Enumerations

```mermaid
graph LR
    subgraph Enums["All Enumerations"]

        subgraph UR["UserRole"]
            UR1["ADMIN"]
            UR2["EMPLOYEE"]
            UR3["KITCHEN"]
        end

        subgraph SS["SessionStatus"]
            SS1["OPEN"]
            SS2["CLOSED"]
        end

        subgraph TS["TableStatus"]
            TS1["AVAILABLE"]
            TS2["OCCUPIED"]
            TS3["RESERVED"]
            TS4["CLEANING"]
        end

        subgraph OS["OrderStatus"]
            OS1["DRAFT"]
            OS2["SENT_TO_KITCHEN"]
            OS3["PREPARING"]
            OS4["COMPLETED"]
            OS5["PAID"]
            OS6["CANCELLED"]
        end

        subgraph PM["PaymentMethod"]
            PM1["CASH"]
            PM2["CARD"]
            PM3["UPI"]
        end

        subgraph PS["PaymentStatus"]
            PS1["PENDING"]
            PS2["PAID"]
        end

        subgraph KS["KitchenStatus"]
            KS1["TO_COOK"]
            KS2["PREPARING"]
            KS3["COMPLETED"]
        end
    end
```

---

## Order Lifecycle State Machine

```mermaid
stateDiagram-v2
    [*] --> DRAFT : Order created

    DRAFT --> SENT_TO_KITCHEN : Waiter sends order
    DRAFT --> CANCELLED : Order cancelled

    SENT_TO_KITCHEN --> PREPARING : Kitchen starts
    SENT_TO_KITCHEN --> CANCELLED : Cancelled before cooking

    PREPARING --> COMPLETED : All items ready
    PREPARING --> CANCELLED : Cancelled mid-cook

    COMPLETED --> PAID : Payment processed

    PAID --> [*]
    CANCELLED --> [*]
```

---

## Table Lifecycle State Machine

```mermaid
stateDiagram-v2
    [*] --> AVAILABLE : Table created

    AVAILABLE --> OCCUPIED : Customer seated
    AVAILABLE --> RESERVED : Reservation made

    RESERVED --> OCCUPIED : Customer arrives
    RESERVED --> AVAILABLE : Reservation cancelled

    OCCUPIED --> CLEANING : Customer leaves / paid
    OCCUPIED --> AVAILABLE : Direct clear

    CLEANING --> AVAILABLE : Table cleaned
```

---

## Kitchen Ticket Lifecycle

```mermaid
stateDiagram-v2
    [*] --> TO_COOK : Order sent to kitchen

    TO_COOK --> PREPARING : Chef starts cooking

    PREPARING --> COMPLETED : Food is ready

    COMPLETED --> [*]
```

---

## Model Reference

### 1. User

| Field | Type | Constraint | Notes |
|-------|------|-----------|-------|
| `id` | String (UUID) | PK | Auto-generated |
| `name` | String | Required | Full name |
| `email` | String | Unique | Login identifier |
| `password` | String | Required | bcrypt hashed |
| `role` | UserRole | Required | ADMIN/EMPLOYEE/KITCHEN |
| `createdAt` | DateTime | Auto | Account creation |
| `updatedAt` | DateTime | Auto | Last modified |
| `sessions` | Session[] | — | Related sessions |

---

### 2. Category

| Field | Type | Constraint | Notes |
|-------|------|-----------|-------|
| `id` | String (UUID) | PK | — |
| `name` | String | Required | e.g. "Coffee", "Food" |
| `color` | String | Required | Hex color for UI |
| `products` | Product[] | — | Related products |
| `createdAt` | DateTime | Auto | — |
| `updatedAt` | DateTime | Auto | — |

---

### 3. Product

| Field | Type | Constraint | Notes |
|-------|------|-----------|-------|
| `id` | String (UUID) | PK | — |
| `name` | String | Required | Product name |
| `description` | String? | Optional | — |
| `price` | Float | Required | Selling price |
| `tax` | Float | Required | Tax percentage or amount |
| `isKitchenItem` | Boolean | Required | Send to KDS? |
| `categoryId` | String | FK to Category | — |
| `orderItems` | OrderItem[] | — | — |

---

### 4. Floor

| Field | Type | Constraint | Notes |
|-------|------|-----------|-------|
| `id` | String (UUID) | PK | — |
| `name` | String | Required | "Ground Floor", etc. |
| `tables` | Table[] | — | Related tables |

---

### 5. Table

| Field | Type | Constraint | Notes |
|-------|------|-----------|-------|
| `id` | String (UUID) | PK | — |
| `number` | Int | Required | Table number |
| `seats` | Int | Required | Seating capacity |
| `status` | TableStatus | Required | Current status |
| `floorId` | String | FK to Floor | — |
| `orders` | Order[] | — | — |
| `token` | SelfOrderToken? | — | QR token (optional) |

---

### 6. Session

| Field | Type | Constraint | Notes |
|-------|------|-----------|-------|
| `id` | String (UUID) | PK | — |
| `userId` | String | FK to User | — |
| `status` | SessionStatus | Required | OPEN or CLOSED |
| `openedAt` | DateTime | Required | Shift start |
| `closedAt` | DateTime? | Optional | Shift end |
| `orders` | Order[] | — | All orders in session |

---

### 7. Customer

| Field | Type | Constraint | Notes |
|-------|------|-----------|-------|
| `id` | String (UUID) | PK | — |
| `name` | String | Required | — |
| `email` | String? | Optional | — |
| `phone` | String? | Optional | — |
| `orders` | Order[] | — | Purchase history |

---

### 8. Order (Core model)

| Field | Type | Constraint | Notes |
|-------|------|-----------|-------|
| `id` | String (UUID) | PK | — |
| `sessionId` | String | FK to Session | Audit trail |
| `tableId` | String | FK to Table | — |
| `customerId` | String? | FK to Customer | Optional |
| `status` | OrderStatus | Required | State machine |
| `subtotal` | Float | Required | Pre-tax/discount |
| `discount` | Float | Required | Applied discount |
| `tax` | Float | Required | Calculated tax |
| `total` | Float | Required | Final amount |
| `items` | OrderItem[] | — | Line items |
| `payment` | Payment? | — | Payment record |
| `kitchenTicket` | KitchenTicket? | — | KDS ticket |

---

### 9. OrderItem

| Field | Type | Constraint | Notes |
|-------|------|-----------|-------|
| `id` | String (UUID) | PK | — |
| `orderId` | String | FK to Order | — |
| `productId` | String | FK to Product | — |
| `quantity` | Int | Required | Number ordered |
| `price` | Float | Required | Price at time of order |
| `total` | Float | Required | quantity times price |

---

### 10. Payment

| Field | Type | Constraint | Notes |
|-------|------|-----------|-------|
| `id` | String (UUID) | PK | — |
| `orderId` | String | FK to Order, Unique | 1-to-1 |
| `method` | PaymentMethod | Required | CASH/CARD/UPI |
| `status` | PaymentStatus | Required | PENDING/PAID |
| `amount` | Float | Required | Total paid |
| `transactionId` | String? | Optional | Card/UPI reference |
| `paidAt` | DateTime? | Optional | Payment timestamp |

---

### 11. KitchenTicket

| Field | Type | Constraint | Notes |
|-------|------|-----------|-------|
| `id` | String (UUID) | PK | — |
| `orderId` | String | FK to Order, Unique | 1-to-1 |
| `status` | KitchenStatus | Required | TO_COOK/PREPARING/COMPLETED |
| `updatedAt` | DateTime | Auto | Last status change |

---

### 12. SelfOrderToken

| Field | Type | Constraint | Notes |
|-------|------|-----------|-------|
| `id` | String (UUID) | PK | — |
| `token` | String | Unique | QR token value |
| `tableId` | String | FK to Table, Unique | 1-to-1 per table |
| `active` | Boolean | Required | Is QR valid |

---

### 13. Coupon

| Field | Type | Constraint | Notes |
|-------|------|-----------|-------|
| `id` | String (UUID) | PK | — |
| `code` | String | Unique | e.g. "SAVE20" |
| `discount` | Float | Required | Percentage or fixed amount |
| `active` | Boolean | Required | Is it valid |

---

### 14. Promotion

| Field | Type | Constraint | Notes |
|-------|------|-----------|-------|
| `id` | String (UUID) | PK | — |
| `name` | String | Required | Campaign name |
| `description` | String? | Optional | — |
| `discount` | Float | Required | Percentage or fixed amount |
| `active` | Boolean | Required | Is running |

---

## Key Design Decisions

```mermaid
graph TD
    D1["UUID Primary Keys<br/>Better for distributed systems<br/>No sequential ID exposure"]
    D2["Session Model<br/>Tracks shift start/end<br/>Enables per-shift reconciliation"]
    D3["Order to Session, not User<br/>Audit trail: who took order, when<br/>No direct User to Order coupling"]
    D4["KitchenTicket Separate<br/>Decouples order management from kitchen workflow<br/>KDS-specific state machine"]
    D5["SelfOrderToken 1:1 per Table<br/>One active QR per table at a time<br/>Regeneration invalidates old token"]
    D6["Coupon vs Promotion<br/>Coupon = user enters code<br/>Promotion = auto-applied"]
    D7["Customer Optional<br/>Walk-in orders do not need a customer<br/>Only used for loyalty/delivery"]
    D8["Price snapshot in OrderItem<br/>Protects against retroactive price changes<br/>Historical accuracy"]
```

---

## Relationships Summary Table

| From | To | Cardinality | Foreign Key | Notes |
|------|----|------------|-------------|-------|
| User | Session | 1 : N | `session.userId` | One user, many shifts |
| Session | Order | 1 : N | `order.sessionId` | One session, many orders |
| Floor | Table | 1 : N | `table.floorId` | One floor, many tables |
| Table | Order | 1 : N | `order.tableId` | One table, many orders (over time) |
| Table | SelfOrderToken | 1 : 0-1 | `token.tableId` (unique) | Optional QR per table |
| Category | Product | 1 : N | `product.categoryId` | One category, many products |
| Product | OrderItem | 1 : N | `orderItem.productId` | Product in many orders |
| Order | OrderItem | 1 : N | `orderItem.orderId` | One order, many line items |
| Order | Payment | 1 : 0-1 | `payment.orderId` (unique) | Optional payment record |
| Order | KitchenTicket | 1 : 0-1 | `ticket.orderId` (unique) | Optional kitchen ticket |
| Customer | Order | 1 : N | `order.customerId` | Optional customer per order |

---

*Previous: [System Architecture](./system-architecture.md) | Next: [Project Flow](./project-flow.md)*