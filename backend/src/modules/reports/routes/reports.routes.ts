import { Router } from 'express';
import { ReportsController } from '../controller/reports.controller';

const router = Router();
const controller = new ReportsController();

router.get('/reports/dashboard', controller.getDashboard.bind(controller));
router.get('/reports/sales', controller.getSales.bind(controller));
router.get('/reports/top-products', controller.getTopProducts.bind(controller));
router.get('/reports/top-categories', controller.getTopCategories.bind(controller));
router.get('/reports/revenue', controller.getRevenue.bind(controller));

export default router;
