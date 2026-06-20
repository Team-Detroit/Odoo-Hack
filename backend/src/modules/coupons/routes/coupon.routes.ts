import { Router } from 'express';
import { CouponController } from '../controller/coupon.controller';

const router = Router();
const controller = new CouponController();

router.get('/coupons', controller.getAllCoupons.bind(controller));
router.get('/coupons/:id', controller.getCouponById.bind(controller));
router.get('/coupons/code/:code', controller.getCouponByCode.bind(controller));
router.post('/coupons', controller.createCoupon.bind(controller));
router.put('/coupons/:id', controller.updateCoupon.bind(controller));
router.delete('/coupons/:id', controller.deleteCoupon.bind(controller));

export default router;
