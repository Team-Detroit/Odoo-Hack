import { Prisma } from '@prisma/client';
import { OrderItemRepository } from '../repository/orderItem.repository';
import { CreateOrderItemDto } from '../dto/createOrderItem.dto';
import { UpdateOrderItemDto } from '../dto/updateOrderItem.dto';

export class OrderItemService {
  private orderItemRepository = new OrderItemRepository();

  async getOrderItemsByOrderId(orderId: string) {
    return this.orderItemRepository.getOrderItemsByOrderId(orderId);
  }

  async getOrderItemById(id: string) {
    return this.orderItemRepository.getOrderItemById(id);
  }

  async createOrderItem(data: CreateOrderItemDto) {
    return this.orderItemRepository.createOrderItem(data);
  }

  async updateOrderItem(id: string, data: UpdateOrderItemDto) {
    try {
      return await this.orderItemRepository.updateOrderItem(id, data);
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }

  async deleteOrderItem(id: string) {
    try {
      return await this.orderItemRepository.deleteOrderItem(id);
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }
}
