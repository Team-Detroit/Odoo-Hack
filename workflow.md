# ODOO CAFE - WORKFLOW.md

# Project Overview

Build a production-inspired Restaurant Point Of Sale (POS) system for a 15-hour hackathon.

The application should simulate how a real restaurant operates from product configuration to order creation, kitchen preparation, payment processing and analytics.

The goal is to build a scalable, modular and maintainable application while optimizing for hackathon development speed.

---

# Tech Stack

## Frontend

* React + Vite + TypeScript
* Tailwind CSS
* Shadcn UI
* React Router DOM
* Zustand
* Axios
* Socket.io Client

## Backend

* Node.js
* Express.js
* TypeScript
* PostgreSQL
* Prisma ORM
* Socket.io
* JWT Authentication

---

# User Roles

There are 3 authenticated roles.

## ADMIN

Can access:

* Dashboard
* Products
* Categories
* Employees
* Tables/Floors
* Payment Methods
* Coupons & Promotions
* Reports
* Settings

Route:

/dashboard

---

## EMPLOYEE

Can access:

* POS Terminal
* Floor Selection
* Orders
* Customers
* Payments

Route:

/pos

---

## KITCHEN

Can access:

* Kitchen Display System (KDS)

Route:

/kds

---

# Customer

Customers DO NOT have accounts.

Customers can:

* Be created from POS
* Scan table QR
* Self order
* Track order status

---

# Application Flow

Landing Page

↓

Login

↓

Role Validation

↓

Admin → Dashboard

Employee → POS

Kitchen → KDS

---

# Employee Flow

Employee Login

↓

Open Session

↓

Floor Selection

↓

Select Table

↓

Create/Open Order

↓

Add Products

↓

Assign Customer

↓

Apply Discounts

↓

Send To Kitchen

↓

Kitchen Prepares

↓

Payment

↓

Receipt

↓

Table Available Again

↓

Close Session

---

# Kitchen Flow

Employee clicks Send To Kitchen

↓

Order appears in KDS

↓

To Cook

↓

Preparing

↓

Completed

↓

POS gets realtime updates

---

# Customer Display Flow

Employee updates order

↓

Customer display updates

↓

Show:

* Products
* Quantity
* Tax
* Discounts
* Total

↓

Payment view

↓

Thank You Screen

---

# Self Ordering Flow

Customer scans QR

↓

Open Menu

↓

Browse Products

↓

Add To Cart

↓

Apply Coupon

↓

Place Order

↓

Track Status

↓

Kitchen receives order

---

# Core Modules

Backend Modules

* auth
* users
* products
* categories
* employees
* customers
* tables
* sessions
* orders
* payments
* promotions
* kds
* reports
* selfOrder

---

# Final Folder Structure

Odoo-Cafe/

frontend/

backend/

docs/

README.md

docker-compose.yml

.env.example

.gitignore

---

# Frontend Structure

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

---

# Backend Structure

backend/src/

config/

database/

middleware/

modules/

shared/

sockets/

types/

utils/

app.ts

server.ts

---

# Shared Structure

shared/

enums/

validators/

---

# Database Structure

database/

prisma/

migrations/

schema.prisma

seed.ts

---

# Backend Module Structure

Each module follows:

module/

controller/

service/

repository/

dto/

routes/

index.ts

---

# Database Models

Create these models.

User

Category

Product

Floor

Table

Session

Customer

Order

OrderItem

Payment

Coupon

Promotion

KitchenTicket

SelfOrderToken

---

# Realtime Communication

Socket.io will be used for:

* POS ↔ KDS
* POS ↔ Customer Display
* POS ↔ Self Ordering

---

# State Management

Frontend:

Zustand

Stores:

* auth
* cart
* customer
* order
* payment
* session
* table
* ui

---

# Development Rules

1. Do not modify folder structures.

2. Do not create new architectures.

3. Do not create duplicate folders.

4. Backend owns database logic.

5. Frontend consumes backend APIs only.

6. Every module follows the same structure.

7. Repositories are the only layer allowed to access Prisma.

8. Controllers should remain thin.

9. Business logic belongs inside services.

10. Frontend developers must not modify backend code.

11. Backend developers must not modify frontend pages.

12. Database schema is the source of truth.

---

# Team Distribution

Person 1

Backend Lead

* Database
* Prisma
* Auth
* APIs
* Socket.io
* Integration

Person 2

Frontend

* Dashboard
* Products
* Categories
* Reports

Person 3

Frontend

* POS
* Tables
* Customers
* Payments

Person 4

Frontend

* KDS
* Customer Display
* Self Ordering
* Extra Features

---

# Development Order

Phase 1

Folder Structure

↓

Database Schema

↓

API Contracts

↓

Role Definitions

↓

Team Distribution

Phase 2

Backend APIs

↓

Frontend UI

↓

Database Integration

↓

Socket Integration

Phase 3

Dynamic Pricing

↓

Analytics

↓

UI Polish

↓

Testing

↓

Deployment

---

# Features To Build

Mandatory

* Authentication
* Product Management
* Category Management
* Employee Management
* Customer Management
* Floor Management
* Table Management
* Session Management
* POS Ordering
* Kitchen Display
* Payment Processing
* Coupons
* Promotions
* Reports
* Customer Display
* Self Ordering

Optional

* Dynamic Pricing
* Sales Forecast
* Peak Hour Analytics
* Smart Recommendations

---

# Golden Rule

Do not optimize architecture during the hackathon.

Build features first.

Working software > perfect folder structures.
