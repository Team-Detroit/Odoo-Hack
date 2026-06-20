"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const users_service_1 = require("../service/users.service");
const response_util_1 = require("../../../shared/utils/response.util");
class UsersController {
    usersService = new users_service_1.UsersService();
    async getAll(req, res) {
        try {
            const users = await this.usersService.getAll();
            res.status(200).json((0, response_util_1.successResponse)('Users fetched successfully', users));
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to fetch users', error.message));
        }
    }
    async getById(req, res) {
        try {
            const user = await this.usersService.getById(req.params.id);
            res.status(200).json((0, response_util_1.successResponse)('User fetched successfully', user));
        }
        catch (error) {
            res.status(404).json((0, response_util_1.errorResponse)('User not found', error.message));
        }
    }
    async create(req, res) {
        try {
            const user = await this.usersService.create(req.body);
            res.status(201).json((0, response_util_1.successResponse)('User created successfully', user));
        }
        catch (error) {
            res.status(400).json((0, response_util_1.errorResponse)('Failed to create user', error.message));
        }
    }
    async update(req, res) {
        try {
            const user = await this.usersService.update(req.params.id, req.body);
            res.status(200).json((0, response_util_1.successResponse)('User updated successfully', user));
        }
        catch (error) {
            res.status(400).json((0, response_util_1.errorResponse)('Failed to update user', error.message));
        }
    }
    async delete(req, res) {
        try {
            const user = await this.usersService.delete(req.params.id);
            res.status(200).json((0, response_util_1.successResponse)('User deleted successfully', user));
        }
        catch (error) {
            res.status(400).json((0, response_util_1.errorResponse)('Failed to delete user', error.message));
        }
    }
    async changePassword(req, res) {
        try {
            const { userId, oldPassword, newPassword } = req.body;
            await this.usersService.changePassword(userId, oldPassword, newPassword);
            res.status(200).json((0, response_util_1.successResponse)('Password updated successfully', true));
        }
        catch (error) {
            res.status(400).json((0, response_util_1.errorResponse)('Failed to update password', error.message));
        }
    }
}
exports.UsersController = UsersController;
