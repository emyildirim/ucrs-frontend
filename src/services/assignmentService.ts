import { api } from '@/lib/api';

export interface Assignment {
  assignment_id: number;
  course_id: number;
  title: string;
  description: string;
  due_at: string;
  max_points: number;
  created_at: string;
}

export const assignmentService = {
  getByCourse: async (courseId: number) => {
    const { data } = await api.get(`/courses/${courseId}/assignments`);
    return data;
  },

  getById: async (id: number) => {
    const { data } = await api.get(`/assignments/${id}`);
    return data;
  },

  create: async (courseId: number, assignmentData: Omit<Assignment, 'assignment_id' | 'course_id' | 'created_at'>) => {
    const { data } = await api.post(`/courses/${courseId}/assignments`, assignmentData);
    return data;
  },

  update: async (id: number, assignmentData: Partial<Assignment>) => {
    const { data } = await api.put(`/assignments/${id}`, assignmentData);
    return data;
  },

  delete: async (id: number) => {
    const { data } = await api.delete(`/assignments/${id}`);
    return data;
  },
};
