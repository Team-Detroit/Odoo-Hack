"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionController = void 0;
const promotion_service_1 = require("../service/promotion.service");
const response_util_1 = require("../../../shared/utils/response.util");
class PromotionController {
    promotionService = new promotion_service_1.PromotionService();
    async getAllPromotions(req, res) {
        try {
            const promotions = await this.promotionService.getAllPromotions();
            res.status(200).json((0, response_util_1.successResponse)('Promotions fetched successfully', promotions));
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to fetch promotions', error.message));
        }
    }
    async getPromotionById(req, res) {
        try {
            const id = String(req.params.id);
            const promotion = await this.promotionService.getPromotionById(id);
            if (promotion) {
                res.status(200).json((0, response_util_1.successResponse)('Promotion fetched successfully', promotion));
            }
            else {
                res.status(404).json((0, response_util_1.errorResponse)('Promotion not found', 'Promotion not found'));
            }
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to fetch promotion', error.message));
        }
    }
    async createPromotion(req, res) {
        try {
            const { name, description, type, discountType, discountValue, productId, minProductQuantity, minOrderAmount, active, } = req.body;
            if (!name || discountValue == null) {
                return res.status(400).json((0, response_util_1.errorResponse)('Missing required fields', 'name and discountValue are required'));
            }
            const promotion = await this.promotionService.createPromotion({
                name,
                description,
                type: type || 'order',
                discountType: discountType || 'percentage',
                discountValue,
                productId: productId || undefined,
                minProductQuantity: minProductQuantity != null ? Number(minProductQuantity) : undefined,
                minOrderAmount: minOrderAmount != null ? Number(minOrderAmount) : undefined,
                active: active !== false,
            });
            res.status(201).json((0, response_util_1.successResponse)('Promotion created successfully', promotion));
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to create promotion', error.message));
        }
    }
    async updatePromotion(req, res) {
        try {
            const id = String(req.params.id);
            const data = req.body;
            // Ensure proper numeric conversion if provided
            if (data.discountValue != null)
                data.discountValue = Number(data.discountValue);
            if (data.minProductQuantity !== undefined)
                data.minProductQuantity = data.minProductQuantity != null ? Number(data.minProductQuantity) : undefined;
            if (data.minOrderAmount !== undefined)
                data.minOrderAmount = data.minOrderAmount != null ? Number(data.minOrderAmount) : undefined;
            const promotion = await this.promotionService.updatePromotion(id, data);
            if (promotion) {
                res.status(200).json((0, response_util_1.successResponse)('Promotion updated successfully', promotion));
            }
            else {
                res.status(404).json((0, response_util_1.errorResponse)('Promotion not found', 'Promotion not found'));
            }
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to update promotion', error.message));
        }
    }
    async deletePromotion(req, res) {
        try {
            const id = String(req.params.id);
            const promotion = await this.promotionService.deletePromotion(id);
            if (promotion) {
                res.status(200).json((0, response_util_1.successResponse)('Promotion deleted successfully', promotion));
            }
            else {
                res.status(404).json((0, response_util_1.errorResponse)('Promotion not found', 'Promotion not found'));
            }
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to delete promotion', error.message));
        }
    }
}
exports.PromotionController = PromotionController;
