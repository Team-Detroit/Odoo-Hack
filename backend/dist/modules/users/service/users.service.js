"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const users_repository_1 = require("../repository/users.repository");
class UsersService {
    usersRepository = new users_repository_1.UsersRepository();
    async getAll() {
        const users = await this.usersRepository.getAll();
        return users.map(u => {
            const { password, ...userWithoutPassword } = u;
            return { ...userWithoutPassword, isActive: true }; // Add isActive to match frontend mockup expectation
        });
    }
    async getById(id) {
        const user = await this.usersRepository.getById(id);
        if (!user)
            throw new Error('User not found');
        const { password, ...userWithoutPassword } = user;
        return { ...userWithoutPassword, isActive: true };
    }
    async create(data) {
        const existing = await this.usersRepository.getByEmail(data.email);
        if (existing)
            throw new Error('Email already registered');
        const plainPassword = data.password || 'password123';
        const passwordHash = await bcryptjs_1.default.hash(plainPassword, 10);
        const user = await this.usersRepository.create({ ...data, passwordHash });
        const { password, ...userWithoutPassword } = user;
        return { ...userWithoutPassword, isActive: true };
    }
    async update(id, data) {
        let passwordHash;
        if (data.password) {
            passwordHash = await bcryptjs_1.default.hash(data.password, 10);
        }
        const user = await this.usersRepository.update(id, { ...data, passwordHash });
        const { password, ...userWithoutPassword } = user;
        return { ...userWithoutPassword, isActive: true };
    }
    async delete(id) {
        await this.usersRepository.delete(id);
    }
    async changePassword(userId, oldPw, newPw) {
        const user = await this.usersRepository.getById(userId);
        if (!user)
            throw new Error('User not found');
        const matches = await bcryptjs_1.default.compare(oldPw, user.password);
        if (!matches)
            throw new Error('Invalid old password');
        const passwordHash = await bcryptjs_1.default.hash(newPw, 10);
        await this.usersRepository.update(userId, { passwordHash });
    }
}
exports.UsersService = UsersService;
