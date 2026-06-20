import { Prisma } from '@prisma/client';
import { OrderRepository } from '../repository/order.repository';
import { CreateOrderDto } from '../dto/createOrder.dto';
import { UpdateOrderDto } from '../dto/updateOrder.dto';

export class OrderService {
  private orderRepository = new OrderRepository();

  async getAllOrders() {
    return this.orderRepository.getAllOrders();
  }

  async getOrderById(id: string) {
    return this.orderRepository.getOrderById(id);
  }

  async createOrder(data: CreateOrderDto) {
    return this.orderRepository.createOrder(data);
  }

  async updateOrder(id: string, data: UpdateOrderDto) {
    try {
      return await this.orderRepository.updateOrder(id, data);
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }

  async deleteOrder(id: string) {
    try {
      return await this.orderRepository.deleteOrder(id);
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }

  async sendToKitchen(id: string) {
    try {
      return await this.orderRepository.sendToKitchen(id);
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }

  async cancelOrder(id: string) {
    try {
      return await this.orderRepository.cancelOrder(id);
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }
}
