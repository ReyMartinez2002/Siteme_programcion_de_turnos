import api from './api';

export const importService = {
  importRiders: async (file: File): Promise<{ created: number; updated: number }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/api/imports/riders', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  importStores: async (file: File): Promise<{ created: number; updated: number }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/api/imports/stores', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  importBrands: async (file: File): Promise<{ created: number; updated: number }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/api/imports/brands', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
