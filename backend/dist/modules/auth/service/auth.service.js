"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const auth_repository_1 = require("../repository/auth.repository");
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';
class AuthService {
    authRepository = new auth_repository_1.AuthRepository();
    async signup(data) {
        const existingUser = await this.authRepository.findUserByEmail(data.email);
        if (existingUser) {
            throw new Error('User already exists');
        }
        const hashedPassword = await bcryptjs_1.default.hash(data.password, Number(process.env.BCRYPT_ROUNDS || 10));
        return this.authRepository.createUser({
            ...data,
            password: hashedPassword,
        });
    }
    async login(data) {
        const user = await this.authRepository.findUserByEmail(data.email);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        const passwordMatches = await bcryptjs_1.default.compare(data.password, user.password);
        if (!passwordMatches) {
            throw new Error('Invalid credentials');
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
        return { user, token };
    }
    async changePassword(userId, data) {
        const user = await this.authRepository.findUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const currentMatches = await bcryptjs_1.default.compare(data.currentPassword, user.password);
        if (!currentMatches) {
            throw new Error('Current password is incorrect');
        }
        const hashedPassword = await bcryptjs_1.default.hash(data.newPassword, Number(process.env.BCRYPT_ROUNDS || 10));
        return prisma_1.default.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
    }
}
exports.AuthService = AuthService;
