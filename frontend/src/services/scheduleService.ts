import api from './api';
import {
  ScheduleAssignment,
  ScheduleAssignmentCreate,
  ScheduleAssignmentUpdate,
} from '../types';

export const scheduleService = {
  getAll: async (startDate: string, endDate: string): Promise<ScheduleAssignment[]> => {
    const response = await api.get('/api/schedule/', {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  },

  generate: async (startDate: string, days: number): Promise<ScheduleAssignment[]> => {
    const response = await api.post('/api/schedule/generate', {
      start_date: startDate,
      days,
    });
    return response.data;
  },

  create: async (assignment: ScheduleAssignmentCreate): Promise<ScheduleAssignment> => {
    const response = await api.post('/api/schedule/', assignment);
    return response.data;
  },

  update: async (
    id: number,
    assignment: ScheduleAssignmentUpdate,
  ): Promise<ScheduleAssignment> => {
    const response = await api.put(`/api/schedule/${id}`, assignment);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/schedule/${id}`);
  },

  export: (startDate: string, endDate: string): string => {
    const params = new URLSearchParams({ start_date: startDate, end_date: endDate });
    const baseUrl = api.defaults.baseURL ?? '';
    const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    return `${normalizedBase}/api/schedule/export?${params.toString()}`;
  },
};
