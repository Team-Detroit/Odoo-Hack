import prisma from '../../../shared/prisma';
import { CreatePromotionDto } from '../dto/createPromotion.dto';
import { UpdatePromotionDto } from '../dto/updatePromotion.dto';

export class PromotionRepository {
  async getAllPromotions() {
    return prisma.promotion.findMany();
  }

  async getPromotionById(id: string) {
    return prisma.promotion.findUnique({ where: { id } });
  }

  async createPromotion(data: CreatePromotionDto) {
    return prisma.promotion.create({ data });
  }

  async updatePromotion(id: string, data: UpdatePromotionDto) {
    return prisma.promotion.update({ where: { id }, data });
  }

  async deletePromotion(id: string) {
    return prisma.promotion.delete({ where: { id } });
  }
}
