# FRONTEND REQUIREMENTS

# Project

Odoo Cafe POS

Tech Stack

* React
* Vite
* TypeScript
* Tailwind CSS
* Shadcn UI
* React Router DOM
* Zustand
* Axios
* Socket.io Client

---

# Objective

Build the frontend for a Restaurant Point Of Sale (POS) system.

Frontend developers should ONLY focus on UI, state management and backend integration.

Frontend developers must NOT modify:

* Database
* Prisma
* Backend APIs
* Folder structures
* Authentication logic

Backend will provide APIs.

---

# Frontend Folder Structure

frontend/src/

assets/

components/

constants/

context/

hooks/

layouts/

lib/

pages/

routes/

services/

store/

styles/

types/

utils/

App.tsx

main.tsx

Do NOT modify this architecture.

---

# Roles

There are 3 authenticated roles.

ADMIN

Dashboard access

EMPLOYEE

POS access

KITCHEN

KDS access

Customers DO NOT have accounts.

---

# Pages To Build

## Landing

Route:

/

Components:

* Hero
* Features
* CTA
* Login button

---

## Login

Route:

/login

Fields:

* Email
* Password

After login:

Admin → /dashboard

Employee → /pos

Kitchen → /kds

---

## Dashboard

Route:

/dashboard

Cards:

* Revenue
* Orders
* Customers
* Average Order Value

Charts:

* Sales Trend
* Top Categories
* Top Products

Tables:

* Top Orders

---

## Products

Route:

/products

Features:

* Create Product
* Edit Product
* Delete Product
* Search Product

Fields:

* Name
* Category
* Price
* Unit
* Tax
* Description

---

## Categories

Route:

/categories

Features:

* Create
* Edit
* Delete

Fields:

* Name
* Color

Color should reflect everywhere.

---

## Employees

Route:

/employees

Features:

* List
* Create
* Edit
* Archive
* Delete

Fields:

* Name
* Email
* Role

---

## Tables

Route:

/tables

Features:

* Create Floor
* Create Table
* Edit Table
* Delete Table

Fields:

* Table Number
* Seats
* Status

States:

* Available
* Occupied
* Reserved
* Cleaning

---

# POS

Route:

/pos

Three sections:

Products

Cart

Payment

---

# POS Navigation

Top navbar:

* POS
* Orders
* Customers
* Table View
* Search
* Current Table
* Employee Icon

---

# Floor Screen

Route:

/pos/floors

Display:

Ground Floor

[1] [2] [3]

First Floor

[4] [5] [6]

Table states:

Green → Available

Yellow → Occupied

Red → Reserved

Black → Cleaning

Clicking a table opens Order View.

---

# Order Screen

Route:

/pos/orders

Left:

Products

Middle:

Cart

Right:

Payment

---

# Product Section

Features:

* Search
* Category Tabs
* Product Cards

Clicking a product:

Add item to cart.

---

# Cart

Each row:

* Product Name
* Quantity
* Unit Price
* Line Total

Features:

* Increase quantity
* Decrease quantity
* Delete item

Order Summary:

* Subtotal
* Tax
* Discount
* Total

Buttons:

* Customer
* Coupon
* Send To Kitchen
* Proceed To Payment

---

# Customers

Route:

/customers

Features:

* Search
* Create
* Edit
* Delete

Fields:

* Name
* Email
* Phone

---

# Payment Screen

Methods:

Cash

Card

UPI

Cash:

* Amount received
* Change due

Card:

* Transaction reference

UPI:

* QR code
* Confirm button

After payment:

* Print receipt
* Email receipt

---

# KDS

Route:

/kds

Stages:

To Cook

↓

Preparing

↓

Completed

Features:

* Ticket cards
* Search
* Filters
* Mark items complete

Realtime updates required.

---

# Customer Display

Route:

/customer-display

Show:

* Products
* Quantity
* Subtotal
* Tax
* Discount
* Total

Payment View:

* UPI QR
* Amount

Completion View:

* Thank You Screen

Realtime updates required.

---

# Self Ordering

Route:

/self-order/:token

Customer Flow:

Scan QR

↓

Browse Menu

↓

Add To Cart

↓

Apply Coupon

↓

Place Order

↓

Track Status

---

# Stores To Create (Zustand)

auth

cart

customer

order

payment

session

table

ui

---

# Services To Create

auth.service

product.service

category.service

employee.service

customer.service

table.service

order.service

payment.service

promotion.service

report.service

socket.service

---

# Layouts To Create

AuthLayout

DashboardLayout

POSLayout

KDSLayout

---

# Realtime Features

Socket.io will update:

POS ↔ KDS

POS ↔ Customer Display

POS ↔ Self Order

Frontend must only listen and update UI.

Backend owns the socket logic.

---

# Development Rules

1. Do NOT change folder structures.

2. Do NOT create backend code.

3. Do NOT modify database files.

4. Do NOT modify Prisma.

5. Build pages first.

6. Connect APIs later.

7. Add socket integration after backend APIs work.

8. Use reusable components.

9. Use Zustand for state management.

10. Follow backend API contracts.

---

# Build Order

Phase 1

Layouts

↓

Routes

↓

Pages

↓

Components

Phase 2

State Management

↓

Services

↓

Backend Integration

Phase 3

Socket Integration

↓

Polish UI

↓

Testing

---

# Golden Rule

Frontend developers are responsible for UI.

Backend developers are responsible for business logic.

Do not mix responsibilities.
