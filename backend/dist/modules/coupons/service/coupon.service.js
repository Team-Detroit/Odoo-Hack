"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponService = void 0;
const client_1 = require("@prisma/client");
const coupon_repository_1 = require("../repository/coupon.repository");
class CouponService {
    couponRepository = new coupon_repository_1.CouponRepository();
    async getAllCoupons() {
        return this.couponRepository.getAllCoupons();
    }
    async getCouponById(id) {
        return this.couponRepository.getCouponById(id);
    }
    async getCouponByCode(code) {
        return this.couponRepository.getCouponByCode(code);
    }
    async createCoupon(data) {
        return this.couponRepository.createCoupon(data);
    }
    async updateCoupon(id, data) {
        try {
            return await this.couponRepository.updateCoupon(id, data);
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return null;
            }
            throw error;
        }
    }
    async deleteCoupon(id) {
        try {
            return await this.couponRepository.deleteCoupon(id);
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return null;
            }
            throw error;
        }
    }
}
exports.CouponService = CouponService;
