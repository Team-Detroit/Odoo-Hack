import { Router } from 'express';
import { SessionController } from '../controller/session.controller';
import { authMiddleware } from '../../auth/middleware/auth.middleware';

const router = Router();
const controller = new SessionController();

router.get('/sessions/current', authMiddleware, controller.getCurrentSession.bind(controller));
router.post('/sessions/open', authMiddleware, controller.openSession.bind(controller));
router.post('/sessions/close', authMiddleware, controller.closeSession.bind(controller));
router.get('/sessions/history', authMiddleware, controller.getSessionHistory.bind(controller));

export default router;
