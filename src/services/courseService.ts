import { api } from '@/lib/api';

export interface Course {
  course_id: number;
  title: string;
  code: string;
  instructor_id: number;
  is_active: boolean;
  instructor?: { full_name: string };
  created_at: string;
}

export const courseService = {
  getAll: async (params?: { per_page?: number; search?: string; show_all?: boolean }) => {
    const { data } = await api.get('/courses', { params });
    return data;
  },

  getById: async (id: number) => {
    const { data } = await api.get(`/courses/${id}`);
    return data;
  },

  create: async (courseData: { title: string; code: string; instructor_id: number }) => {
    const { data } = await api.post('/courses', courseData);
    return data;
  },

  update: async (id: number, courseData: Partial<Course>) => {
    const { data } = await api.put(`/courses/${id}`, courseData);
    return data;
  },

  delete: async (id: number) => {
    const { data } = await api.delete(`/courses/${id}`);
    return data;
  },

  enroll: async (courseId: number) => {
    const { data } = await api.post(`/courses/${courseId}/enroll`);
    return data;
  },
};
