# Database Schema - Cafe POS System

## Overview

This document defines the core data model for the Odoo Cafe POS system. The schema is built around the restaurant lifecycle: User → Session → Table → Order → Payment.

**Total Models: 14** (Core: 10, Supporting: 4)

---

## Entity Relationship Diagram

### Core User & Session Flow
```
User (ADMIN, EMPLOYEE, KITCHEN)
  ↓
  └─→ Session (OPEN, CLOSED)
        ↓
        └─→ Order (DRAFT → SENT_TO_KITCHEN → PREPARING → COMPLETED → PAID)
              ├─→ OrderItem (line items)
              ├─→ Payment (CASH, CARD, UPI)
              ├─→ KitchenTicket (TO_COOK, PREPARING, COMPLETED)
              └─→ Customer (optional, for loyalty/delivery)
```

### Table Management
```
Floor
  ↓
  └─→ Table (AVAILABLE, OCCUPIED, RESERVED, CLEANING)
        └─→ Order
        └─→ SelfOrderToken (for QR scanning)
```

### Catalog
```
Category
  ↓
  └─→ Product (with tax, kitchen flag)
        ↓
        └─→ OrderItem
```

### Promotions
```
Coupon (percentage discount)
Promotion (campaign-based discount)
```

---

## Enumerations

### UserRole
- `ADMIN`: Full system access
- `EMPLOYEE`: Can take orders, manage tables
- `KITCHEN`: View kitchen tickets only

### SessionStatus
- `OPEN`: Staff is actively using the system
- `CLOSED`: End-of-day reconciliation complete

### TableStatus
- `AVAILABLE`: Ready for customers
- `OCCUPIED`: Customer seated
- `RESERVED`: Reserved but not seated
- `CLEANING`: Being cleaned

### OrderStatus
- `DRAFT`: Order being built
- `SENT_TO_KITCHEN`: Sent to KDS
- `PREPARING`: Kitchen is preparing
- `COMPLETED`: All items ready
- `PAID`: Payment received
- `CANCELLED`: Order cancelled

### PaymentMethod
- `CASH`
- `CARD`
- `UPI`

### PaymentStatus
- `PENDING`: Waiting for payment
- `PAID`: Successfully paid

### KitchenStatus
- `TO_COOK`: Not yet started
- `PREPARING`: In progress
- `COMPLETED`: Ready for pickup

---

## 14 Core Models

### 1. User
**Role**: Authentication & Authorization

| Field | Type | Notes |
|-------|------|-------|
| id | String (UUID) | Primary key |
| name | String | User's full name |
| email | String | Unique, for login |
| password | String | Hashed password |
| role | UserRole | ADMIN, EMPLOYEE, KITCHEN |
| createdAt | DateTime | Account creation |
| updatedAt | DateTime | Last update |
| sessions | Session[] | 1-to-many relation |

---

### 2. Category
**Role**: Product taxonomy

| Field | Type | Notes |
|-------|------|-------|
| id | String (UUID) | Primary key |
| name | String | Category name (Coffee, Food, etc.) |
| color | String | UI color code |
| products | Product[] | 1-to-many relation |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update |

---

### 3. Product
**Role**: Menu items sold in the cafe

| Field | Type | Notes |
|-------|------|-------|
| id | String (UUID) | Primary key |
| name | String | Product name |
| description | String? | Optional description |
| price | Float | Selling price |
| tax | Float | Tax percentage or amount |
| isKitchenItem | Boolean | True if kitchen prepares it |
| categoryId | String | Foreign key to Category |
| category | Category | Relation |
| orderItems | OrderItem[] | 1-to-many relation |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update |

---

### 4. Floor
**Role**: Restaurant floor layout

| Field | Type | Notes |
|-------|------|-------|
| id | String (UUID) | Primary key |
| name | String | Floor name (Ground, First, etc.) |
| tables | Table[] | 1-to-many relation |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update |

---

### 5. Table
**Role**: Seating arrangement

| Field | Type | Notes |
|-------|------|-------|
| id | String (UUID) | Primary key |
| number | Int | Table number |
| seats | Int | Seating capacity |
| status | TableStatus | Current status |
| floorId | String | Foreign key to Floor |
| floor | Floor | Relation |
| orders | Order[] | 1-to-many relation |
| token | SelfOrderToken? | 0-or-1 relation for QR ordering |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update |

---

### 6. Session
**Role**: Staff work session tracking

| Field | Type | Notes |
|-------|------|-------|
| id | String (UUID) | Primary key |
| userId | String | Foreign key to User |
| user | User | Relation |
| status | SessionStatus | OPEN or CLOSED |
| openedAt | DateTime | Session start |
| closedAt | DateTime? | Session end (nullable) |
| orders | Order[] | 1-to-many relation |

---

### 7. Customer
**Role**: Customer information for repeat orders/loyalty

| Field | Type | Notes |
|-------|------|-------|
| id | String (UUID) | Primary key |
| name | String | Customer name |
| email | String? | Optional email |
| phone | String? | Optional phone |
| orders | Order[] | 1-to-many relation |
| createdAt | DateTime | Creation timestamp |

