import { Prisma } from '@prisma/client';
import { PromotionRepository } from '../repository/promotion.repository';
import { CreatePromotionDto } from '../dto/createPromotion.dto';
import { UpdatePromotionDto } from '../dto/updatePromotion.dto';

export class PromotionService {
  private promotionRepository = new PromotionRepository();

  async getAllPromotions() {
    return this.promotionRepository.getAllPromotions();
  }

  async getPromotionById(id: string) {
    return this.promotionRepository.getPromotionById(id);
  }

  async createPromotion(data: CreatePromotionDto) {
    return this.promotionRepository.createPromotion(data);
  }

  async updatePromotion(id: string, data: UpdatePromotionDto) {
    try {
      return await this.promotionRepository.updatePromotion(id, data);
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }

  async deletePromotion(id: string) {
    try {
      return await this.promotionRepository.deletePromotion(id);
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }
}
