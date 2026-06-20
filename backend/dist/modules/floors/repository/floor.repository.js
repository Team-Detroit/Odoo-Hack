"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FloorRepository = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
class FloorRepository {
    async getAllFloors() {
        return prisma_1.default.floor.findMany({ include: { tables: true } });
    }
    async getFloorById(id) {
        return prisma_1.default.floor.findUnique({ where: { id }, include: { tables: true } });
    }
    async createFloor(data) {
        return prisma_1.default.floor.create({ data });
    }
    async updateFloor(id, data) {
        return prisma_1.default.floor.update({ where: { id }, data });
    }
    async deleteFloor(id) {
        return prisma_1.default.floor.delete({ where: { id } });
    }
}
exports.FloorRepository = FloorRepository;
