import prisma from '../../../shared/prisma';
import { CreateCustomerDto } from '../dto/createCustomer.dto';
import { UpdateCustomerDto } from '../dto/updateCustomer.dto';

export class CustomerRepository {
  async getAllCustomers() {
    return prisma.customer.findMany();
  }

  async getCustomerById(id: string) {
    return prisma.customer.findUnique({ where: { id } });
  }

  async createCustomer(data: CreateCustomerDto) {
    return prisma.customer.create({ data });
  }

  async updateCustomer(id: string, data: UpdateCustomerDto) {
    return prisma.customer.update({ where: { id }, data });
  }

  async deleteCustomer(id: string) {
    return prisma.customer.delete({ where: { id } });
  }
}
