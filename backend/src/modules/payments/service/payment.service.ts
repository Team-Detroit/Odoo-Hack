import { Prisma } from '@prisma/client';
import { PaymentRepository } from '../repository/payment.repository';
import { CreatePaymentDto } from '../dto/createPayment.dto';

export class PaymentService {
  private paymentRepository = new PaymentRepository();

  async getPaymentsByOrderId(orderId: string) {
    return this.paymentRepository.getPaymentsByOrderId(orderId);
  }

  async getPaymentById(id: string) {
    return this.paymentRepository.getPaymentById(id);
  }

  async createPayment(data: CreatePaymentDto) {
    return this.paymentRepository.createPayment(data);
  }

  async updatePaymentStatus(id: string, status: 'PENDING' | 'PAID') {
    try {
      return await this.paymentRepository.updatePaymentStatus(id, status);
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }
}
