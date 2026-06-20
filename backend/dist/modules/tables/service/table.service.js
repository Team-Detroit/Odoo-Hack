"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableService = void 0;
const client_1 = require("@prisma/client");
const table_repository_1 = require("../repository/table.repository");
class TableService {
    tableRepository = new table_repository_1.TableRepository();
    async getAllTables() {
        return this.tableRepository.getAllTables();
    }
    async getTableById(id) {
        return this.tableRepository.getTableById(id);
    }
    async createTable(data) {
        return this.tableRepository.createTable(data);
    }
    async updateTable(id, data) {
        try {
            return await this.tableRepository.updateTable(id, data);
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return null;
            }
            throw error;
        }
    }
    async deleteTable(id) {
        try {
            return await this.tableRepository.deleteTable(id);
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return null;
            }
            throw error;
        }
    }
    async updateTableStatus(id, status) {
        try {
            return await this.tableRepository.updateTableStatus(id, status);
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return null;
            }
            throw error;
        }
    }
}
exports.TableService = TableService;
