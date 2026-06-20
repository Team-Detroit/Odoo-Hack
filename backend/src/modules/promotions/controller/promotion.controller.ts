import { Request, Response } from 'express';
import { PromotionService } from '../service/promotion.service';
import { CreatePromotionDto } from '../dto/createPromotion.dto';
import { UpdatePromotionDto } from '../dto/updatePromotion.dto';
import { successResponse, errorResponse } from '../../../shared/utils/response.util';

export class PromotionController {
  private promotionService = new PromotionService();

  async getAllPromotions(req: Request, res: Response) {
    try {
      const promotions = await this.promotionService.getAllPromotions();
      res.status(200).json(successResponse('Promotions fetched successfully', promotions));
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to fetch promotions', error.message));
    }
  }

  async getPromotionById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const promotion = await this.promotionService.getPromotionById(id);
      if (promotion) {
        res.status(200).json(successResponse('Promotion fetched successfully', promotion));
      } else {
        res.status(404).json(errorResponse('Promotion not found', 'Promotion not found'));
      }
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to fetch promotion', error.message));
    }
  }

  async createPromotion(req: Request, res: Response) {
    try {
      const {
        name,
        description,
        type,
        discountType,
        discountValue,
        productId,
        minProductQuantity,
        minOrderAmount,
        active,
      } = req.body as CreatePromotionDto;

      if (!name || discountValue == null) {
        return res.status(400).json(errorResponse('Missing required fields', 'name and discountValue are required'));
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
      res.status(201).json(successResponse('Promotion created successfully', promotion));
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to create promotion', error.message));
    }
  }

  async updatePromotion(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const data = req.body as UpdatePromotionDto;

      // Ensure proper numeric conversion if provided
      if (data.discountValue != null) data.discountValue = Number(data.discountValue);
      if (data.minProductQuantity !== undefined) data.minProductQuantity = data.minProductQuantity != null ? Number(data.minProductQuantity) : undefined;
      if (data.minOrderAmount !== undefined) data.minOrderAmount = data.minOrderAmount != null ? Number(data.minOrderAmount) : undefined;

      const promotion = await this.promotionService.updatePromotion(id, data);
      if (promotion) {
        res.status(200).json(successResponse('Promotion updated successfully', promotion));
      } else {
        res.status(404).json(errorResponse('Promotion not found', 'Promotion not found'));
      }
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to update promotion', error.message));
    }
  }

  async deletePromotion(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const promotion = await this.promotionService.deletePromotion(id);
      if (promotion) {
        res.status(200).json(successResponse('Promotion deleted successfully', promotion));
      } else {
        res.status(404).json(errorResponse('Promotion not found', 'Promotion not found'));
      }
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to delete promotion', error.message));
    }
  }
}
