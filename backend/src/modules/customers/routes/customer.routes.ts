import { Router } from 'express';
import { CustomerController } from '../controller/customer.controller';

const router = Router();
const controller = new CustomerController();

router.get('/customers', controller.getAllCustomers.bind(controller));
router.get('/customers/:id', controller.getCustomerById.bind(controller));
router.post('/customers', controller.createCustomer.bind(controller));
router.put('/customers/:id', controller.updateCustomer.bind(controller));
router.delete('/customers/:id', controller.deleteCustomer.bind(controller));

export default router;
