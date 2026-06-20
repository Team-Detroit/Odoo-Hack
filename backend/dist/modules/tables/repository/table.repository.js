"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableRepository = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
class TableRepository {
    async getAllTables() {
        return prisma_1.default.table.findMany({ include: { floor: true } });
    }
    async getTableById(id) {
        return prisma_1.default.table.findUnique({ where: { id }, include: { floor: true } });
    }
    async createTable(data) {
        return prisma_1.default.table.create({ data, include: { floor: true } });
    }
    async updateTable(id, data) {
        return prisma_1.default.table.update({ where: { id }, data, include: { floor: true } });
    }
    async deleteTable(id) {
        return prisma_1.default.table.delete({ where: { id } });
    }
    async updateTableStatus(id, status) {
        return prisma_1.default.table.update({ where: { id }, data: { status }, include: { floor: true } });
    }
}
exports.TableRepository = TableRepository;
