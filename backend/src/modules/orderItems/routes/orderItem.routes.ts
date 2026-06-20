import { Router } from 'express';
import { OrderItemController } from '../controller/orderItem.controller';

const router = Router();
const controller = new OrderItemController();

router.get('/order-items/:orderId', controller.getOrderItemsByOrderId.bind(controller));
router.get('/order-items/:id', controller.getOrderItemById.bind(controller));
router.post('/order-items', controller.createOrderItem.bind(controller));
router.put('/order-items/:id', controller.updateOrderItem.bind(controller));
router.delete('/order-items/:id', controller.deleteOrderItem.bind(controller));

export default router;
