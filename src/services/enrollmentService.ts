import { api } from '@/lib/api';

export interface Enrollment {
  enrollment_id: number;
  course_id: number;
  student_id: number;
  final_grade?: number;
  course?: any;
  student?: any;
  created_at: string;
}

export const enrollmentService = {
  getAll: async (params?: { per_page?: number; search?: string }) => {
    const { data } = await api.get('/enrollments', { params });
    return data;
  },

  getMyCourses: async () => {
    const { data } = await api.get('/enrollments/my-courses');
    return data;
  },

  updateGrade: async (id: number, final_grade: number) => {
    const { data } = await api.put(`/enrollments/${id}`, { final_grade });
    return data;
  },

  drop: async (id: number) => {
    const { data } = await api.delete(`/enrollments/${id}`);
    return data;
  },
};
