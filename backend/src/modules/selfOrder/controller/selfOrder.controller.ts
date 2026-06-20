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

  async getConfig(req: Request, res: Response) {
    const fs = require('fs');
    const path = require('path');
    const CONFIG_FILE = path.join(process.cwd(), 'self_ordering_config.json');
    let isEnabled = false;
    let mode = 'online';
    try {
      if (fs.existsSync(CONFIG_FILE)) {
        const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
        isEnabled = !!config.isEnabled;
        mode = config.mode || 'online';
      }
    } catch (e) {
      console.error('Error reading self ordering config:', e);
    }
    res.status(200).json({ isEnabled, mode, backgroundColor: '#ffffff', backgroundImages: [], tableQRCodes: [] });
  }

  async updateConfig(req: Request, res: Response) {
    const fs = require('fs');
    const path = require('path');
    const CONFIG_FILE = path.join(process.cwd(), 'self_ordering_config.json');
    const { isEnabled, mode } = req.body;
    const config = { isEnabled: isEnabled !== undefined ? !!isEnabled : false, mode: mode || 'online' };
    try {
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');
    } catch (e) {
      console.error('Error writing self ordering config:', e);
    }
    res.status(200).json({ ...config, backgroundColor: '#ffffff', backgroundImages: [], tableQRCodes: [] });
  }
}
