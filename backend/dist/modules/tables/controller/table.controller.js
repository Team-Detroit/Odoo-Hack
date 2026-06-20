"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableController = void 0;
const table_service_1 = require("../service/table.service");
const response_util_1 = require("../../../shared/utils/response.util");
const socket_1 = require("../../../shared/socket");
class TableController {
    tableService = new table_service_1.TableService();
    async getAllTables(req, res) {
        try {
            const tables = await this.tableService.getAllTables();
            res.status(200).json((0, response_util_1.successResponse)('Tables fetched successfully', { tables }));
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to fetch tables', error.message));
        }
    }
    async getTableById(req, res) {
        try {
            const id = String(req.params.id);
            const table = await this.tableService.getTableById(id);
            if (table) {
                res.status(200).json((0, response_util_1.successResponse)('Table fetched successfully', { table }));
            }
            else {
                res.status(404).json((0, response_util_1.errorResponse)('Table not found', 'Table not found'));
            }
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to fetch table', error.message));
        }
    }
    async createTable(req, res) {
        try {
            const { number, seats, status, floorId } = req.body;
            if (!number || !seats || !floorId) {
                return res.status(400).json((0, response_util_1.errorResponse)('Missing required fields', 'number, seats and floorId are required'));
            }
            const table = await this.tableService.createTable({ number, seats, status, floorId });
            res.status(201).json((0, response_util_1.successResponse)('Table created successfully', { table }));
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to create table', error.message));
        }
    }
    async updateTable(req, res) {
        try {
            const id = String(req.params.id);
            const data = req.body;
            const table = await this.tableService.updateTable(id, data);
            if (table) {
                res.status(200).json((0, response_util_1.successResponse)('Table updated successfully', { table }));
            }
            else {
                res.status(404).json((0, response_util_1.errorResponse)('Table not found', 'Table not found'));
            }
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to update table', error.message));
        }
    }
    async deleteTable(req, res) {
        try {
            const id = String(req.params.id);
            const table = await this.tableService.deleteTable(id);
            if (table) {
                res.status(200).json((0, response_util_1.successResponse)('Table deleted successfully', {}));
            }
            else {
                res.status(404).json((0, response_util_1.errorResponse)('Table not found', 'Table not found'));
            }
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to delete table', error.message));
        }
    }
    async updateTableStatus(req, res) {
        try {
            const id = String(req.params.id);
            const { status } = req.body;
            if (!status) {
                return res.status(400).json((0, response_util_1.errorResponse)('Missing required fields', 'status is required'));
            }
            const table = await this.tableService.updateTableStatus(id, status);
            if (table) {
                if (socket_1.io) {
                    socket_1.io.emit('table:updated', { tableId: id, status });
                }
                res.status(200).json((0, response_util_1.successResponse)('Table status updated successfully', { table }));
            }
            else {
                res.status(404).json((0, response_util_1.errorResponse)('Table not found', 'Table not found'));
            }
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to update table status', error.message));
        }
    }
}
exports.TableController = TableController;
