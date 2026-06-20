import { Router } from 'express';
import { AuthController } from '../controller/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const router = Router();
const controller = new AuthController();

router.post('/auth/signup', controller.signup.bind(controller));
router.post('/auth/login', controller.login.bind(controller));
router.get('/auth/me', authMiddleware, controller.me.bind(controller));
router.post('/auth/logout', authMiddleware, controller.logout.bind(controller));
router.patch('/auth/change-password', authMiddleware, controller.changePassword.bind(controller));

export default router;
