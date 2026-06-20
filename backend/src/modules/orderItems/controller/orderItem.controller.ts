import { Request, Response } from 'express';
import { OrderItemService } from '../service/orderItem.service';
import { CreateOrderItemDto } from '../dto/createOrderItem.dto';
import { UpdateOrderItemDto } from '../dto/updateOrderItem.dto';
import { successResponse, errorResponse } from '../../../shared/utils/response.util';

export class OrderItemController {
  private orderItemService = new OrderItemService();

  async getOrderItemsByOrderId(req: Request, res: Response) {
    try {
      const orderId = String(req.params.orderId);
      const items = await this.orderItemService.getOrderItemsByOrderId(orderId);
      res.status(200).json(successResponse('Order items fetched successfully', { items }));
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to fetch order items', error.message));
    }
  }

  async getOrderItemById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const item = await this.orderItemService.getOrderItemById(id);
      if (item) {
        res.status(200).json(successResponse('Order item fetched successfully', { item }));
      } else {
        res.status(404).json(errorResponse('Order item not found', 'Order item not found'));
      }
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to fetch order item', error.message));
    }
  }

  async createOrderItem(req: Request, res: Response) {
    try {
      const { orderId, productId, quantity, price } = req.body as CreateOrderItemDto;
      if (!orderId || !productId || quantity == null || price == null) {
        return res.status(400).json(errorResponse('Missing required fields', 'orderId, productId, quantity and price are required'));
      }

      const total = quantity * price;
      const item = await this.orderItemService.createOrderItem({ orderId, productId, quantity, price, total });
      res.status(201).json(successResponse('Order item created successfully', { item }));
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to create order item', error.message));
    }
  }

  async updateOrderItem(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const data = req.body as UpdateOrderItemDto;

      const item = await this.orderItemService.updateOrderItem(id, data);
      if (item) {
        res.status(200).json(successResponse('Order item updated successfully', { item }));
      } else {
        res.status(404).json(errorResponse('Order item not found', 'Order item not found'));
      }
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to update order item', error.message));
    }
  }

  async deleteOrderItem(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const item = await this.orderItemService.deleteOrderItem(id);
      if (item) {
        res.status(200).json(successResponse('Order item deleted successfully', {}));
      } else {
        res.status(404).json(errorResponse('Order item not found', 'Order item not found'));
      }
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to delete order item', error.message));
    }
  }
}
