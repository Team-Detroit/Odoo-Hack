"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionService = void 0;
const client_1 = require("@prisma/client");
const promotion_repository_1 = require("../repository/promotion.repository");
class PromotionService {
    promotionRepository = new promotion_repository_1.PromotionRepository();
    async getAllPromotions() {
        return this.promotionRepository.getAllPromotions();
    }
    async getPromotionById(id) {
        return this.promotionRepository.getPromotionById(id);
    }
    async createPromotion(data) {
        return this.promotionRepository.createPromotion(data);
    }
    async updatePromotion(id, data) {
        try {
            return await this.promotionRepository.updatePromotion(id, data);
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return null;
            }
            throw error;
        }
    }
    async deletePromotion(id) {
        try {
            return await this.promotionRepository.deletePromotion(id);
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return null;
            }
            throw error;
        }
    }
}
exports.PromotionService = PromotionService;
