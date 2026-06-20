import { Router } from 'express';
import { OrderController } from '../controller/order.controller';

const router = Router();
const controller = new OrderController();

router.get('/orders', controller.getAllOrders.bind(controller));
router.get('/orders/:id', controller.getOrderById.bind(controller));
router.post('/orders', controller.createOrder.bind(controller));
router.put('/orders/:id', controller.updateOrder.bind(controller));
router.delete('/orders/:id', controller.deleteOrder.bind(controller));
router.patch('/orders/:id/send-to-kitchen', controller.sendToKitchen.bind(controller));
router.patch('/orders/:id/status', controller.updateOrderStatus.bind(controller));
router.patch('/orders/:id/cancel', controller.cancelOrder.bind(controller));

export default router;
