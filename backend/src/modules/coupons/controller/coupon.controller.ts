import { Request, Response } from 'express';
import { CouponService } from '../service/coupon.service';
import { CreateCouponDto } from '../dto/createCoupon.dto';
import { UpdateCouponDto } from '../dto/updateCoupon.dto';
import { successResponse, errorResponse } from '../../../shared/utils/response.util';

export class CouponController {
  private couponService = new CouponService();

  async getAllCoupons(req: Request, res: Response) {
    try {
      const coupons = await this.couponService.getAllCoupons();
      res.status(200).json(successResponse('Coupons fetched successfully', coupons));
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to fetch coupons', error.message));
    }
  }

  async getCouponById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const coupon = await this.couponService.getCouponById(id);
      if (coupon) {
        res.status(200).json(successResponse('Coupon fetched successfully', coupon));
      } else {
        res.status(404).json(errorResponse('Coupon not found', 'Coupon not found'));
      }
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to fetch coupon', error.message));
    }
  }

  async getCouponByCode(req: Request, res: Response) {
    try {
      const code = String(req.params.code);
      const coupon = await this.couponService.getCouponByCode(code);
      if (coupon) {
        res.status(200).json(successResponse('Coupon fetched successfully', coupon));
      } else {
        res.status(404).json(errorResponse('Coupon not found', 'Coupon not found'));
      }
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to fetch coupon', error.message));
    }
  }

  async createCoupon(req: Request, res: Response) {
    try {
      const { code, discountType, discountValue, active } = req.body as CreateCouponDto;
      if (!code || discountValue == null) {
        return res.status(400).json(errorResponse('Missing required fields', 'code and discountValue are required'));
      }

      const coupon = await this.couponService.createCoupon({ code, discountType: discountType || 'percentage', discountValue: Number(discountValue), active });
      res.status(201).json(successResponse('Coupon created successfully', coupon));
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to create coupon', error.message));
    }
  }

  async updateCoupon(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const data = req.body as UpdateCouponDto;

      if (data.discountValue != null) data.discountValue = Number(data.discountValue);

      const coupon = await this.couponService.updateCoupon(id, data);
      if (coupon) {
        res.status(200).json(successResponse('Coupon updated successfully', coupon));
      } else {
        res.status(404).json(errorResponse('Coupon not found', 'Coupon not found'));
      }
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to update coupon', error.message));
    }
  }

  async deleteCoupon(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const coupon = await this.couponService.deleteCoupon(id);
      if (coupon) {
        res.status(200).json(successResponse('Coupon deleted successfully', coupon));
      } else {
        res.status(404).json(errorResponse('Coupon not found', 'Coupon not found'));
      }
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to delete coupon', error.message));
    }
  }
}
