"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionController = void 0;
const session_service_1 = require("../service/session.service");
const response_util_1 = require("../../../shared/utils/response.util");
class SessionController {
    sessionService = new session_service_1.SessionService();
    async getActiveSessionPublic(req, res) {
        try {
            const session = await this.sessionService.getActiveSessionPublic();
            if (session) {
                res.status(200).json((0, response_util_1.successResponse)('Active session fetched', session));
            }
            else {
                res.status(200).json((0, response_util_1.successResponse)('No active session found', null));
            }
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to fetch active session', error.message));
        }
    }
    async getCurrentSession(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json((0, response_util_1.errorResponse)('Unauthorized', 'User not authenticated'));
            }
            const session = await this.sessionService.getCurrentSession(req.user.id);
            if (session) {
                res.status(200).json((0, response_util_1.successResponse)('Current session fetched', session));
            }
            else {
                res.status(200).json((0, response_util_1.successResponse)('No active session found', null));
            }
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to fetch session', error.message));
        }
    }
    async openSession(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json((0, response_util_1.errorResponse)('Unauthorized', 'User not authenticated'));
            }
            const session = await this.sessionService.openSession({ userId: req.user.id });
            res.status(201).json((0, response_util_1.successResponse)('Session opened successfully', session));
        }
        catch (error) {
            console.error("Error opening session:", error);
            res.status(500).json((0, response_util_1.errorResponse)('Failed to open session', error.message));
        }
    }
    async closeSession(req, res) {
        try {
            const { sessionId } = req.body;
            if (!sessionId) {
                return res.status(400).json((0, response_util_1.errorResponse)('Missing required fields', 'sessionId is required'));
            }
            const session = await this.sessionService.closeSession(sessionId);
            if (session) {
                res.status(200).json((0, response_util_1.successResponse)('Session closed successfully', session));
            }
            else {
                res.status(404).json((0, response_util_1.errorResponse)('Session not found', 'Session not found'));
            }
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to close session', error.message));
        }
    }
    async getSessionHistory(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json((0, response_util_1.errorResponse)('Unauthorized', 'User not authenticated'));
            }
            const history = await this.sessionService.getSessionHistory(req.user.id);
            res.status(200).json((0, response_util_1.successResponse)('Session history fetched', history));
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to fetch session history', error.message));
        }
    }
}
exports.SessionController = SessionController;
