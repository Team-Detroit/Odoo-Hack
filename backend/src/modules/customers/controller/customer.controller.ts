import { Request, Response } from 'express';
import { CustomerService } from '../service/customer.service';
import { CreateCustomerDto } from '../dto/createCustomer.dto';
import { UpdateCustomerDto } from '../dto/updateCustomer.dto';
import { successResponse, errorResponse } from '../../../shared/utils/response.util';

export class CustomerController {
  private customerService = new CustomerService();

  async getAllCustomers(req: Request, res: Response) {
    try {
      const customers = await this.customerService.getAllCustomers();
      res.status(200).json(successResponse('Customers fetched successfully', { customers }));
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to fetch customers', error.message));
    }
  }

  async getCustomerById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const customer = await this.customerService.getCustomerById(id);
      if (customer) {
        res.status(200).json(successResponse('Customer fetched successfully', { customer }));
      } else {
        res.status(404).json(errorResponse('Customer not found', 'Customer not found'));
      }
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to fetch customer', error.message));
    }
  }

  async createCustomer(req: Request, res: Response) {
    try {
      const { name, phone, email } = req.body as CreateCustomerDto;
      if (!name) {
        return res.status(400).json(errorResponse('Missing required fields', 'Name is required'));
      }

      const customer = await this.customerService.createCustomer({ name, phone, email });
      res.status(201).json(successResponse('Customer created successfully', { customer }));
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to create customer', error.message));
    }
  }

  async updateCustomer(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const data = req.body as UpdateCustomerDto;

      const customer = await this.customerService.updateCustomer(id, data);
      if (customer) {
        res.status(200).json(successResponse('Customer updated successfully', { customer }));
      } else {
        res.status(404).json(errorResponse('Customer not found', 'Customer not found'));
      }
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to update customer', error.message));
    }
  }

  async deleteCustomer(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const customer = await this.customerService.deleteCustomer(id);
      if (customer) {
        res.status(200).json(successResponse('Customer deleted successfully', {}));
      } else {
        res.status(404).json(errorResponse('Customer not found', 'Customer not found'));
      }
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to delete customer', error.message));
    }
  }
}
