import { Router } from 'express';
import { CategoryController } from '../controller/category.controller';

const router = Router();
const controller = new CategoryController();

router.get('/categories', controller.getAllCategories.bind(controller));
router.get('/categories/:id', controller.getCategoryById.bind(controller));
router.post('/categories', controller.createCategory.bind(controller));
router.put('/categories/:id', controller.updateCategory.bind(controller));
router.delete('/categories/:id', controller.deleteCategory.bind(controller));

export default router;
