import { Router } from 'express';
import { TableController } from '../controller/table.controller';

const router = Router();
const controller = new TableController();

router.get('/tables', controller.getAllTables.bind(controller));
router.get('/tables/:id', controller.getTableById.bind(controller));
router.post('/tables', controller.createTable.bind(controller));
router.put('/tables/:id', controller.updateTable.bind(controller));
router.delete('/tables/:id', controller.deleteTable.bind(controller));
router.patch('/tables/:id/status', controller.updateTableStatus.bind(controller));

export default router;
