"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionRepository = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
class SessionRepository {
    async getActiveSessionPublic() {
        return prisma_1.default.session.findFirst({
            where: { status: 'OPEN' },
        });
    }
    async getCurrentSession(userId) {
        return prisma_1.default.session.findFirst({
            where: { userId, status: 'OPEN' },
        });
    }
    async getAllSessions() {
        return prisma_1.default.session.findMany();
    }
    async openSession(data) {
        return prisma_1.default.session.create({ data: { userId: data.userId, status: 'OPEN' } });
    }
    async closeSession(sessionId) {
        return prisma_1.default.session.update({
            where: { id: sessionId },
            data: { status: 'CLOSED', closedAt: new Date() },
        });
    }
    async getSessionHistory(userId) {
        return prisma_1.default.session.findMany({ where: { userId }, orderBy: { openedAt: 'desc' } });
    }
}
exports.SessionRepository = SessionRepository;
