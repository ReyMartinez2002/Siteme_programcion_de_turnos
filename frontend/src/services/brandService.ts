import api from './api';
import { ExternalBrand, ExternalBrandCreate } from '../types';

export const brandService = {
  getAll: async (): Promise<ExternalBrand[]> => {
    const response = await api.get('/api/brands/');
    return response.data;
  },

  create: async (brand: ExternalBrandCreate): Promise<ExternalBrand> => {
    const response = await api.post('/api/brands/', brand);
    return response.data;
  },

  update: async (id: number, brand: Partial<ExternalBrandCreate>): Promise<ExternalBrand> => {
    const response = await api.put(`/api/brands/${id}`, brand);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/brands/${id}`);
  },
};
