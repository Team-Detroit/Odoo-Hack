import { Request, Response } from 'express';
import { PaymentService } from '../service/payment.service';
import { CreatePaymentDto } from '../dto/createPayment.dto';
import { successResponse, errorResponse } from '../../../shared/utils/response.util';
import { io } from '../../../shared/socket';

export class PaymentController {
  private paymentService = new PaymentService();

  async getPaymentsByOrderId(req: Request, res: Response) {
    try {
      const orderId = String(req.params.orderId);
      const payments = await this.paymentService.getPaymentsByOrderId(orderId);
      res.status(200).json(successResponse('Payments fetched successfully', { payments }));
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to fetch payments', error.message));
    }
  }

  async getPaymentById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const payment = await this.paymentService.getPaymentById(id);
      if (payment) {
        res.status(200).json(successResponse('Payment fetched successfully', { payment }));
      } else {
        res.status(404).json(errorResponse('Payment not found', 'Payment not found'));
      }
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to fetch payment', error.message));
    }
  }

  async createPayment(req: Request, res: Response) {
    try {
      const { orderId, method, amount } = req.body as CreatePaymentDto;
      if (!orderId || !method || amount == null) {
        return res.status(400).json(errorResponse('Missing required fields', 'orderId, method and amount are required'));
      }

      const payment = await this.paymentService.createPayment({ orderId, method, amount });
      res.status(201).json(successResponse('Payment created successfully', { payment }));
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to create payment', error.message));
    }
  }

  async updatePaymentStatus(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const { status } = req.body;

      if (!status) {
        return res.status(400).json(errorResponse('Missing required fields', 'status is required'));
      }

      const payment = await this.paymentService.updatePaymentStatus(id, status);
      if (payment) {
        if (io && status === 'PAID') {
          io.emit('payment:completed', { paymentId: id, orderId: payment.orderId });
        }
        res.status(200).json(successResponse('Payment status updated successfully', { payment }));
      } else {
        res.status(404).json(errorResponse('Payment not found', 'Payment not found'));
      }
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to update payment status', error.message));
    }
  }
}
