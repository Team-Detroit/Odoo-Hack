import prisma from '../../../shared/prisma';
import { CreateCouponDto } from '../dto/createCoupon.dto';
import { UpdateCouponDto } from '../dto/updateCoupon.dto';

export class CouponRepository {
  async getAllCoupons() {
    return prisma.coupon.findMany();
  }

  async getCouponById(id: string) {
    return prisma.coupon.findUnique({ where: { id } });
  }

  async getCouponByCode(code: string) {
    return prisma.coupon.findUnique({ where: { code } });
  }

  async createCoupon(data: CreateCouponDto) {
    return prisma.coupon.create({ data });
  }

  async updateCoupon(id: string, data: UpdateCouponDto) {
    return prisma.coupon.update({ where: { id }, data });
  }

  async deleteCoupon(id: string) {
    return prisma.coupon.delete({ where: { id } });
  }
}
