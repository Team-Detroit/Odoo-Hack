import axiosInstance from '../lib/axios';
import { Customer, CreateCustomerRequest, UpdateCustomerRequest } from '../types/customer';

export const customerService = {
  getAll: async (): Promise<Customer[]> => {
    const response = await axiosInstance.get('/customers');
    return response.data.data?.customers || response.data.data || [];
  },

  getById: async (id: string): Promise<Customer> => {
    const response = await axiosInstance.get(`/customers/${id}`);
    return response.data.data?.customers || response.data.data || [];
  },

  search: async (query: string): Promise<Customer[]> => {
    const response = await axiosInstance.get(`/customers/search?q=${query}`);
    return response.data.data?.customers || response.data.data || [];
  },

  create: async (data: CreateCustomerRequest): Promise<Customer> => {
    const response = await axiosInstance.post('/customers', data);
    return response.data.data?.customers || response.data.data || [];
  },

  update: async (id: string, data: Partial<CreateCustomerRequest>): Promise<Customer> => {
    const response = await axiosInstance.put(`/customers/${id}`, data);
    return response.data.data?.customers || response.data.data || [];
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/customers/${id}`);
  },

  mockCustomers: [
    { id: '1', name: 'Raj Kumar', email: 'raj@example.com', phoneNumber: '9876543210', isActive: true, createdAt: '', updatedAt: '' },
  ],

  mockGetAll: async (): Promise<Customer[]> => {
    return customerService.getAll();
  },
};
