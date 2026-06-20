"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FloorService = void 0;
const client_1 = require("@prisma/client");
const floor_repository_1 = require("../repository/floor.repository");
class FloorService {
    floorRepository = new floor_repository_1.FloorRepository();
    async getAllFloors() {
        return this.floorRepository.getAllFloors();
    }
    async getFloorById(id) {
        return this.floorRepository.getFloorById(id);
    }
    async createFloor(data) {
        return this.floorRepository.createFloor(data);
    }
    async updateFloor(id, data) {
        try {
            return await this.floorRepository.updateFloor(id, data);
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return null;
            }
            throw error;
        }
    }
    async deleteFloor(id) {
        try {
            return await this.floorRepository.deleteFloor(id);
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return null;
            }
            throw error;
        }
    }
}
exports.FloorService = FloorService;
