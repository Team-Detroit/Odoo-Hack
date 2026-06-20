"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponController = void 0;
const coupon_service_1 = require("../service/coupon.service");
const response_util_1 = require("../../../shared/utils/response.util");
class CouponController {
    couponService = new coupon_service_1.CouponService();
    async getAllCoupons(req, res) {
        try {
            const coupons = await this.couponService.getAllCoupons();
            res.status(200).json((0, response_util_1.successResponse)('Coupons fetched successfully', coupons));
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to fetch coupons', error.message));
        }
    }
    async getCouponById(req, res) {
        try {
            const id = String(req.params.id);
            const coupon = await this.couponService.getCouponById(id);
            if (coupon) {
                res.status(200).json((0, response_util_1.successResponse)('Coupon fetched successfully', coupon));
            }
            else {
                res.status(404).json((0, response_util_1.errorResponse)('Coupon not found', 'Coupon not found'));
            }
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to fetch coupon', error.message));
        }
    }
    async getCouponByCode(req, res) {
        try {
            const code = String(req.params.code);
            const coupon = await this.couponService.getCouponByCode(code);
            if (coupon) {
                res.status(200).json((0, response_util_1.successResponse)('Coupon fetched successfully', coupon));
            }
            else {
                res.status(404).json((0, response_util_1.errorResponse)('Coupon not found', 'Coupon not found'));
            }
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to fetch coupon', error.message));
        }
    }
    async createCoupon(req, res) {
        try {
            const { code, discountType, discountValue, active } = req.body;
            if (!code || discountValue == null) {
                return res.status(400).json((0, response_util_1.errorResponse)('Missing required fields', 'code and discountValue are required'));
            }
            const coupon = await this.couponService.createCoupon({ code, discountType: discountType || 'percentage', discountValue: Number(discountValue), active });
            res.status(201).json((0, response_util_1.successResponse)('Coupon created successfully', coupon));
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to create coupon', error.message));
        }
    }
    async updateCoupon(req, res) {
        try {
            const id = String(req.params.id);
            const data = req.body;
            if (data.discountValue != null)
                data.discountValue = Number(data.discountValue);
            const coupon = await this.couponService.updateCoupon(id, data);
            if (coupon) {
                res.status(200).json((0, response_util_1.successResponse)('Coupon updated successfully', coupon));
            }
            else {
                res.status(404).json((0, response_util_1.errorResponse)('Coupon not found', 'Coupon not found'));
            }
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to update coupon', error.message));
        }
    }
    async deleteCoupon(req, res) {
        try {
            const id = String(req.params.id);
            const coupon = await this.couponService.deleteCoupon(id);
            if (coupon) {
                res.status(200).json((0, response_util_1.successResponse)('Coupon deleted successfully', coupon));
            }
            else {
                res.status(404).json((0, response_util_1.errorResponse)('Coupon not found', 'Coupon not found'));
            }
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to delete coupon', error.message));
        }
    }
}
exports.CouponController = CouponController;
