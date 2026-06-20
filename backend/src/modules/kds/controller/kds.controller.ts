import { Request, Response } from 'express';
import { KdsService } from '../service/kds.service';
import { UpdateKitchenTicketStatusDto } from '../dto/updateKitchenTicketStatus.dto';
import { successResponse, errorResponse } from '../../../shared/utils/response.util';
import { io } from '../../../shared/socket';
import { KitchenStatus } from '@prisma/client';

export class KdsController {
  private kdsService = new KdsService();

  async getAllKitchenTickets(req: Request, res: Response) {
    try {
      const tickets = await this.kdsService.getAllKitchenTickets();
      res.status(200).json(successResponse('Kitchen tickets fetched successfully', tickets));
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to fetch kitchen tickets', error.message));
    }
  }

  async getKitchenTicketById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const ticket = await this.kdsService.getKitchenTicketById(id);
      if (ticket) {
        res.status(200).json(successResponse('Kitchen ticket fetched successfully', ticket));
      } else {
        res.status(404).json(errorResponse('Kitchen ticket not found', 'Kitchen ticket not found'));
      }
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to fetch kitchen ticket', error.message));
    }
  }

  async getTicketsByStatus(req: Request, res: Response) {
    try {
      const status = String(req.params.status) as KitchenStatus;
      const tickets = await this.kdsService.getTicketsByStatus(status);
      res.status(200).json(successResponse('Kitchen tickets fetched successfully', tickets));
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to fetch kitchen tickets', error.message));
    }
  }

  async updateTicketStatus(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const { status } = req.body as UpdateKitchenTicketStatusDto;

      if (!status) {
        return res.status(400).json(errorResponse('Missing required fields', 'status is required'));
      }

      // Handle lowercase stage mapping from frontend if sent
      const normalizedStatus = (status.toUpperCase() === 'TO_COOK' ? 'TO_COOK' : status.toUpperCase()) as KitchenStatus;

      const ticket = await this.kdsService.updateTicketStatus(id, normalizedStatus);
      if (ticket) {
        if (io) {
          io.emit('kitchen:ticket-updated', { ticketId: id, status: normalizedStatus });
        }
        res.status(200).json(successResponse('Kitchen ticket status updated successfully', ticket));
      } else {
        res.status(404).json(errorResponse('Kitchen ticket not found', 'Kitchen ticket not found'));
      }
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to update kitchen ticket status', error.message));
    }
  }
}
