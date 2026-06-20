import { Router } from 'express';
import { KdsController } from '../controller/kds.controller';

const router = Router();
const controller = new KdsController();

router.get('/kitchen-tickets', controller.getAllKitchenTickets.bind(controller));
router.get('/kitchen-tickets/:id', controller.getKitchenTicketById.bind(controller));
router.get('/kitchen-tickets/status/:status', controller.getTicketsByStatus.bind(controller));
router.patch('/kitchen-tickets/:id/status', controller.updateTicketStatus.bind(controller));

export default router;
