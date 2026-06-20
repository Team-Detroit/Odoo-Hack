"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../service/auth.service");
const response_util_1 = require("../../../shared/utils/response.util");
class AuthController {
    authService = new auth_service_1.AuthService();
    async signup(req, res) {
        try {
            const data = req.body;
            if (!data.name || !data.email || !data.password || !data.role) {
                return res.status(400).json((0, response_util_1.errorResponse)('Missing required fields', 'name, email, password and role are required'));
            }
            const user = await this.authService.signup({
                ...data,
                role: data.role.toUpperCase()
            });
            res.status(201).json((0, response_util_1.successResponse)('User created successfully', { user }));
        }
        catch (error) {
            res.status(400).json((0, response_util_1.errorResponse)(error.message, error.message));
        }
    }
    async login(req, res) {
        try {
            const data = req.body;
            if (!data.email || !data.password) {
                return res.status(400).json((0, response_util_1.errorResponse)('Missing required fields', 'email and password are required'));
            }
            const result = await this.authService.login(data);
            res.status(200).json((0, response_util_1.successResponse)('Login successful', result));
        }
        catch (error) {
            res.status(401).json((0, response_util_1.errorResponse)(error.message, error.message));
        }
    }
    async me(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json((0, response_util_1.errorResponse)('Unauthorized', 'User not authenticated'));
            }
            res.status(200).json((0, response_util_1.successResponse)('User details fetched', { user: req.user }));
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)(error.message, error.message));
        }
    }
    async logout(req, res) {
        try {
            res.status(200).json((0, response_util_1.successResponse)('Logout successful', {}));
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)(error.message, error.message));
        }
    }
    async changePassword(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json((0, response_util_1.errorResponse)('Unauthorized', 'User not authenticated'));
            }
            const data = req.body;
            if (!data.currentPassword || !data.newPassword) {
                return res.status(400).json((0, response_util_1.errorResponse)('Missing required fields', 'currentPassword and newPassword are required'));
            }
            await this.authService.changePassword(req.user.id, data);
            res.status(200).json((0, response_util_1.successResponse)('Password changed successfully', {}));
        }
        catch (error) {
            res.status(400).json((0, response_util_1.errorResponse)(error.message, error.message));
        }
    }
}
exports.AuthController = AuthController;
