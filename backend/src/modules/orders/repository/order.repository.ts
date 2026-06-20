import prisma from '../../../shared/prisma';
import { CreateOrderDto } from '../dto/createOrder.dto';
import { UpdateOrderDto } from '../dto/updateOrder.dto';

export class OrderRepository {
  async getAllOrders() {
    return prisma.order.findMany({ include: { items: true } });
  }

  async getOrderById(id: string) {
    return prisma.order.findUnique({ where: { id }, include: { items: true } });
  }

  async createOrder(data: CreateOrderDto) {
    return prisma.order.create({ data, include: { items: true } });
  }

  async updateOrder(id: string, data: UpdateOrderDto) {
    return prisma.order.update({ where: { id }, data, include: { items: true } });
  }

  async deleteOrder(id: string) {
    return prisma.order.delete({ where: { id } });
  }

  async sendToKitchen(id: string) {
    return prisma.order.update({
      where: { id },
      data: { status: 'SENT_TO_KITCHEN' },
      include: { items: true },
    });
  }

  async cancelOrder(id: string) {
    return prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: { items: true },
    });
  }
}
