import { Router } from 'express';
import { PromotionController } from '../controller/promotion.controller';

const router = Router();
const controller = new PromotionController();

router.get('/promotions', controller.getAllPromotions.bind(controller));
router.get('/promotions/:id', controller.getPromotionById.bind(controller));
router.post('/promotions', controller.createPromotion.bind(controller));
router.put('/promotions/:id', controller.updatePromotion.bind(controller));
router.delete('/promotions/:id', controller.deletePromotion.bind(controller));

export default router;
