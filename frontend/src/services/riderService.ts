import api from './api';
import { Rider, RiderCreate } from '../types';

export const riderService = {
  getAll: async (activeOnly = false): Promise<Rider[]> => {
    const response = await api.get('/api/riders/', {
      params: { active_only: activeOnly },
    });
    return response.data;
  },

  getById: async (id: number): Promise<Rider> => {
    const response = await api.get(`/api/riders/${id}`);
    return response.data;
  },

  create: async (rider: RiderCreate): Promise<Rider> => {
    const response = await api.post('/api/riders/', rider);
    return response.data;
  },

  update: async (id: number, rider: Partial<RiderCreate>): Promise<Rider> => {
    const response = await api.put(`/api/riders/${id}`, rider);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/riders/${id}`);
  },
};
