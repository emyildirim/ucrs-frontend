import { api } from '@/lib/api';

export interface User {
  user_id: number;
  full_name: string;
  email: string;
  role_id: number;
  status: string;
  role?: { name: string };
  created_at: string;
}

export const userService = {
  getAll: async (params?: { per_page?: number; search?: string }) => {
    const { data } = await api.get('/users', { params });
    return data;
  },

  getById: async (id: number) => {
    const { data } = await api.get(`/users/${id}`);
    return data;
  },

  create: async (userData: { full_name: string; email: string; password: string; role_id: number; status?: string }) => {
    const { data } = await api.post('/users', userData);
    return data;
  },

  update: async (id: number, userData: Partial<User> & { password?: string }) => {
    const { data } = await api.put(`/users/${id}`, userData);
    return data;
  },

  delete: async (id: number) => {
    const { data } = await api.delete(`/users/${id}`);
    return data;
  },
};
