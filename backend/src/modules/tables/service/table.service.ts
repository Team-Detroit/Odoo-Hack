import { Prisma } from '@prisma/client';
import { TableRepository } from '../repository/table.repository';
import { CreateTableDto } from '../dto/createTable.dto';
import { UpdateTableDto } from '../dto/updateTable.dto';
import { TableStatus } from '@prisma/client';

export class TableService {
  private tableRepository = new TableRepository();

  async getAllTables() {
    return this.tableRepository.getAllTables();
  }

  async getTableById(id: string) {
    return this.tableRepository.getTableById(id);
  }

  async createTable(data: CreateTableDto) {
    return this.tableRepository.createTable(data);
  }

  async updateTable(id: string, data: UpdateTableDto) {
    try {
      return await this.tableRepository.updateTable(id, data);
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }

  async deleteTable(id: string) {
    try {
      return await this.tableRepository.deleteTable(id);
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }

  async updateTableStatus(id: string, status: TableStatus) {
    try {
      return await this.tableRepository.updateTableStatus(id, status);
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }
}
