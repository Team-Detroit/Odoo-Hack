import prisma from '../../../shared/prisma';
import { CreatePaymentDto } from '../dto/createPayment.dto';

export class PaymentRepository {
  async getPaymentsByOrderId(orderId: string) {
    return prisma.payment.findMany({ where: { orderId } });
  }

  async getPaymentById(id: string) {
    return prisma.payment.findUnique({ where: { id } });
  }

  async createPayment(data: CreatePaymentDto) {
    return prisma.payment.create({ data });
  }

  async updatePaymentStatus(id: string, status: 'PENDING' | 'PAID') {
    return prisma.payment.update({ where: { id }, data: { status } });
  }
}
