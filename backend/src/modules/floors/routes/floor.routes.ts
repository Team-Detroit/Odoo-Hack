import { Router } from 'express';
import { FloorController } from '../controller/floor.controller';

const router = Router();
const controller = new FloorController();

router.get('/floors', controller.getAllFloors.bind(controller));
router.get('/floors/:id', controller.getFloorById.bind(controller));
router.post('/floors', controller.createFloor.bind(controller));
router.put('/floors/:id', controller.updateFloor.bind(controller));
router.delete('/floors/:id', controller.deleteFloor.bind(controller));

export default router;
