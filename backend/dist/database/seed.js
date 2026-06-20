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
    const dessertsCategory = await prisma.category.create({
        data: {
            name: "Desserts",
            color: "#FF69B4",
        },
    });
    console.log("✓ Created 4 categories");
    // Create Products
    const products = await Promise.all([
        // Coffee
        prisma.product.create({
            data: {
                name: "Espresso",
                description: "Single shot of pure, concentrated espresso",
                price: 80.0,
                tax: 5.0,
                available: true,
                unitOfMeasure: "piece",
                isKitchenItem: false,
                image: "https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=500",
                categoryId: coffeeCategory.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "Cappuccino",
                description: "Espresso topped with thick steamed milk foam",
                price: 150.0,
                tax: 5.0,
                available: true,
                unitOfMeasure: "piece",
                isKitchenItem: false,
                image: "https://images.unsplash.com/photo-1534778101976-62847782c213?w=500&auto=format&fit=crop&q=80",
                categoryId: coffeeCategory.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "Latte",
                description: "Rich espresso with steamed milk and a thin layer of foam",
                price: 160.0,
                tax: 5.0,
                available: true,
                unitOfMeasure: "piece",
                isKitchenItem: false,
                image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=80",
                categoryId: coffeeCategory.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "Americano",
                description: "Espresso shots diluted with hot water",
                price: 120.0,
                tax: 5.0,
                available: true,
                unitOfMeasure: "piece",
                isKitchenItem: false,
                image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500",
                categoryId: coffeeCategory.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "Mocha",
                description: "Espresso mixed with premium chocolate and steamed milk",
                price: 180.0,
                tax: 5.0,
                available: true,
                unitOfMeasure: "piece",
                isKitchenItem: false,
                image: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=500&auto=format&fit=crop&q=80",
                categoryId: coffeeCategory.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "Flat White",
                description: "Double shot espresso with silky microfoam",
                price: 160.0,
                tax: 5.0,
                available: true,
                unitOfMeasure: "piece",
                isKitchenItem: false,
                image: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=500&auto=format&fit=crop&q=80",
                categoryId: coffeeCategory.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "Macchiato",
                description: "Espresso marked with a small dollop of foamed milk",
                price: 110.0,
                tax: 5.0,
                available: true,
                unitOfMeasure: "piece",
                isKitchenItem: false,
                image: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=500&auto=format&fit=crop&q=80",
                categoryId: coffeeCategory.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "Cold Brew",
                description: "Slow-steeped cold brew served over ice",
                price: 140.0,
                tax: 5.0,
                available: true,
                unitOfMeasure: "piece",
                isKitchenItem: false,
                image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=80",
                categoryId: coffeeCategory.id,
            },
        }),
        // Drinks
        prisma.product.create({
            data: {
                name: "Iced Tea",
                description: "Chilled sweetened peach or lemon iced tea",
                price: 90.0,
                tax: 5.0,
                available: true,
                unitOfMeasure: "piece",
                isKitchenItem: false,
                image: "https://images.unsplash.com/photo-1499638472904-ea5c6178a300?w=500&auto=format&fit=crop&q=80",
                categoryId: drinksCategory.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "Lemonade",
                description: "Freshly squeezed lemon juice with a hint of mint",
                price: 80.0,
                tax: 5.0,
                available: true,
                unitOfMeasure: "piece",
                isKitchenItem: false,
                image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80",
                categoryId: drinksCategory.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "Orange Juice",
                description: "Freshly squeezed cold-pressed orange juice",
                price: 110.0,
                tax: 5.0,
                available: true,
                unitOfMeasure: "piece",
                isKitchenItem: false,
                image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=500&auto=format&fit=crop&q=80",
                categoryId: drinksCategory.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "Mango Smoothie",
                description: "Creamy blended fresh mango smoothie",
                price: 180.0,
                tax: 5.0,
                available: true,
                unitOfMeasure: "piece",
                isKitchenItem: false,
                image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=80",
                categoryId: drinksCategory.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "Strawberry Shake",
                description: "Classic strawberry milkshake topped with whipped cream",
                price: 160.0,
                tax: 5.0,
                available: true,
                unitOfMeasure: "piece",
                isKitchenItem: false,
                image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=80",
                categoryId: drinksCategory.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "Watermelon Juice",
                description: "Cool and refreshing watermelon juice",
                price: 100.0,
                tax: 5.0,
                available: true,
                unitOfMeasure: "piece",
                isKitchenItem: false,
                image: "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=500",
                categoryId: drinksCategory.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "Green Tea",
                description: "Premium organic green tea leaves brewed to perfection",
                price: 90.0,
                tax: 5.0,
                available: true,
                unitOfMeasure: "piece",
                isKitchenItem: false,
                image: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=500&auto=format&fit=crop&q=80",
                categoryId: drinksCategory.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "Hot Chocolate",
                description: "Warm, rich chocolate milk topped with marshmallows",
                price: 150.0,
                tax: 5.0,
                available: true,
                unitOfMeasure: "piece",
                isKitchenItem: false,
                image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&auto=format&fit=crop&q=80",
                categoryId: drinksCategory.id,
            },
        }),
        // Food
        prisma.product.create({
            data: {
                name: "Sandwich",
                description: "Classic grilled cheese and fresh vegetable sandwich",
                price: 120.0,
                tax: 5.0,
                available: true,
                unitOfMeasure: "piece",
                isKitchenItem: true,
                image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=80",
                categoryId: foodCategory.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "Burger",
                description: "Flame-grilled veggie patty with cheese, lettuce and tomatoes",
                price: 160.0,
                tax: 5.0,
                available: true,
                unitOfMeasure: "piece",
                isKitchenItem: true,
                image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80",
                categoryId: foodCategory.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "Garlic Bread",
                description: "Toasted slices of butter and herb garlic bread",
                price: 100.0,
                tax: 5.0,
                available: true,
                unitOfMeasure: "piece",
                isKitchenItem: true,
                image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=500&auto=format&fit=crop&q=80",
                categoryId: foodCategory.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "French Fries",
                description: "Crispy golden potato fries seasoned with sea salt",
                price: 90.0,
                tax: 5.0,
                available: true,
                unitOfMeasure: "piece",
                isKitchenItem: true,
                image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80",
                categoryId: foodCategory.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "Pasta",
                description: "Creamy white sauce Alfredo penne pasta with vegetables",
                price: 220.0,
                tax: 5.0,
                available: true,
                unitOfMeasure: "piece",
                isKitchenItem: true,
                image: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=500",
                categoryId: foodCategory.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "Wrap",
                description: "Spicy grilled paneer and crisp lettuce wrap",
                price: 140.0,
                tax: 5.0,
                available: true,
                unitOfMeasure: "piece",
                isKitchenItem: true,
                image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500",
                categoryId: foodCategory.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "Club Sandwich",
                description: "Toasted double-decker sandwich with extra cheese and veggies",
                price: 180.0,
                tax: 5.0,
                available: true,
                unitOfMeasure: "piece",
                isKitchenItem: true,
                image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500",
                categoryId: foodCategory.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "Pizza Slice",
                description: "Single slice of fresh sourdough pizza loaded with mozzarella",
                price: 130.0,
                tax: 5.0,
                available: true,
                unitOfMeasure: "piece",
                isKitchenItem: true,
                image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80",
                categoryId: foodCategory.id,
            },
        }),
        // Desserts
        prisma.product.create({
            data: {
                name: "Brownie",
                description: "Fudgy warm chocolate brownie served as a piece",
                price: 120.0,
                tax: 5.0,
                available: true,
                unitOfMeasure: "piece",
                isKitchenItem: true,
                image: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=500&auto=format&fit=crop&q=80",
                categoryId: dessertsCategory.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "Cheesecake",
                description: "Classic New York style cheesecake with blueberry topping",
                price: 240.0,
                tax: 5.0,
                available: true,
                unitOfMeasure: "piece",
                isKitchenItem: true,
                image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500",
                categoryId: dessertsCategory.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "Donut",
                description: "Soft glazed donut topped with chocolate sprinkles",
                price: 90.0,
                tax: 5.0,
                available: true,
                unitOfMeasure: "piece",
                isKitchenItem: true,
                image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&auto=format&fit=crop&q=80",
                categoryId: dessertsCategory.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "Croissant",
                description: "Flaky butter croissant baked fresh daily",
                price: 110.0,
                tax: 5.0,
                available: true,
                unitOfMeasure: "piece",
                isKitchenItem: true,
                image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=80",
                categoryId: dessertsCategory.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "Muffin",
                description: "Freshly baked double chocolate chip muffin",
                price: 100.0,
                tax: 5.0,
                available: true,
                unitOfMeasure: "piece",
                isKitchenItem: true,
                image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=500&auto=format&fit=crop&q=80",
                categoryId: dessertsCategory.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "Chocolate Cake",
                description: "Decadent slice of rich chocolate fudge cake",
                price: 160.0,
                tax: 5.0,
                available: true,
                unitOfMeasure: "piece",
                isKitchenItem: true,
                image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=80",
                categoryId: dessertsCategory.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "Red Velvet Cake",
                description: "Velvety smooth red velvet cake slice with cream cheese frosting",
                price: 180.0,
                tax: 5.0,
                available: true,
                unitOfMeasure: "piece",
                isKitchenItem: true,
                image: "https://images.unsplash.com/photo-1616031037011-087000171abe?w=500&auto=format&fit=crop&q=80",
                categoryId: dessertsCategory.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "Tiramisu",
                description: "Classic Italian dessert made of coffee-dipped ladyfingers and mascarpone",
                price: 260.0,
                tax: 5.0,
                available: true,
                unitOfMeasure: "piece",
                isKitchenItem: true,
                image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop&q=80",
                categoryId: dessertsCategory.id,
            },
        }),
    ]);
    console.log(`✓ Created ${products.length} products`);
    // Create Floors
    const groundFloor = await prisma.floor.create({
        data: {
            name: "Ground Floor",
        },
    });
    console.log("✓ Created 1 floor");
    const tables = await Promise.all([
        prisma.table.create({
            data: {
                number: 1,
                seats: 2,
                status: "AVAILABLE",
                floorId: groundFloor.id,
                x: 15,
                y: 15,
                width: 10,
                height: 14,
                shape: "square"
            },
        }),
        prisma.table.create({
            data: {
                number: 2,
                seats: 4,
                status: "AVAILABLE",
                floorId: groundFloor.id,
                x: 35,
                y: 15,
                width: 10,
                height: 14,
                shape: "square"
            },
        }),
        prisma.table.create({
            data: {
                number: 3,
                seats: 4,
                status: "AVAILABLE",
                floorId: groundFloor.id,
                x: 55,
                y: 15,
                width: 10,
                height: 14,
                shape: "square"
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
