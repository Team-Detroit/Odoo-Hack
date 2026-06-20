# Project Overview

> Odoo Cafe POS — A production-grade Point-of-Sale system built for cafes and restaurants, developed during a 15-hour hackathon.

---

## Problem Statement

Modern cafes struggle with:

| Problem | Impact |
|---------|--------|
| Paper-based or fragmented ordering | Orders get lost, slow service |
| No real-time kitchen visibility | Delays, wrong orders, food waste |
| Manual table tracking | Confused staff, poor customer experience |
| Cash-only or single payment method | Revenue loss |
| No analytics or reporting | Cannot identify peak hours or top sellers |
| No self-service option | Bottleneck during rush hours |

Odoo Cafe POS solves all of these with a unified, real-time system.

---

## Solution

A web-based POS platform that connects:

- Front-of-house (waiters, cashiers) via a browser-based POS terminal
- Kitchen staff via a real-time Kitchen Display System (KDS)
- Customers via QR-based self-ordering
- Management via an admin dashboard with analytics

---

## User Roles

```mermaid
graph TD
    subgraph Roles["System Roles"]
        A["ADMIN"]
        B["EMPLOYEE"]
        C["KITCHEN"]
    end

    A -->|"Full access"| SysA["Admin Dashboard"]
    B -->|"Operational access"| SysB["POS Terminal"]
    C -->|"Read-only"| SysC["Kitchen Display"]

    SysA --- AA["Manage staff, menu, reports, floors"]
    SysB --- BB["Orders, tables, payments"]
    SysC --- CC["View & update kitchen tickets"]
```

### Role Permissions Matrix

| Feature | ADMIN | EMPLOYEE | KITCHEN |
|---------|:-----:|:--------:|:-------:|
| View Dashboard | Yes | No | No |
| Manage Users/Staff | Yes | No | No |
| Manage Products/Menu | Yes | No | No |
| Edit Floor Layout | Yes | No | No |
| View Sales Reports | Yes | No | No |
| Manage Coupons/Promos | Yes | No | No |
| Take Orders (POS) | Yes | Yes | No |
| Process Payments | Yes | Yes | No |
| Manage Tables | Yes | Yes | No |
| View Kitchen Tickets | Yes | Yes | Yes |
| Update Ticket Status | No | No | Yes |

---

## High-Level App Flow

```mermaid
flowchart TD
    Start([System Start]) --> Login["Login via JWT"]
    Login --> RoleCheck{Role?}

    RoleCheck -->|ADMIN| AdminDash["Admin Dashboard"]
    RoleCheck -->|EMPLOYEE| POS["POS Terminal"]
    RoleCheck -->|KITCHEN| KDS["Kitchen Display"]

    AdminDash --> AdminOps["Manage menu, staff, reports, floors"]

    POS --> OpenSession["Open Session"]
    OpenSession --> TableSelect["Select Table"]
    TableSelect --> OrderCreate["Create Order"]
    OrderCreate --> AddItems["Add Menu Items"]
    AddItems --> SendKitchen["Send to Kitchen"]

    SendKitchen -->|Socket.IO| KDS
    KDS --> KitchenUpdate["Update status: TO_COOK → PREPARING → COMPLETED"]

    KitchenUpdate -->|Socket.IO| POS
    POS --> Payment["Process Payment (Cash/Card/UPI)"]
    Payment --> CloseOrder["Order PAID"]
    CloseOrder --> TableFree["Table → AVAILABLE"]

    QR["QR Code Scan"] -->|Customer self-orders| SelfOrder["Self-Ordering Portal"]
    SelfOrder --> OrderCreate
```

---

## User Journeys

### Journey 1: Dine-In (Waiter)

```mermaid
sequenceDiagram
    participant W as Waiter
    participant POS as POS Terminal
    participant DB as Database
    participant K as Kitchen KDS
    participant C as Customer

    C->>W: Customer arrives
    W->>POS: Select available table
    POS->>DB: Update table to OCCUPIED
    W->>POS: Create new order & add items
    W->>POS: Send to kitchen
    POS->>DB: Order DRAFT to SENT_TO_KITCHEN
    POS->>K: Socket.IO new kitchen ticket
    K->>K: View ticket, start preparing
    K->>POS: Socket.IO status to PREPARING
    K->>POS: Socket.IO status to COMPLETED
    W->>C: Deliver food
    C->>W: Request bill
    W->>POS: Process payment
    POS->>DB: Order PAID, Table AVAILABLE
```

### Journey 2: Self-Ordering (QR)

```mermaid
sequenceDiagram
    participant C as Customer
    participant QR as QR Portal
    participant POS as System
    participant K as Kitchen

    C->>QR: Scan table QR code
    QR->>POS: Validate token
    POS->>QR: Show menu
    C->>QR: Browse and add items
    C->>QR: Place order
    QR->>POS: Create order linked to table
    POS->>K: Kitchen ticket created via Socket.IO
    K->>K: Prepare order
    K->>POS: Mark completed
    POS->>QR: Notify customer
```

---

## System Components Summary

```mermaid
graph LR
    subgraph FE["Frontend (React + Vite)"]
        Auth["Auth Pages"]
        Admin["Admin Panel"]
        POS["POS Terminal"]
        KDS["KDS Screen"]
        Self["Self-Order Portal"]
    end

    subgraph BE["Backend (Node.js + Express)"]
        API["REST API /api/*"]
        Socket["Socket.IO Real-Time"]
        Auth2["JWT Middleware"]
    end

    subgraph DB["Data Layer"]
        Prisma["Prisma ORM"]
        PG["PostgreSQL"]
    end

    FE <-->|HTTP/HTTPS| API
    FE <-->|WebSocket| Socket
    API --> Auth2
    API --> Prisma
    Socket --> Prisma
    Prisma --> PG
```

---

## Key Metrics (Target)

| Metric | Target |
|--------|--------|
| Order creation time | Under 30 seconds |
| Kitchen notification latency | Under 500ms (Socket.IO) |
| Concurrent tables supported | 50+ |
| Payment methods | 3 (Cash, Card, UPI) |
| Self-ordering via QR | Per-table tokens |
| API response time | Under 200ms (p95) |

---

*Previous: [Back to README](./README.md) | Next: [Tech Stack](./tech-stack.md)*