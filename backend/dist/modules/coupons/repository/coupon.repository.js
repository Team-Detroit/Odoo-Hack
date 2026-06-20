"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponRepository = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
class CouponRepository {
    async getAllCoupons() {
        return prisma_1.default.coupon.findMany();
    }
    async getCouponById(id) {
        return prisma_1.default.coupon.findUnique({ where: { id } });
    }
    async getCouponByCode(code) {
        return prisma_1.default.coupon.findUnique({ where: { code } });
    }
    async createCoupon(data) {
        return prisma_1.default.coupon.create({ data });
    }
    async updateCoupon(id, data) {
        return prisma_1.default.coupon.update({ where: { id }, data });
    }
    async deleteCoupon(id) {
        return prisma_1.default.coupon.delete({ where: { id } });
    }
}
exports.CouponRepository = CouponRepository;
