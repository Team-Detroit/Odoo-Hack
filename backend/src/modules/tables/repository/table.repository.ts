import prisma from '../../../shared/prisma';
import { CreateTableDto } from '../dto/createTable.dto';
import { UpdateTableDto } from '../dto/updateTable.dto';
import { TableStatus } from '@prisma/client';

export class TableRepository {
  async getAllTables() {
    return prisma.table.findMany({ include: { floor: true } });
  }

  async getTableById(id: string) {
    return prisma.table.findUnique({ where: { id }, include: { floor: true } });
  }

  async createTable(data: CreateTableDto) {
    return prisma.table.create({ data, include: { floor: true } });
  }

  async updateTable(id: string, data: UpdateTableDto) {
    return prisma.table.update({ where: { id }, data, include: { floor: true } });
  }

  async deleteTable(id: string) {
    return prisma.table.delete({ where: { id } });
  }

  async updateTableStatus(id: string, status: TableStatus) {
    return prisma.table.update({ where: { id }, data: { status }, include: { floor: true } });
  }
}
