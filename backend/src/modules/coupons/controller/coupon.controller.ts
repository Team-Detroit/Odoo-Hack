import { Request, Response } from 'express';
import { CouponService } from '../service/coupon.service';
import { CreateCouponDto } from '../dto/createCoupon.dto';
import { UpdateCouponDto } from '../dto/updateCoupon.dto';
import { successResponse, errorResponse } from '../../../shared/utils/response.util';
import prisma from '../../../shared/prisma';
import { sendEmail } from '../../../utils/email';

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
      const {
        code,
        discountType,
        discountValue,
        active,
        description,
        expiryDate,
        minPurchase,
        minOrders,
        monthsActive,
        newCustomerOnly
      } = req.body as CreateCouponDto;

      if (!code || discountValue == null) {
        return res.status(400).json(errorResponse('Missing required fields', 'code and discountValue are required'));
      }

      const coupon = await this.couponService.createCoupon({
        code: code.toUpperCase(),
        discountType: discountType || 'percentage',
        discountValue: Number(discountValue),
        active: active !== undefined ? active : true,
        description,
        expiryDate: expiryDate ? new Date(expiryDate).toISOString() : undefined,
        minPurchase: minPurchase != null ? Number(minPurchase) : undefined,
        minOrders: minOrders != null ? Number(minOrders) : undefined,
        monthsActive: monthsActive != null ? Number(monthsActive) : undefined,
        newCustomerOnly: newCustomerOnly !== undefined ? !!newCustomerOnly : false
      } as any);

      // Trigger email campaign in background
      this.runEmailCampaignForCoupon(coupon).catch(err => {
        console.error('[Email Campaign] Error running email campaign:', err);
      });

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
      if (data.minPurchase != null) data.minPurchase = Number(data.minPurchase);
      if (data.minOrders != null) data.minOrders = Number(data.minOrders);
      if (data.monthsActive != null) data.monthsActive = Number(data.monthsActive);
      if (data.expiryDate !== undefined) {
        data.expiryDate = data.expiryDate ? new Date(data.expiryDate).toISOString() : undefined;
      }

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

  async validateCoupon(req: Request, res: Response) {
    try {
      const { coupon: couponCode, customerEmail, subtotal = 0 } = req.body;

      if (!couponCode || !customerEmail) {
        return res.status(400).json(errorResponse('Missing required fields', 'coupon and customerEmail are required'));
      }

      // 1. Coupon exists
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } });
      if (!coupon) {
        return res.status(404).json(errorResponse('Coupon code does not exist', 'Coupon code does not exist'));
      }

      // 2. Coupon active
      if (!coupon.active) {
        return res.status(400).json(errorResponse('Coupon is not active', 'Coupon is not active'));
      }

      // Check usage limits
      if (coupon.usageCount >= coupon.maxUsageCount) {
        return res.status(400).json(errorResponse('Coupon limit reached', `This coupon has reached its maximum usage limit of ${coupon.maxUsageCount}.`));
      }

      // 3. Not expired
      if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
        return res.status(400).json(errorResponse('Coupon has expired', 'Coupon has expired'));
      }

      // Find all customer records sharing this email address
      const customersWithEmail = await prisma.customer.findMany({
        where: { email: customerEmail.trim().toLowerCase() },
        include: { orders: true }
      });

      const orders = customersWithEmail.flatMap(c => c.orders || []);
      const totalPurchase = orders.reduce((sum, o) => sum + o.total, 0);
      const orderCount = orders.length;

      // 4. Customer eligible checks
      if (coupon.minPurchase != null && totalPurchase < coupon.minPurchase) {
        return res.status(400).json(errorResponse('Customer not eligible', `Customer total purchase (₹${totalPurchase.toFixed(2)}) is less than required minimum (₹${coupon.minPurchase.toFixed(2)})`));
      }

      if (coupon.minOrders != null && orderCount < coupon.minOrders) {
        return res.status(400).json(errorResponse('Customer not eligible', `Customer order count (${orderCount}) is less than required minimum (${coupon.minOrders})`));
      }

      if (coupon.monthsActive != null) {
        if (orderCount === 0) {
          return res.status(400).json(errorResponse('Customer not eligible', `Customer has no previous orders to satisfy active customer rule`));
        }
        const lastOrder = orders.reduce((latest, o) => {
          const d = new Date(o.createdAt);
          return d > latest ? d : latest;
        }, new Date(0));
        const thresholdDate = new Date();
        thresholdDate.setMonth(thresholdDate.getMonth() - coupon.monthsActive);
        if (lastOrder < thresholdDate) {
          return res.status(400).json(errorResponse('Customer not eligible', `Customer last order was not within the required ${coupon.monthsActive} months`));
        }
      }

      if (coupon.newCustomerOnly && orderCount > 0) {
        return res.status(400).json(errorResponse('Customer not eligible', `Coupon is only valid for new customers (0 orders)`));
      }

      // 5. Not already redeemed under ANY customer record sharing this email address
      if (customersWithEmail.length > 0) {
        const customerIds = customersWithEmail.map(c => c.id);
        const redemption = await prisma.couponRedemption.findFirst({
          where: {
            couponId: coupon.id,
            customerId: { in: customerIds }
          }
        });
        if (redemption) {
          return res.status(400).json(errorResponse('Coupon already redeemed', 'Coupon has already been redeemed by this customer'));
        }
      }

      // Calculate discount
      const subtotalVal = Number(subtotal);
      let discountAmount = 0;
      if (coupon.discountType === 'percentage') {
        discountAmount = (subtotalVal * coupon.discountValue) / 100;
      } else {
        discountAmount = coupon.discountValue;
      }
      discountAmount = Math.min(discountAmount, subtotalVal);

      const finalSubtotal = subtotalVal - discountAmount;
      const tax = finalSubtotal * 0.05;
      const finalAmount = finalSubtotal + tax;

      return res.status(200).json({
        success: true,
        discountAmount: parseFloat(discountAmount.toFixed(2)),
        finalAmount: parseFloat(finalAmount.toFixed(2))
      });
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to validate coupon', error.message));
    }
  }

  private async runEmailCampaignForCoupon(coupon: any) {
    try {
      const customers = await prisma.customer.findMany({
        include: { orders: true }
      });

      console.log(`[Email Campaign] Running filtering for Coupon: ${coupon.code}. Total customers: ${customers.length}`);

      // Group customers by email (case-insensitive, trimmed)
      const customersByEmail: { [email: string]: any[] } = {};
      for (const customer of customers) {
        if (!customer.email || !customer.email.includes('@')) {
          continue;
        }
        const emailKey = customer.email.trim().toLowerCase();
        if (!customersByEmail[emailKey]) {
          customersByEmail[emailKey] = [];
        }
        customersByEmail[emailKey].push(customer);
      }

      const eligibleEmails: Array<{ email: string; name: string }> = [];

      for (const [email, records] of Object.entries(customersByEmail)) {
        // Aggregate orders across all records with this email
        const orders = records.flatMap(r => r.orders || []);
        const totalPurchase = orders.reduce((sum, o) => sum + o.total, 0);
        const orderCount = orders.length;

        if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
          continue;
        }

        if (coupon.minPurchase != null && totalPurchase < coupon.minPurchase) {
          continue;
        }

        if (coupon.minOrders != null && orderCount < coupon.minOrders) {
          continue;
        }

        if (coupon.monthsActive != null) {
          if (orderCount === 0) continue;
          const lastOrder = orders.reduce((latest, o) => {
            const d = new Date(o.createdAt);
            return d > latest ? d : latest;
          }, new Date(0));
          const thresholdDate = new Date();
          thresholdDate.setMonth(thresholdDate.getMonth() - coupon.monthsActive);
          if (lastOrder < thresholdDate) {
            continue;
          }
        }

        if (coupon.newCustomerOnly && orderCount > 0) {
          continue;
        }

        // Keep name from the first record
        const primaryName = records[0].name || 'Customer';
        eligibleEmails.push({ email, name: primaryName });
      }

      console.log(`[Email Campaign] Found ${eligibleEmails.length} unique eligible email addresses for Coupon: ${coupon.code}`);

      for (const { email, name } of eligibleEmails) {
        const discountStr = coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`;
        const expiryStr = coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString('en-IN') : 'Never';
        const emailBody = `Hi ${name},

You've unlocked an exclusive offer.

Coupon:
${coupon.code}

Discount:
${discountStr}

Expires:
${expiryStr}

Apply this coupon during online ordering.

Odoo Cafe`;

        await sendEmail({
          to: email,
          subject: 'Special Offer Just For You 🎉',
          text: emailBody
        });
      }
    } catch (err) {
      console.error('[Email Campaign] Error running campaign:', err);
    }
  }
}

