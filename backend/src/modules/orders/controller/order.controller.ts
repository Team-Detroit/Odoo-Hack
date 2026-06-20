import { Request, Response } from 'express';
import { OrderService } from '../service/order.service';
import { CreateOrderDto } from '../dto/createOrder.dto';
import { UpdateOrderDto } from '../dto/updateOrder.dto';
import { successResponse, errorResponse } from '../../../shared/utils/response.util';
import { io } from '../../../shared/socket';

export class OrderController {
  private orderService = new OrderService();

  async getAllOrders(req: Request, res: Response) {
    try {
      const orders = await this.orderService.getAllOrders();
      res.status(200).json(successResponse('Orders fetched successfully', orders));
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to fetch orders', error.message));
    }
  }

  async getOrderById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const order = await this.orderService.getOrderById(id);
      if (order) {
        res.status(200).json(successResponse('Order fetched successfully', order));
      } else {
        res.status(404).json(errorResponse('Order not found', 'Order not found'));
      }
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to fetch order', error.message));
    }
  }

  async createOrder(req: Request, res: Response) {
    try {
      const { sessionId, tableId, customerId, subtotal, discount, tax, total, items, selfOrder, paymentTag } = req.body;
      if (!sessionId || !tableId || subtotal == null || total == null) {
        return res.status(400).json(errorResponse('Missing required fields', 'sessionId, tableId, subtotal and total are required'));
      }

      const order = await this.orderService.createOrder({ 
        sessionId, 
        tableId, 
        customerId: (customerId && customerId.trim() !== '') ? customerId : undefined, 
        subtotal: Number(subtotal), 
        discount: discount ?? 0, 
        tax: tax ?? 0, 
        total: Number(total),
        selfOrder: !!selfOrder,
        paymentTag: paymentTag ?? null,
        items: items ?? []
      } as any);
      if (io) {
        io.emit('order:created', { orderId: order.id, tableId });
      }
      res.status(201).json(successResponse('Order created successfully', order));
    } catch (error: any) {
      console.error("Order creation failed in controller:", error);
      res.status(500).json(errorResponse('Failed to create order', error.message));
    }
  }

  async updateOrder(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const data = req.body as UpdateOrderDto;

      const order = await this.orderService.updateOrder(id, data);
      if (order) {
        res.status(200).json(successResponse('Order updated successfully', order));
      } else {
        res.status(404).json(errorResponse('Order not found', 'Order not found'));
      }
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to update order', error.message));
    }
  }

  async deleteOrder(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const order = await this.orderService.deleteOrder(id);
      if (order) {
        res.status(200).json(successResponse('Order deleted successfully', order));
      } else {
        res.status(404).json(errorResponse('Order not found', 'Order not found'));
      }
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to delete order', error.message));
    }
  }

  async sendToKitchen(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const order = await this.orderService.sendToKitchen(id);
      if (order) {
        if (io) {
          io.emit('order:sent-to-kitchen', { orderId: id });
        }
        res.status(200).json(successResponse('Order sent to kitchen', order));
      } else {
        res.status(404).json(errorResponse('Order not found', 'Order not found'));
      }
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to send order to kitchen', error.message));
    }
  }

  async updateOrderStatus(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const { status } = req.body;
      if (!status) {
        return res.status(400).json(errorResponse('Status is required', 'status is required'));
      }
      const order = await this.orderService.updateOrder(id, { status: status.toUpperCase() } as any);
      if (order) {
        res.status(200).json(successResponse('Order status updated successfully', order));
      } else {
        res.status(404).json(errorResponse('Order not found', 'Order not found'));
      }
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to update order status', error.message));
    }
  }

  async cancelOrder(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const order = await this.orderService.cancelOrder(id);
      if (order) {
        res.status(200).json(successResponse('Order cancelled successfully', order));
      } else {
        res.status(404).json(errorResponse('Order not found', 'Order not found'));
      }
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to cancel order', error.message));
    }
  }
}
