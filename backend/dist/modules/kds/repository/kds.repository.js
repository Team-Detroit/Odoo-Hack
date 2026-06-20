"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KdsRepository = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
class KdsRepository {
    async getAllKitchenTickets() {
        return prisma_1.default.kitchenTicket.findMany({
            include: {
                order: {
                    include: {
                        items: {
                            include: { product: true }
                        },
                        customer: true,
                        table: true
                    }
                }
            }
        });
    }
    async getKitchenTicketById(id) {
        return prisma_1.default.kitchenTicket.findUnique({
            where: { id },
            include: {
                order: {
                    include: {
                        items: {
                            include: { product: true }
                        },
                        customer: true,
                        table: true
                    }
                }
            }
        });
    }
    async getTicketsByStatus(status) {
        return prisma_1.default.kitchenTicket.findMany({
            where: { status },
            include: {
                order: {
                    include: {
                        items: {
                            include: { product: true }
                        },
                        customer: true,
                        table: true
                    }
                }
            }
        });
    }
    async updateTicketStatus(id, status) {
        return prisma_1.default.kitchenTicket.update({
            where: { id },
            data: { status },
            include: {
                order: {
                    include: {
                        items: {
                            include: { product: true }
                        },
                        customer: true,
                        table: true
                    }
                }
            }
        });
    }
}
exports.KdsRepository = KdsRepository;
