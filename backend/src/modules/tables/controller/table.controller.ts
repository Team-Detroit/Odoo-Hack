import { Request, Response } from 'express';
import { TableService } from '../service/table.service';
import { CreateTableDto } from '../dto/createTable.dto';
import { UpdateTableDto } from '../dto/updateTable.dto';
import { UpdateTableStatusDto } from '../dto/updateTableStatus.dto';
import { successResponse, errorResponse } from '../../../shared/utils/response.util';
import { io } from '../../../shared/socket';

export class TableController {
  private tableService = new TableService();

  async getAllTables(req: Request, res: Response) {
    try {
      const tables = await this.tableService.getAllTables();
      res.status(200).json(successResponse('Tables fetched successfully', { tables }));
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to fetch tables', error.message));
    }
  }

  async getTableById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const table = await this.tableService.getTableById(id);
      if (table) {
        res.status(200).json(successResponse('Table fetched successfully', { table }));
      } else {
        res.status(404).json(errorResponse('Table not found', 'Table not found'));
      }
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to fetch table', error.message));
    }
  }

  async createTable(req: Request, res: Response) {
    try {
      const { number, seats, status, floorId } = req.body as CreateTableDto;
      if (!number || !seats || !floorId) {
        return res.status(400).json(errorResponse('Missing required fields', 'number, seats and floorId are required'));
      }

      const table = await this.tableService.createTable({ number, seats, status, floorId });
      res.status(201).json(successResponse('Table created successfully', { table }));
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to create table', error.message));
    }
  }

  async updateTable(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const data = req.body as UpdateTableDto;

      const table = await this.tableService.updateTable(id, data);
      if (table) {
        res.status(200).json(successResponse('Table updated successfully', { table }));
      } else {
        res.status(404).json(errorResponse('Table not found', 'Table not found'));
      }
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to update table', error.message));
    }
  }

  async deleteTable(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const table = await this.tableService.deleteTable(id);
      if (table) {
        res.status(200).json(successResponse('Table deleted successfully', {}));
      } else {
        res.status(404).json(errorResponse('Table not found', 'Table not found'));
      }
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to delete table', error.message));
    }
  }

  async updateTableStatus(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const { status } = req.body as UpdateTableStatusDto;

      if (!status) {
        return res.status(400).json(errorResponse('Missing required fields', 'status is required'));
      }

      const table = await this.tableService.updateTableStatus(id, status);
      if (table) {
        if (io) {
          io.emit('table:updated', { tableId: id, status });
        }
        res.status(200).json(successResponse('Table status updated successfully', { table }));
      } else {
        res.status(404).json(errorResponse('Table not found', 'Table not found'));
      }
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to update table status', error.message));
    }
  }
}
