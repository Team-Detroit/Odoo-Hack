"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerController = void 0;
const customer_service_1 = require("../service/customer.service");
const response_util_1 = require("../../../shared/utils/response.util");
class CustomerController {
    customerService = new customer_service_1.CustomerService();
    async getAllCustomers(req, res) {
        try {
            const customers = await this.customerService.getAllCustomers();
            res.status(200).json((0, response_util_1.successResponse)('Customers fetched successfully', customers));
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to fetch customers', error.message));
        }
    }
    async getCustomerById(req, res) {
        try {
            const id = String(req.params.id);
            const customer = await this.customerService.getCustomerById(id);
            if (customer) {
                res.status(200).json((0, response_util_1.successResponse)('Customer fetched successfully', customer));
            }
            else {
                res.status(404).json((0, response_util_1.errorResponse)('Customer not found', 'Customer not found'));
            }
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to fetch customer', error.message));
        }
    }
    async createCustomer(req, res) {
        try {
            const { name, phone, email } = req.body;
            if (!name) {
                return res.status(400).json((0, response_util_1.errorResponse)('Missing required fields', 'Name is required'));
            }
            const customer = await this.customerService.createCustomer({ name, phone, email });
            res.status(201).json((0, response_util_1.successResponse)('Customer created successfully', customer));
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to create customer', error.message));
        }
    }
    async updateCustomer(req, res) {
        try {
            const id = String(req.params.id);
            const data = req.body;
            const customer = await this.customerService.updateCustomer(id, data);
            if (customer) {
                res.status(200).json((0, response_util_1.successResponse)('Customer updated successfully', customer));
            }
            else {
                res.status(404).json((0, response_util_1.errorResponse)('Customer not found', 'Customer not found'));
            }
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to update customer', error.message));
        }
    }
    async deleteCustomer(req, res) {
        try {
            const id = String(req.params.id);
            const customer = await this.customerService.deleteCustomer(id);
            if (customer) {
                res.status(200).json((0, response_util_1.successResponse)('Customer deleted successfully', customer));
            }
            else {
                res.status(404).json((0, response_util_1.errorResponse)('Customer not found', 'Customer not found'));
            }
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to delete customer', error.message));
        }
    }
}
exports.CustomerController = CustomerController;
