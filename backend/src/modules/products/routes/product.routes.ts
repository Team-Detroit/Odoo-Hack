import { Router } from 'express';
import prisma from '../../../shared/prisma';
import { ProductController } from '../controller/product.controller';

const router = Router();
const controller = new ProductController(prisma);

router.get('/products', controller.getAllProducts.bind(controller));
router.get('/products/:id', controller.getProductById.bind(controller));
router.post('/products', controller.createProduct.bind(controller));
router.put('/products/:id', controller.updateProduct.bind(controller));
router.delete('/products/:id', controller.deleteProduct.bind(controller));

export default router;
