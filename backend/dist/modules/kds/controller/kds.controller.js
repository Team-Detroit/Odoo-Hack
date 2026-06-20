"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KdsController = void 0;
const kds_service_1 = require("../service/kds.service");
const response_util_1 = require("../../../shared/utils/response.util");
const socket_1 = require("../../../shared/socket");
class KdsController {
    kdsService = new kds_service_1.KdsService();
    async getAllKitchenTickets(req, res) {
        try {
            const tickets = await this.kdsService.getAllKitchenTickets();
            res.status(200).json((0, response_util_1.successResponse)('Kitchen tickets fetched successfully', tickets));
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to fetch kitchen tickets', error.message));
        }
    }
    async getKitchenTicketById(req, res) {
        try {
            const id = String(req.params.id);
            const ticket = await this.kdsService.getKitchenTicketById(id);
            if (ticket) {
                res.status(200).json((0, response_util_1.successResponse)('Kitchen ticket fetched successfully', ticket));
            }
            else {
                res.status(404).json((0, response_util_1.errorResponse)('Kitchen ticket not found', 'Kitchen ticket not found'));
            }
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to fetch kitchen ticket', error.message));
        }
    }
    async getTicketsByStatus(req, res) {
        try {
            const status = String(req.params.status);
            const tickets = await this.kdsService.getTicketsByStatus(status);
            res.status(200).json((0, response_util_1.successResponse)('Kitchen tickets fetched successfully', tickets));
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to fetch kitchen tickets', error.message));
        }
    }
    async updateTicketStatus(req, res) {
        try {
            const id = String(req.params.id);
            const { status } = req.body;
            if (!status) {
                return res.status(400).json((0, response_util_1.errorResponse)('Missing required fields', 'status is required'));
            }
            // Handle lowercase stage mapping from frontend if sent
            const normalizedStatus = (status.toUpperCase() === 'TO_COOK' ? 'TO_COOK' : status.toUpperCase());
            const ticket = await this.kdsService.updateTicketStatus(id, normalizedStatus);
            if (ticket) {
                if (socket_1.io) {
                    socket_1.io.emit('kitchen:ticket-updated', { ticketId: id, status: normalizedStatus });
                }
                res.status(200).json((0, response_util_1.successResponse)('Kitchen ticket status updated successfully', ticket));
            }
            else {
                res.status(404).json((0, response_util_1.errorResponse)('Kitchen ticket not found', 'Kitchen ticket not found'));
            }
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to update kitchen ticket status', error.message));
        }
    }
    async deleteKitchenTicket(req, res) {
        try {
            const id = String(req.params.id);
            const ticket = await this.kdsService.deleteKitchenTicket(id);
            if (ticket) {
                if (socket_1.io) {
                    socket_1.io.emit('kitchen:ticket-deleted', { ticketId: id });
                }
                res.status(200).json((0, response_util_1.successResponse)('Kitchen ticket deleted successfully', ticket));
            }
            else {
                res.status(404).json((0, response_util_1.errorResponse)('Kitchen ticket not found', 'Kitchen ticket not found'));
            }
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to delete kitchen ticket', error.message));
        }
    }
}
exports.KdsController = KdsController;
