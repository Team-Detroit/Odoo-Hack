import prisma from '../../../shared/prisma';
import { CreateOrderItemDto } from '../dto/createOrderItem.dto';
import { UpdateOrderItemDto } from '../dto/updateOrderItem.dto';

export class OrderItemRepository {
  async getOrderItemsByOrderId(orderId: string) {
    return prisma.orderItem.findMany({ where: { orderId } });
  }

  async getOrderItemById(id: string) {
    return prisma.orderItem.findUnique({ where: { id } });
  }

  async createOrderItem(data: CreateOrderItemDto) {
    return prisma.orderItem.create({ data });
  }

  async updateOrderItem(id: string, data: UpdateOrderItemDto) {
    return prisma.orderItem.update({ where: { id }, data });
  }

  async deleteOrderItem(id: string) {
    return prisma.orderItem.delete({ where: { id } });
  }
}
