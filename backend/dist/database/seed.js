"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = require("bcryptjs");
const process_1 = __importDefault(require("process"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log("🌱 Seeding database...");
    // Clean existing data
    await prisma.kitchenTicket.deleteMany({});
    await prisma.payment.deleteMany({});
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.selfOrderToken.deleteMany({});
    await prisma.table.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.floor.deleteMany({});
    await prisma.customer.deleteMany({});
    await prisma.coupon.deleteMany({});
    await prisma.promotion.deleteMany({});
    console.log("✓ Cleaned database");
    // Create Users
    const hashedPassword = await (0, bcryptjs_1.hash)("password123", 10);
    const admin = await prisma.user.create({
        data: {
            name: "Admin User",
            email: "admin@cafe.com",
            password: hashedPassword,
            role: "ADMIN",
        },
    });
    const employee1 = await prisma.user.create({
        data: {
            name: "John Barista",
            email: "john@cafe.com",
            password: hashedPassword,
            role: "EMPLOYEE",
        },
    });
    const employee2 = await prisma.user.create({
        data: {
            name: "Jane Cashier",
            email: "jane@cafe.com",
            password: hashedPassword,
            role: "EMPLOYEE",
        },
    });
    const kitchen = await prisma.user.create({
        data: {
            name: "Chef Kitchen",
            email: "kitchen@cafe.com",
            password: hashedPassword,
            role: "EMPLOYEE",
        },
    });
    console.log("✓ Created 4 users");
    // Create Categories
    const coffeeCategory = await prisma.category.create({
        data: {
            name: "Coffee",
            color: "#8B4513",
        },
    });
    const foodCategory = await prisma.category.create({
        data: {
            name: "Food",
            color: "#FF6347",
        },
    });
    const drinksCategory = await prisma.category.create({
        data: {
            name: "Drinks",
            color: "#4169E1",
        },
    });
    console.log("✓ Created 3 categories");
    // Create Products
    const products = await Promise.all([
        prisma.product.create({
            data: {
                name: "Espresso",
                description: "Single shot espresso",
                price: 2.5,
                tax: 0,
                isKitchenItem: false,
                categoryId: coffeeCategory.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "Cappuccino",
                description: "Espresso with steamed milk",
                price: 4.0,
                tax: 0,
                isKitchenItem: false,
                categoryId: coffeeCategory.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "Croissant",
                description: "Buttery pastry",
                price: 3.5,
                tax: 5,
                isKitchenItem: true,
                categoryId: foodCategory.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "Sandwich",
                description: "Grilled cheese sandwich",
                price: 7.0,
                tax: 5,
                isKitchenItem: true,
                categoryId: foodCategory.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "Iced Tea",
                description: "Cold brewed tea",
                price: 3.0,
                tax: 0,
                isKitchenItem: false,
                categoryId: drinksCategory.id,
            },
        }),
    ]);
    console.log("✓ Created 5 products");
    // Create Floors
    const groundFloor = await prisma.floor.create({
        data: {
            name: "Ground Floor",
        },
    });
    console.log("✓ Created 1 floor");
    // Create Tables
    const tables = await Promise.all([
        prisma.table.create({
            data: {
                number: 1,
                seats: 2,
                status: "AVAILABLE",
                floorId: groundFloor.id,
            },
        }),
        prisma.table.create({
            data: {
                number: 2,
                seats: 4,
                status: "AVAILABLE",
                floorId: groundFloor.id,
            },
        }),
        prisma.table.create({
            data: {
                number: 3,
                seats: 4,
                status: "AVAILABLE",
                floorId: groundFloor.id,
            },
        }),
    ]);
    console.log("✓ Created 3 tables");
    // Create Customers
    const customer1 = await prisma.customer.create({
        data: {
            name: "Alice Johnson",
            email: "alice@example.com",
            phone: "+1234567890",
        },
    });
    const customer2 = await prisma.customer.create({
        data: {
            name: "Bob Smith",
            phone: "+0987654321",
        },
    });
    console.log("✓ Created 2 customers");
    // Create Coupons
    await prisma.coupon.create({
        data: {
            code: "SUMMER20",
            discountType: "percentage",
            discountValue: 20,
            active: true,
        },
    });
    await prisma.coupon.create({
        data: {
            code: "WELCOME10",
            discountType: "percentage",
            discountValue: 10,
            active: true,
        },
    });
    console.log("✓ Created 2 coupons");
    // Create Promotions
    await prisma.promotion.create({
        data: {
            name: "Happy Hour",
            description: "50% off on coffee 3-5 PM",
            type: "order",
            discountType: "percentage",
            discountValue: 50,
            active: true,
        },
    });
    await prisma.promotion.create({
        data: {
            name: "Weekend Special",
            description: "Buy 2, get 1 free on sandwiches",
            type: "order",
            discountType: "percentage",
            discountValue: 33.33,
            active: true,
        },
    });
    console.log("✓ Created 2 promotions");
    // Create a Session
    const session = await prisma.session.create({
        data: {
            userId: employee1.id,
            status: "OPEN",
        },
    });
    console.log("✓ Created 1 session");
    // Create a Sample Order
    const order = await prisma.order.create({
        data: {
            sessionId: session.id,
            tableId: tables[0].id,
            customerId: customer1.id,
            status: "DRAFT",
            subtotal: 0,
            discount: 0,
            tax: 0,
            total: 0,
        },
    });
    console.log("✓ Created 1 sample order");
    // Create Order Items
    const orderItem = await prisma.orderItem.create({
        data: {
            orderId: order.id,
            productId: products[0].id, // Espresso
            quantity: 2,
            price: products[0].price,
            total: 2 * products[0].price,
        },
    });
    console.log("✓ Created 1 order item");
    // Create Kitchen Ticket
    await prisma.kitchenTicket.create({
        data: {
            orderId: order.id,
            status: "TO_COOK",
        },
    });
    console.log("✓ Created 1 kitchen ticket");
    console.log("✅ Database seeding complete!");
}
main()
    .catch((e) => {
    console.error("❌ Seeding error:", e);
    process_1.default.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
