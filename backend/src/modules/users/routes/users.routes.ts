import { Router } from 'express';
import { UsersController } from '../controller/users.controller';
import { authMiddleware } from '../../auth/middleware/auth.middleware';

const router = Router();
const controller = new UsersController();

router.get('/users', authMiddleware, (req: any, res: any) => controller.getAll(req, res));
router.get('/users/:id', authMiddleware, (req: any, res: any) => controller.getById(req, res));
router.post('/users', authMiddleware, (req: any, res: any) => controller.create(req, res));
router.put('/users/:id', authMiddleware, (req: any, res: any) => controller.update(req, res));
router.delete('/users/:id', authMiddleware, (req: any, res: any) => controller.delete(req, res));
router.post('/users/change-password', authMiddleware, (req: any, res: any) => controller.changePassword(req, res));

export default router;
