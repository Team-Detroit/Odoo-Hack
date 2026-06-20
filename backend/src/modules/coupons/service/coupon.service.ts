import { Prisma } from '@prisma/client';
import { CouponRepository } from '../repository/coupon.repository';
import { CreateCouponDto } from '../dto/createCoupon.dto';
import { UpdateCouponDto } from '../dto/updateCoupon.dto';

export class CouponService {
  private couponRepository = new CouponRepository();

  async getAllCoupons() {
    return this.couponRepository.getAllCoupons();
  }

  async getCouponById(id: string) {
    return this.couponRepository.getCouponById(id);
  }

  async getCouponByCode(code: string) {
    return this.couponRepository.getCouponByCode(code);
  }

  async createCoupon(data: CreateCouponDto) {
    return this.couponRepository.createCoupon(data);
  }

  async updateCoupon(id: string, data: UpdateCouponDto) {
    try {
      return await this.couponRepository.updateCoupon(id, data);
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }

  async deleteCoupon(id: string) {
    try {
      return await this.couponRepository.deleteCoupon(id);
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }
}
