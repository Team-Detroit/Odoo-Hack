"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRepository = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
class UsersRepository {
    async getAll() {
        return prisma_1.default.user.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }
    async getById(id) {
        return prisma_1.default.user.findUnique({ where: { id } });
    }
    async getByEmail(email) {
        return prisma_1.default.user.findUnique({ where: { email } });
    }
    async create(data) {
        return prisma_1.default.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: data.passwordHash,
                role: data.role.toUpperCase(),
            }
        });
    }
    async update(id, data) {
        const updateData = {};
        if (data.name !== undefined)
            updateData.name = data.name;
        if (data.email !== undefined)
            updateData.email = data.email;
        if (data.role !== undefined)
            updateData.role = data.role.toUpperCase();
        if (data.passwordHash !== undefined)
            updateData.password = data.passwordHash;
        return prisma_1.default.user.update({
            where: { id },
            data: updateData
        });
    }
    async delete(id) {
        return prisma_1.default.user.delete({ where: { id } });
    }
}
exports.UsersRepository = UsersRepository;
