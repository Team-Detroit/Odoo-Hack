"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRepository = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
class CustomerRepository {
    async getAllCustomers() {
        return prisma_1.default.customer.findMany();
    }
    async getCustomerById(id) {
        return prisma_1.default.customer.findUnique({ where: { id } });
    }
    async createCustomer(data) {
        return prisma_1.default.customer.create({ data });
    }
    async updateCustomer(id, data) {
        return prisma_1.default.customer.update({ where: { id }, data });
    }
    async deleteCustomer(id) {
        return prisma_1.default.customer.delete({ where: { id } });
    }
}
exports.CustomerRepository = CustomerRepository;
