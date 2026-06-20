import { Request, Response } from 'express';
import { SelfOrderService } from '../service/selfOrder.service';
import { CreateSelfOrderDto } from '../dto/createSelfOrder.dto';
import { successResponse, errorResponse } from '../../../shared/utils/response.util';

export class SelfOrderController {
  private selfOrderService = new SelfOrderService();

  async getMenuByToken(req: Request, res: Response) {
    try {
      const token = String(req.params.token);
      const menu = await this.selfOrderService.getMenuByToken(token);
      if (menu) {
        res.status(200).json(successResponse('Menu fetched successfully', { menu }));
      } else {
        res.status(404).json(errorResponse('Invalid token', 'Invalid token'));
      }
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to fetch menu', error.message));
    }
  }

  async createOrderByToken(req: Request, res: Response) {
    try {
      const token = String(req.params.token);
      const { items } = req.body as CreateSelfOrderDto;

      if (!items || items.length === 0) {
        return res.status(400).json(errorResponse('Missing required fields', 'items array is required'));
      }

      const order = await this.selfOrderService.createOrderByToken(token, items);
      if (order) {
        res.status(201).json(successResponse('Order created successfully', { order }));
      } else {
        res.status(404).json(errorResponse('Invalid token', 'Invalid token'));
      }
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to create order', error.message));
    }
  }

  async getOrderStatusByToken(req: Request, res: Response) {
    try {
      const token = String(req.params.token);
      const order = await this.selfOrderService.getOrderStatusByToken(token);
      if (order) {
        res.status(200).json(successResponse('Order status fetched successfully', { order }));
      } else {
        res.status(404).json(errorResponse('No order found', 'No order found for this token'));
      }
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to fetch order status', error.message));
    }
  }
}
