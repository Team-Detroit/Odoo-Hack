import { Router } from 'express';
import { RazorpayController } from '../razorpay/razorpay.controller';

const router = Router();
const ctrl = new RazorpayController();

router.post('/razorpay/create-order', (req, res) => ctrl.createOrder(req, res));
router.post('/razorpay/verify', (req, res) => ctrl.verifyPayment(req, res));

export default router;
