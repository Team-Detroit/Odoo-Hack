import { Router } from 'express';
import { SelfOrderController } from '../controller/selfOrder.controller';

const router = Router();
const controller = new SelfOrderController();

router.get('/self-order/menu/:token', controller.getMenuByToken.bind(controller));
router.post('/self-order/:token', controller.createOrderByToken.bind(controller));
router.get('/self-order/status/:token', controller.getOrderStatusByToken.bind(controller));

export default router;
