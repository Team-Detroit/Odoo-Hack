import axiosInstance from '../lib/axios';
import { Customer, CreateCustomerRequest, UpdateCustomerRequest } from '../types/customer';

export const customerService = {
  getAll: async (): Promise<Customer[]> => {
    const response = await axiosInstance.get('/customers');
    return response.data.data?.customers || response.data.data || [];
  },

  getById: async (id: string): Promise<Customer> => {
    const response = await axiosInstance.get(`/customers/${id}`);
    return response.data.data?.customer || response.data.data || response.data;
  },

  search: async (query: string): Promise<Customer[]> => {
    const response = await axiosInstance.get(`/customers/search?q=${query}`);
    return response.data.data?.customers || response.data.data || [];
  },

  create: async (data: CreateCustomerRequest): Promise<Customer> => {
    const backendData = {
      name: data.name,
      email: data.email,
      phone: data.phoneNumber || (data as any).phone
    };
    const response = await axiosInstance.post('/customers', backendData);
    const item = response.data.data?.customer || response.data.data || response.data;
    return item;
  },

  update: async (id: string, data: Partial<CreateCustomerRequest>): Promise<Customer> => {
    const backendData: any = {};
    if (data.name !== undefined) backendData.name = data.name;
    if (data.email !== undefined) backendData.email = data.email;
    if (data.phoneNumber !== undefined) backendData.phone = data.phoneNumber;
    if ((data as any).phone !== undefined) backendData.phone = (data as any).phone;

    const response = await axiosInstance.put(`/customers/${id}`, backendData);
    const item = response.data.data?.customer || response.data.data || response.data;
    return item;
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
