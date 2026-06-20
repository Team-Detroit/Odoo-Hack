"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FloorController = void 0;
const floor_service_1 = require("../service/floor.service");
const response_util_1 = require("../../../shared/utils/response.util");
class FloorController {
    floorService = new floor_service_1.FloorService();
    async getAllFloors(req, res) {
        try {
            const floors = await this.floorService.getAllFloors();
            res.status(200).json((0, response_util_1.successResponse)('Floors fetched successfully', floors));
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to fetch floors', error.message));
        }
    }
    async getFloorById(req, res) {
        try {
            const id = String(req.params.id);
            const floor = await this.floorService.getFloorById(id);
            if (floor) {
                res.status(200).json((0, response_util_1.successResponse)('Floor fetched successfully', floor));
            }
            else {
                res.status(404).json((0, response_util_1.errorResponse)('Floor not found', 'Floor not found'));
            }
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to fetch floor', error.message));
        }
    }
    async createFloor(req, res) {
        try {
            const { name } = req.body;
            if (!name) {
                return res.status(400).json((0, response_util_1.errorResponse)('Missing required fields', 'Name is required'));
            }
            const floor = await this.floorService.createFloor({ name });
            res.status(201).json((0, response_util_1.successResponse)('Floor created successfully', floor));
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to create floor', error.message));
        }
    }
    async updateFloor(req, res) {
        try {
            const id = String(req.params.id);
            const data = req.body;
            const floor = await this.floorService.updateFloor(id, data);
            if (floor) {
                res.status(200).json((0, response_util_1.successResponse)('Floor updated successfully', floor));
            }
            else {
                res.status(404).json((0, response_util_1.errorResponse)('Floor not found', 'Floor not found'));
            }
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to update floor', error.message));
        }
    }
    async deleteFloor(req, res) {
        try {
            const id = String(req.params.id);
            const floor = await this.floorService.deleteFloor(id);
            if (floor) {
                res.status(200).json((0, response_util_1.successResponse)('Floor deleted successfully', floor));
            }
            else {
                res.status(404).json((0, response_util_1.errorResponse)('Floor not found', 'Floor not found'));
            }
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to delete floor', error.message));
        }
    }
}
exports.FloorController = FloorController;
