import prisma from '../src/shared/prisma';

async function run() {
  try {
    const sessions = await prisma.session.findMany();
    const tables = await prisma.table.findMany();
    const products = await prisma.product.findMany();
    
    console.log("Sessions count:", sessions.length);
    console.log("Tables count:", tables.length);
    console.log("Products count:", products.length);

    if (sessions.length === 0 || tables.length === 0 || products.length === 0) {
      console.log("Missing sessions, tables, or products in DB.");
      return;
    }

    const session = sessions[0];
    const table = tables[0];
    const product = products[0];

    console.log("Attempting to create a test order with session:", session.id, "and table:", table.id);

    const order = await prisma.order.create({
      data: {
        sessionId: session.id,
        tableId: table.id,
        subtotal: 100,
        discount: 0,
        tax: 5,
        total: 105,
        items: {
          create: [{
            productId: product.id,
            quantity: 1,
            price: 100,
            total: 100
          }]
        }
      },
      include: { items: true }
    });

    console.log("Success! Order created:", order.id);
  } catch (error: any) {
    console.error("Failed to create order:", error);
  } finally {
    await prisma.$disconnect();
  }
}

run();
