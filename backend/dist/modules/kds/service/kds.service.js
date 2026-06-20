"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KdsService = void 0;
const client_1 = require("@prisma/client");
const kds_repository_1 = require("../repository/kds.repository");
class KdsService {
    kdsRepository = new kds_repository_1.KdsRepository();
    async getAllKitchenTickets() {
        return this.kdsRepository.getAllKitchenTickets();
    }
    async getKitchenTicketById(id) {
        return this.kdsRepository.getKitchenTicketById(id);
    }
    async getTicketsByStatus(status) {
        return this.kdsRepository.getTicketsByStatus(status);
    }
    async updateTicketStatus(id, status) {
        try {
            return await this.kdsRepository.updateTicketStatus(id, status);
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return null;
            }
            throw error;
        }
    }
}
exports.KdsService = KdsService;
