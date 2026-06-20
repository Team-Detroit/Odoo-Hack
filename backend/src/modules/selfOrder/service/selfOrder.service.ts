import { Prisma } from '@prisma/client';
import { SelfOrderRepository } from '../repository/selfOrder.repository';
import { CreateSelfOrderDto } from '../dto/createSelfOrder.dto';

export class SelfOrderService {
  private selfOrderRepository = new SelfOrderRepository();

  async getMenuByToken(token: string) {
    return this.selfOrderRepository.getMenuByToken(token);
  }

  async createOrderByToken(token: string, items: Array<{ productId: string; quantity: number }>) {
    return this.selfOrderRepository.createOrderByToken(token, items);
  }

  async getOrderStatusByToken(token: string) {
    return this.selfOrderRepository.getOrderStatusByToken(token);
  }
}
