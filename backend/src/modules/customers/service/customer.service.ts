import { Prisma } from '@prisma/client';
import { CustomerRepository } from '../repository/customer.repository';
import { CreateCustomerDto } from '../dto/createCustomer.dto';
import { UpdateCustomerDto } from '../dto/updateCustomer.dto';

export class CustomerService {
  private customerRepository = new CustomerRepository();

  async getAllCustomers() {
    return this.customerRepository.getAllCustomers();
  }

  async getCustomerById(id: string) {
    return this.customerRepository.getCustomerById(id);
  }

  async createCustomer(data: CreateCustomerDto) {
    return this.customerRepository.createCustomer(data);
  }

  async updateCustomer(id: string, data: UpdateCustomerDto) {
    try {
      return await this.customerRepository.updateCustomer(id, data);
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }

  async deleteCustomer(id: string) {
    try {
      return await this.customerRepository.deleteCustomer(id);
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }
}
