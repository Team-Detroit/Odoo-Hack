# BACKEND REQUIREMENTS

# Project

Odoo Cafe POS

Production-inspired Restaurant POS System built for a 15-hour hackathon.

Backend architecture must be modular, scalable and easy to maintain while prioritizing development speed.

---

# Tech Stack

Backend

* Node.js
* Express.js
* TypeScript
* PostgreSQL
* Prisma ORM
* JWT Authentication
* Socket.io

Frontend (Reference)

* React
* Vite
* TypeScript

---

# Backend Responsibilities

Backend developers own:

* Database Design
* Prisma Models
* Authentication
* Business Logic
* API Development
* Socket.io
* Reporting Logic
* Integrations

Backend developers do NOT own:

* UI Design
* React Pages
* Frontend State Management

---

# Backend Folder Structure

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

Do NOT modify this architecture.

---

# Database Structure

database/

prisma/

migrations/

schema.prisma

seed.ts

---

# Shared Structure

shared/

enums/

validators/

Do NOT create extra shared folders.

---

# Backend Modules

modules/

auth/

users/

products/

categories/

employees/

customers/

tables/

sessions/

orders/

payments/

promotions/

kds/

reports/

selfOrder/

Do NOT create additional modules unless absolutely necessary.

---

# Module Structure

Every module must follow this structure.

module/

controller/

service/

repository/

dto/

routes/

index.ts

---

# Layer Responsibilities

## Controller

Responsibilities:

* Receive requests
* Validate inputs
* Call services
* Return responses

Controllers must remain thin.

Do NOT place business logic here.

---

## Service

Responsibilities:

* Business logic
* Data orchestration
* Validation logic
* Cross-module operations

Services should contain most of the application logic.

---

## Repository

Responsibilities:

* Prisma queries
* Database access

Repositories are the ONLY layer allowed to access Prisma.

---

## DTO

Responsibilities:

* Request payload validation
* Response shapes

Use lightweight validation.

Recommended:

* Zod

---

## Routes

Responsibilities:

* Express router configuration

Example:

router.post()

router.get()

router.put()

router.delete()

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

# User Roles

There are 3 authenticated roles.

ADMIN

EMPLOYEE

KITCHEN

Customers do NOT have accounts.

---

# Application Flow

Landing

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

Select Floor

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

Kitchen Updates

↓

Payment

↓

Receipt

↓

Close Session

---

# Kitchen Flow

Order Received

↓

To Cook

↓

Preparing

↓

Completed

---

# Customer Display Flow

POS Updates

↓

Customer Display Updates

↓

Payment Screen

↓

Thank You Screen

---

# Self Ordering Flow

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

# Authentication Requirements

JWT Authentication

Protected Routes

Role Based Access

Admin

Employee

Kitchen

Middleware should verify:

* Token
* User existence
* Role permissions

---

# Realtime Requirements

Socket.io will power:

POS ↔ KDS

POS ↔ Customer Display

POS ↔ Self Ordering

Events should be event-driven.

Examples:

order_created

order_updated

order_sent_to_kitchen

order_preparing

order_completed

payment_completed

table_status_changed

---

# API Naming Convention

Use plural nouns.

Examples:

/api/auth

/api/products

/api/categories

/api/customers

/api/orders

/api/payments

/api/reports

Do NOT create inconsistent routes.

Bad:

/api/getProducts

Good:

/api/products

---

# Response Format

Success

{
"success": true,
"message": "",
"data": {}
}

Error

{
"success": false,
"message": "",
"errors": []
}

Keep responses consistent.

---

# Backend Development Order

Phase 1

schema.prisma

↓

Migrations

↓

Seed Data

↓

Authentication

Phase 2

Products

↓

Categories

↓

Tables

↓

Sessions

↓

Customers

↓

Orders

↓

Payments

↓

Promotions

Phase 3

KDS

↓

Customer Display

↓

Self Ordering

↓

Reports

↓

Socket Integration

Phase 4

Dynamic Pricing

↓

Analytics

↓

Testing

---

# Development Rules

1. Do NOT modify folder structures.

2. Do NOT create duplicate entities.

3. Do NOT access Prisma outside repositories.

4. Do NOT put business logic inside controllers.

5. Do NOT directly modify frontend code.

6. Database schema is the source of truth.

7. Build APIs before sockets.

8. Build sockets before extra features.

9. Build mandatory features first.

10. Working software is more important than architecture perfection.

---

# Team Responsibility

Backend Lead

* Database
* Prisma
* Authentication
* API Contracts
* Socket.io
* Integration

Frontend Team

* UI
* Pages
* State Management
* API Consumption

---

# Golden Rule

Database → APIs → Frontend → Sockets → Extra Features

Never change this order.
