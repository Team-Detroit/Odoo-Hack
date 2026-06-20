import axiosInstance from '../lib/axios';

export interface SelfOrderingConfig {
  isEnabled: boolean;
  mode: 'online' | 'qr-only';
  backgroundColor: string;
  backgroundImages: string[];
  tableQRCodes: Array<{
    tableToken: string;
    tableNumber: number;
    url: string;
  }>;
}

export const selfOrderingService = {
  getConfig: async (): Promise<SelfOrderingConfig> => {
    const response = await axiosInstance.get('/self-ordering/config');
    return response.data;
  },

  updateConfig: async (config: Partial<SelfOrderingConfig>): Promise<SelfOrderingConfig> => {
    const response = await axiosInstance.put('/self-ordering/config', config);
    return response.data;
  },

  generateTableQRCode: async (tableId: string): Promise<{ token: string; qrUrl: string }> => {
    const response = await axiosInstance.post(`/self-ordering/generate-qr/${tableId}`);
    return response.data;
  },

  mockGetConfig: async (): Promise<SelfOrderingConfig> => {
    try {
      return await selfOrderingService.getConfig();
    } catch {
      return {
        isEnabled: true,
        mode: 'online',
        backgroundColor: '#f5f5f5',
        backgroundImages: [],
        tableQRCodes: [
          {
            tableToken: 'table_token_1',
            tableNumber: 1,
            url: 'http://localhost:5173/s/table_token_1',
          },
        ],
      };
    }
  },
};
