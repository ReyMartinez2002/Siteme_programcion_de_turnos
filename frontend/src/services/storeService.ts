import api from './api';
import { PanpayaStore, PanpayaStoreCreate } from '../types';

export const storeService = {
  getAll: async (): Promise<PanpayaStore[]> => {
    const response = await api.get('/api/stores/');
    return response.data;
  },

  getById: async (id: number): Promise<PanpayaStore> => {
    const response = await api.get(`/api/stores/${id}`);
    return response.data;
  },

  create: async (store: PanpayaStoreCreate): Promise<PanpayaStore> => {
    const response = await api.post('/api/stores/', store);
    return response.data;
  },

  update: async (id: number, store: Partial<PanpayaStoreCreate>): Promise<PanpayaStore> => {
    const response = await api.put(`/api/stores/${id}`, store);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/stores/${id}`);
  },
};