---

### 8. Order
**Role**: Main transaction record

| Field | Type | Notes |
|-------|------|-------|
| id | String (UUID) | Primary key |
| sessionId | String | Foreign key to Session |
| session | Session | Relation |
| tableId | String | Foreign key to Table |
| table | Table | Relation |
| customerId | String? | Foreign key to Customer (optional) |
| customer | Customer? | Relation (optional) |
| status | OrderStatus | Current order status |
| subtotal | Float | Before tax/discount |
| discount | Float | Discount applied |
| tax | Float | Tax calculated |
| total | Float | Final amount |
| items | OrderItem[] | 1-to-many relation |
| payment | Payment? | 0-or-1 relation |
| kitchenTicket | KitchenTicket? | 0-or-1 relation |
| createdAt | DateTime | Order creation |
| updatedAt | DateTime | Last update |

---

### 9. OrderItem
**Role**: Line items in an order

| Field | Type | Notes |
|-------|------|-------|
| id | String (UUID) | Primary key |
| orderId | String | Foreign key to Order |
| order | Order | Relation |
| productId | String | Foreign key to Product |
| product | Product | Relation |
| quantity | Int | Quantity ordered |
| price | Float | Unit price at time of order |
| total | Float | quantity × price |

---

### 10. Payment
**Role**: Payment transaction record

| Field | Type | Notes |
|-------|------|-------|
| id | String (UUID) | Primary key |
| orderId | String | Foreign key to Order (unique) |
| order | Order | 1-to-1 relation |
| method | PaymentMethod | CASH, CARD, UPI |
| status | PaymentStatus | PENDING or PAID |
| amount | Float | Payment amount |
| transactionId | String? | External transaction ID (for cards) |
| paidAt | DateTime? | Timestamp of payment |

---

### 11. Coupon
**Role**: Discount codes

| Field | Type | Notes |
|-------|------|-------|
| id | String (UUID) | Primary key |
| code | String | Unique coupon code |
| discount | Float | Discount percentage/amount |
| active | Boolean | Is coupon valid |

---

### 12. Promotion
**Role**: Campaign-based promotions

| Field | Type | Notes |
|-------|------|-------|
| id | String (UUID) | Primary key |
| name | String | Promotion name |
| description | String? | Optional description |
| discount | Float | Discount percentage/amount |
| active | Boolean | Is promotion active |

---

### 13. KitchenTicket
**Role**: Kitchen display system ticket

| Field | Type | Notes |
|-------|------|-------|
| id | String (UUID) | Primary key |
| orderId | String | Foreign key to Order (unique) |
| order | Order | 1-to-1 relation |
| status | KitchenStatus | TO_COOK, PREPARING, COMPLETED |
| updatedAt | DateTime | Last status update |

---

### 14. SelfOrderToken
**Role**: QR-based self-ordering tokens

| Field | Type | Notes |
|-------|------|-------|
| id | String (UUID) | Primary key |
| token | String | Unique QR token |
| tableId | String | Foreign key to Table (unique) |
| table | Table | 1-to-1 relation |
| active | Boolean | Is token valid |

---

## Key Design Decisions

1. **UUID over Auto-Increment**: Better for distributed systems and micro-services (future-proofing).

2. **Session Model**: Tracks when staff logged in. Enables sales reconciliation by shift.

3. **Table-to-Order**: Multiple orders can be linked to same table (accounts for multi-course, split checks).

4. **Order Status as Enum**: Prevents invalid state transitions in code.

5. **KitchenTicket Separate**: Decouples order management from kitchen workflow.

6. **SelfOrderToken Unique per Table**: One QR code per table at a time.

7. **Coupon vs Promotion**: Coupon is user-provided code; Promotion is auto-applied campaign.

8. **Customer Optional**: Walk-in orders don't require customer record.

9. **No User-to-Order**: Orders link to Session, Session links to User (audit trail).

10. **Soft-delete Not Included**: Add after MVP if needed. This keeps schema lean.

---

## Relationships Summary

| From | To | Cardinality | Notes |
|------|----|----|-------|
| User | Session | 1:N | User has many sessions |
| Session | Order | 1:N | Session has many orders |
| Floor | Table | 1:N | Floor has many tables |
| Table | Order | 1:N | Table has many orders |
| Category | Product | 1:N | Category has many products |
| Order | OrderItem | 1:N | Order has many items |
| Order | Payment | 1:0/1 | Order has one payment |
| Order | KitchenTicket | 1:0/1 | Order has one kitchen ticket |
| Order | Customer | N:0/1 | Many orders, optional customer |
| Table | SelfOrderToken | 1:0/1 | Table has optional QR token |
| Product | OrderItem | 1:N | Product appears in many orders |

---

## Next Steps

1. ✅ Schema documented
2. ⏭️ Implement in `schema.prisma`
3. ⏭️ Create migrations
4. ⏭️ Seed with sample data
5. ⏭️ Implement repositories (data access)
6. ⏭️ Build controllers & services
