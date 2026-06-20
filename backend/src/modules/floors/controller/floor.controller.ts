import { Request, Response } from 'express';
import { FloorService } from '../service/floor.service';
import { CreateFloorDto } from '../dto/createFloor.dto';
import { UpdateFloorDto } from '../dto/updateFloor.dto';
import { successResponse, errorResponse } from '../../../shared/utils/response.util';

export class FloorController {
  private floorService = new FloorService();

  async getAllFloors(req: Request, res: Response) {
    try {
      const floors = await this.floorService.getAllFloors();
      res.status(200).json(successResponse('Floors fetched successfully', { floors }));
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to fetch floors', error.message));
    }
  }

  async getFloorById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const floor = await this.floorService.getFloorById(id);
      if (floor) {
        res.status(200).json(successResponse('Floor fetched successfully', { floor }));
      } else {
        res.status(404).json(errorResponse('Floor not found', 'Floor not found'));
      }
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to fetch floor', error.message));
    }
  }

  async createFloor(req: Request, res: Response) {
    try {
      const { name } = req.body as CreateFloorDto;
      if (!name) {
        return res.status(400).json(errorResponse('Missing required fields', 'Name is required'));
      }

      const floor = await this.floorService.createFloor({ name });
      res.status(201).json(successResponse('Floor created successfully', { floor }));
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to create floor', error.message));
    }
  }

  async updateFloor(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const data = req.body as UpdateFloorDto;

      const floor = await this.floorService.updateFloor(id, data);
      if (floor) {
        res.status(200).json(successResponse('Floor updated successfully', { floor }));
      } else {
        res.status(404).json(errorResponse('Floor not found', 'Floor not found'));
      }
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to update floor', error.message));
    }
  }

  async deleteFloor(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const floor = await this.floorService.deleteFloor(id);
      if (floor) {
        res.status(200).json(successResponse('Floor deleted successfully', {}));
      } else {
        res.status(404).json(errorResponse('Floor not found', 'Floor not found'));
      }
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to delete floor', error.message));
    }
  }
}
