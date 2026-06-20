"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionService = void 0;
const client_1 = require("@prisma/client");
const session_repository_1 = require("../repository/session.repository");
class SessionService {
    sessionRepository = new session_repository_1.SessionRepository();
    async getCurrentSession(userId) {
        return this.sessionRepository.getCurrentSession(userId);
    }
    async getAllSessions() {
        return this.sessionRepository.getAllSessions();
    }
    async openSession(data) {
        return this.sessionRepository.openSession(data);
    }
    async closeSession(sessionId) {
        try {
            return await this.sessionRepository.closeSession(sessionId);
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return null;
            }
            throw error;
        }
    }
    async getSessionHistory(userId) {
        return this.sessionRepository.getSessionHistory(userId);
    }
}
exports.SessionService = SessionService;
