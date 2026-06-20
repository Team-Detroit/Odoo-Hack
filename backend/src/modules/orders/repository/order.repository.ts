import prisma from '../../../shared/prisma';
import { CreateOrderDto } from '../dto/createOrder.dto';
import { UpdateOrderDto } from '../dto/updateOrder.dto';

export class OrderRepository {
  async getAllOrders() {
    return prisma.order.findMany({ 
      include: { 
        items: true,
        customer: true,
        table: true
      } 
    });
  }

  async getOrderById(id: string) {
    return prisma.order.findUnique({ 
      where: { id }, 
      include: { 
        items: {
          include: { product: true }
        },
        customer: true,
        table: true
      } 
    });
  }

  async createOrder(data: any) {
    const { items, ...orderData } = data;
    const order = await prisma.order.create({
      data: {
        ...orderData,
        items: {
          create: (items || []).map((i: any) => ({
            productId: i.productId,
            quantity: Number(i.quantity),
            price: Number(i.price),
            total: Number(i.quantity) * Number(i.price)
          }))
        }
      },
      include: { 
        items: true,
        customer: true,
        table: true
      }
    });

    if (orderData.tableId) {
      try {
        await prisma.table.update({
          where: { id: orderData.tableId },
          data: { status: 'OCCUPIED' }
        });
      } catch (err) {
        console.error("Failed to automatically set table as OCCUPIED:", err);
      }
    }

    return order;
  }

  async updateOrder(id: string, data: UpdateOrderDto) {
    const updatedOrder = await prisma.order.update({ 
      where: { id }, 
      data, 
      include: { 
        items: true,
        customer: true,
        table: true
      } 
    });

    if (data.status === 'PAID') {
      try {
        if (updatedOrder.tableId) {
          await prisma.table.update({
            where: { id: updatedOrder.tableId },
            data: { status: 'AVAILABLE' }
          });
        }
        await prisma.kitchenTicket.upsert({
          where: { orderId: id },
          update: { status: 'TO_COOK' },
          create: { orderId: id, status: 'TO_COOK' }
        });
      } catch (err) {
        console.error("Error updating table or kitchen ticket status on payment:", err);
      }
    }

    return updatedOrder;
  }

  async deleteOrder(id: string) {
    return prisma.order.delete({ where: { id } });
  }

  async sendToKitchen(id: string) {
    try {
      await prisma.kitchenTicket.upsert({
        where: { orderId: id },
        update: { status: 'TO_COOK' },
        create: { orderId: id, status: 'TO_COOK' }
      });
    } catch (err) {
      console.error("Error creating kitchen ticket on sendToKitchen:", err);
    }

    return prisma.order.update({
      where: { id },
      data: { status: 'SENT_TO_KITCHEN' },
      include: { 
        items: true,
        customer: true,
        table: true
      },
    });
  }

  async cancelOrder(id: string) {
    return prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: { 
        items: true,
        customer: true,
        table: true
      },
    });
  }
}
