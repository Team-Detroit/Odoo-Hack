"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionRepository = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
class PromotionRepository {
    async getAllPromotions() {
        return prisma_1.default.promotion.findMany();
    }
    async getPromotionById(id) {
        return prisma_1.default.promotion.findUnique({ where: { id } });
    }
    async createPromotion(data) {
        return prisma_1.default.promotion.create({ data });
    }
    async updatePromotion(id, data) {
        return prisma_1.default.promotion.update({ where: { id }, data });
    }
    async deletePromotion(id) {
        return prisma_1.default.promotion.delete({ where: { id } });
    }
}
exports.PromotionRepository = PromotionRepository;
