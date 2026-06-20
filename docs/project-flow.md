# Project Flow

> Complete walkthrough of the core operational flows in the Odoo Cafe POS system — from ordering to payment, with real-time sync.

---

## Table of Contents

1. [Ordering Flow](#1-ordering-flow)
2. [Payment Flow](#2-payment-flow)
3. [Kitchen (KDS) Flow](#3-kitchen-kds-flow)
4. [Self-Ordering Flow](#4-self-ordering-qr-flow)
5. [Staff Session Flow](#5-staff-session-flow)
6. [Admin Flow](#6-admin-management-flow)

---

## 1. Ordering Flow

### Overview

```mermaid
flowchart TD
    Start([Customer Arrives]) --> Seat

    Seat["Waiter selects table<br/>in POS terminal"]
    Seat --> TableCheck{Table status?}

    TableCheck -->|AVAILABLE| Occupy["Set table to OCCUPIED"]
    TableCheck -->|OCCUPIED| Seat

    Occupy --> NewOrder["Create new Order<br/>status: DRAFT"]
    NewOrder --> BrowseMenu["Browse menu<br/>by category"]

    BrowseMenu --> AddItem["Add item to order<br/>creates OrderItem"]
    AddItem --> MoreItems{More items?}
    MoreItems -->|Yes| AddItem
    MoreItems -->|No| ReviewOrder["Review order<br/>subtotal + tax"]

    ReviewOrder --> ApplyCoupon{Apply coupon?}
    ApplyCoupon -->|Yes| ValidateCoupon["Validate coupon code<br/>Apply discount"]
    ApplyCoupon -->|No| SendKitchen
    ValidateCoupon --> SendKitchen

    SendKitchen["Send to Kitchen<br/>Order to SENT_TO_KITCHEN<br/>Create KitchenTicket (TO_COOK)"]
    SendKitchen -->|"Socket.IO"| KDS["KDS receives ticket"]

    KDS --> PrepareFood["Chef prepares food<br/>TO_COOK to PREPARING to COMPLETED"]
    PrepareFood -->|"Socket.IO"| POS["POS notified: food ready"]

    POS --> Serve["Waiter serves food"]
    Serve --> PaymentReady["Customer ready to pay"]
    PaymentReady --> PaymentFlow["Go to Payment Flow"]
```

### Detailed Order Creation Sequence

```mermaid
sequenceDiagram
    actor W as Waiter
    participant UI as POS Terminal
    participant API as Express API
    participant DB as Database
    participant KDS as Kitchen Display

    W->>UI: Select empty table
    UI->>API: PUT /api/tables/:id {status: OCCUPIED}
    API->>DB: Update Table.status
    DB->>API: Updated table
    API->>UI: 200 OK

    W->>UI: Click "New Order"
    UI->>API: POST /api/orders {tableId, sessionId}
    API->>DB: Create Order (status: DRAFT)
    DB->>API: Order {id, status: DRAFT}
    API->>UI: 200 OK {order}

    loop Add each item
        W->>UI: Select product from menu
        UI->>UI: Add to local cart
    end

    W->>UI: Click "Send to Kitchen"
    UI->>API: POST /api/order-items (bulk)
    API->>DB: Create OrderItems
    API->>DB: Update Order subtotal/tax/total
    API->>DB: Update Order to SENT_TO_KITCHEN
    API->>DB: Create KitchenTicket (TO_COOK)
    API->>KDS: emit("kitchen:new-ticket", ticket)
    KDS->>W: emit("order:confirmed")
    API->>UI: 200 OK
```

---

## 2. Payment Flow

### Overview

```mermaid
flowchart TD
    Start([Customer Requests Bill]) --> CalcTotal

    CalcTotal["Calculate Total<br/>subtotal + tax - discount"]
    CalcTotal --> SelectMethod

    SelectMethod{Payment Method?}
    SelectMethod -->|Cash| CashFlow["Cash Payment<br/>Enter amount received<br/>Calculate change"]
    SelectMethod -->|Card| CardFlow["Card Payment<br/>Swipe/tap card<br/>Enter transaction ID"]
    SelectMethod -->|UPI| UPIFlow["UPI Payment<br/>Show QR / UPI ID<br/>Wait for confirmation"]

    CashFlow --> CreatePayment
    CardFlow --> CreatePayment
    UPIFlow --> CreatePayment

    CreatePayment["Create Payment record<br/>status: PENDING"]
    CreatePayment --> ConfirmPayment

    ConfirmPayment["Confirm Payment<br/>status: PAID"]
    ConfirmPayment --> UpdateOrder["Update Order to PAID"]
    UpdateOrder --> FreeTable["Set Table to AVAILABLE<br/>or CLEANING"]
    FreeTable --> PrintBill["Print/Share Receipt"]
    PrintBill --> CloseSession{Close session?}

    CloseSession -->|No| Done([Order Complete])
    CloseSession -->|Yes| EOD["End-of-Day<br/>Session to CLOSED<br/>Reconciliation Summary"]
    EOD --> Done
```

### Payment Sequence Diagram

```mermaid
sequenceDiagram
    actor W as Waiter
    actor C as Customer
    participant UI as POS Terminal
    participant API as Express API
    participant DB as Database

    C->>W: Request bill
    W->>UI: Open payment screen
    UI->>UI: Display order total (subtotal + tax - discount)

    W->>C: Show total amount
    C->>W: Choose payment method (Cash/Card/UPI)

    alt Cash Payment
        W->>UI: Enter amount received
        UI->>UI: Calculate change
        W->>UI: Confirm payment
    else Card Payment
        W->>UI: Swipe card, enter transaction ID
    else UPI Payment
        UI->>C: Show UPI QR code
        C->>UI: Scan and pay
        W->>UI: Confirm payment received
    end

    W->>UI: Submit payment
    UI->>API: POST /api/payments {orderId, method, amount}
    API->>DB: Create Payment (status: PENDING)
    API->>DB: Update Payment to PAID
    API->>DB: Update Order to PAID
    API->>DB: Update Table to AVAILABLE
    API->>UI: 200 OK {payment, receipt}

    UI->>W: Show success + change (if cash)
    UI->>UI: emit("order:paid")
    W->>C: Hand receipt
```

---

## 3. Kitchen (KDS) Flow

### Kitchen Display System Lifecycle

```mermaid
flowchart LR
    subgraph POS["POS Terminal"]
        CreateOrder["Create Order<br/>+ Order Items"]
        SendBtn["Click: Send to Kitchen"]
    end

    subgraph API["Backend"]
        CreateTicket["Create KitchenTicket<br/>TO_COOK"]
        UpdateTicket["Update Ticket Status"]
    end

    subgraph KDS["Kitchen Display"]
        NewTicket["New ticket appears<br/>TO_COOK"]
        StartCook["Chef clicks START<br/>PREPARING"]
        DoneFood["Chef clicks DONE<br/>COMPLETED"]
    end

    subgraph Notification["Real-Time Notifications"]
        Notify1["POS notified:<br/>ticket created"]
        Notify2["POS notified:<br/>PREPARING"]
        Notify3["POS notified:<br/>Order READY"]
    end

    CreateOrder --> SendBtn
    SendBtn -->|REST + Socket.IO| CreateTicket
    CreateTicket --> NewTicket
    CreateTicket --> Notify1
    NewTicket --> StartCook
    StartCook -->|Socket.IO| UpdateTicket
    UpdateTicket --> Notify2
    DoneFood -->|Socket.IO| UpdateTicket
    UpdateTicket --> Notify3
```

### KDS Ticket Priority and Display

```mermaid
graph TD
    subgraph KDSBoard["Kitchen Display Board (sorted by time)"]
        subgraph T1["Ticket: Order #42 | Table 5 | 8 min ago"]
            I1["Espresso x2"]
            I2["Croissant x1"]
            S1["Status: PREPARING"]
        end

        subgraph T2["Ticket: Order #43 | Table 2 | 3 min ago"]
            I3["Cappuccino x1"]
            I4["Sandwich x2"]
            S2["Status: TO_COOK"]
        end

        subgraph T3["Ticket: Order #44 | Table 7 | 1 min ago"]
            I5["Latte x3"]
            S3["Status: TO_COOK"]
        end
    end

    Legend["TO_COOK = Waiting<br/>PREPARING = In progress<br/>COMPLETED = Ready"]
```

---

## 4. Self-Ordering (QR) Flow

```mermaid
flowchart TD
    Start([Customer seated at table]) --> ScanQR

    ScanQR["Customer scans QR code<br/>on table placard"]
    ScanQR --> ValidateToken["Backend validates<br/>SelfOrderToken"]

    ValidateToken -->|Invalid/Expired| Error["Error: Invalid QR<br/>Ask staff for help"]
    ValidateToken -->|Valid| ShowMenu["Show menu<br/>filtered by category"]

    ShowMenu --> BrowseItems["Customer browses<br/>and selects items"]
    BrowseItems --> AddToCart["Add to cart"]
    AddToCart --> MoreItems{More items?}
    MoreItems -->|Yes| BrowseItems
    MoreItems -->|No| ReviewCart["Review cart"]

    ReviewCart --> PlaceOrder["Place Order"]
    PlaceOrder -->|"POST /api/self-order"| CreateOrder["Create Order<br/>Linked to table"]
    CreateOrder -->|"Socket.IO"| KDS["Kitchen ticket created"]
    CreateOrder --> OrderConfirm["Order confirmed screen<br/>Estimated time"]

    KDS --> Prepare["Kitchen prepares"]
    Prepare -->|Socket.IO| WaiterNotify["Waiter notified:<br/>food ready for Table X"]
    WaiterNotify --> Deliver["Food delivered"]
```

### QR Token Generation

```mermaid
sequenceDiagram
    participant Admin as Admin
    participant API as Backend API
    participant DB as Database
    participant Table as Physical Table

    Admin->>API: POST /api/self-order/generate-token {tableId}
    API->>DB: Create SelfOrderToken {token: uuid(), tableId, active: true}
    API->>Admin: {tokenUrl: "/self-ordering/{token}"}
    Admin->>Table: Print QR code from tokenUrl

    Note over Table: QR is now live on table
```

---

## 5. Staff Session Flow

```mermaid
flowchart TD
    Start([Staff arrives for shift]) --> Login

    Login["Login<br/>Email + Password"]
    Login -->|JWT issued| Dashboard["Open POS Terminal<br/>or KDS screen"]

    Dashboard --> OpenSession["Open Session<br/>SessionStatus: OPEN"]
    OpenSession --> WorkShift["Work shift<br/>Take orders, process payments"]

    WorkShift --> EndOfDay{End of shift?}
    EndOfDay -->|No| WorkShift
    EndOfDay -->|Yes| CloseSession

    CloseSession["Close Session<br/>SessionStatus: CLOSED<br/>Record closedAt timestamp"]
    CloseSession --> Summary["View session summary<br/>Total orders, revenue"]
    Summary --> Logout["Logout"]
    Logout --> Done([Shift complete])
```

### Session-Based Audit Trail

```mermaid
graph LR
    User["User<br/>Staff member"]
    Session["Session<br/>openedAt + closedAt"]
    Orders["Orders<br/>all in this session"]
    Payments["Payments<br/>all completed"]
    Report["End-of-Day Report<br/>Revenue by session"]

    User -->|"opens"| Session
    Session -->|"contains"| Orders
    Orders -->|"generates"| Payments
    Session -->|"summarized in"| Report
```

---

## 6. Admin Management Flow

```mermaid
flowchart TD
    Admin([Admin Login]) --> AdminDash

    AdminDash["Admin Dashboard"]

    AdminDash --> MenuMgmt["Menu Management"]
    AdminDash --> StaffMgmt["Staff Management"]
    AdminDash --> FloorMgmt["Floor Management"]
    AdminDash --> DiscountMgmt["Discount Management"]
    AdminDash --> Reports["Reports and Analytics"]

    MenuMgmt --> CatCreate["Create/Edit Categories"]
    MenuMgmt --> ProdCreate["Create/Edit/Delete Products<br/>name, price, tax, kitchen flag"]

    StaffMgmt --> CreateUser["Create staff accounts<br/>EMPLOYEE or KITCHEN"]
    StaffMgmt --> ManageRoles["Assign/Change roles"]

    FloorMgmt --> CreateFloor["Create floors<br/>Ground, First, etc."]
    FloorMgmt --> CreateTable["Add tables<br/>number, seats, position"]
    FloorMgmt --> GenQR["Generate QR codes<br/>for self-ordering"]

    DiscountMgmt --> CreateCoupon["Create coupon codes<br/>SAVE20, etc."]
    DiscountMgmt --> CreatePromo["Create promotions<br/>Happy Hour, etc."]

    Reports --> SalesReport["Sales by date range"]
    Reports --> CategoryReport["Revenue by category"]
    Reports --> StaffReport["Orders by employee/session"]
    Reports --> TopItems["Top selling products"]
```

---

## Complete System Flow Summary

```mermaid
journey
    title Customer Dine-In Journey
    section Arrival
        Customer arrives: 5: Customer
        Waiter greets: 5: Waiter
        Table assigned: 4: Waiter, System
    section Ordering
        Menu browsed: 5: Waiter, Customer
        Items added to order: 4: Waiter
        Order sent to kitchen: 5: Waiter, System
    section Preparation
        Kitchen receives ticket: 5: Kitchen, System
        Chef starts preparing: 4: Kitchen
        Food marked ready: 5: Kitchen, System
        Waiter notified: 5: Waiter, System
    section Service
        Food served to customer: 5: Waiter, Customer
        Customer enjoys meal: 5: Customer
    section Payment
        Bill requested: 5: Customer
        Payment processed: 4: Waiter, Customer, System
        Receipt issued: 5: System
        Table freed: 5: System
```

---

## Real-Time Events Summary

| Trigger | Event Emitted | Receivers | Purpose |
|---------|--------------|-----------|---------|
| Order sent to kitchen | `kitchen:new-ticket` | All KDS screens | Show new ticket |
| Chef starts cooking | `kitchen:status-changed` | POS terminals | Update order status |
| Food ready | `order:ready` | POS terminals + customer display | Notify waiter |
| Payment confirmed | `order:paid` | All connected clients | Update displays |
| Table status changed | `table:updated` | All POS terminals | Update floor map |
| New self-order | `kitchen:new-ticket` | KDS screens | Self-order to kitchen |

---

*Previous: [Database Schema](./database-schema.md) | Next: [Features](./features.md)*
