"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerService = void 0;
const client_1 = require("@prisma/client");
const customer_repository_1 = require("../repository/customer.repository");
class CustomerService {
    customerRepository = new customer_repository_1.CustomerRepository();
    async getAllCustomers() {
        return this.customerRepository.getAllCustomers();
    }
    async getCustomerById(id) {
        return this.customerRepository.getCustomerById(id);
    }
    async createCustomer(data) {
        return this.customerRepository.createCustomer(data);
    }
    async updateCustomer(id, data) {
        try {
            return await this.customerRepository.updateCustomer(id, data);
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return null;
            }
            throw error;
        }
    }
    async deleteCustomer(id) {
        try {
            return await this.customerRepository.deleteCustomer(id);
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return null;
            }
            throw error;
        }
    }
}
exports.CustomerService = CustomerService;
