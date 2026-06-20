import { Router } from 'express';
import { PaymentController } from '../controller/payment.controller';

const router = Router();
const controller = new PaymentController();

router.get('/payments/:orderId', controller.getPaymentsByOrderId.bind(controller));
router.get('/payments/detail/:id', controller.getPaymentById.bind(controller));
router.post('/payments', controller.createPayment.bind(controller));
router.patch('/payments/:id/status', controller.updatePaymentStatus.bind(controller));

export default router;
