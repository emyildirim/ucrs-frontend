import { api } from '@/lib/api';

export interface Submission {
  submission_id: number;
  assignment_id: number;
  student_id: number;
  content_url: string;
  score?: number;
  graded_by?: number;
  assignment?: any;
  student?: any;
  grader?: any;
  created_at: string;
}

export const submissionService = {
  getAll: async (params?: { per_page?: number; course_id?: number }) => {
    const { data } = await api.get('/submissions', { params });
    return data;
  },

  getById: async (id: number) => {
    const { data } = await api.get(`/submissions/${id}`);
    return data;
  },

  getMySubmissions: async () => {
    const { data } = await api.get('/submissions/my-submissions');
    return data;
  },

  submit: async (assignmentId: number, content_url: string) => {
    const { data } = await api.post(`/assignments/${assignmentId}/submit`, { content_url });
    return data;
  },

  update: async (id: number, content_url: string) => {
    const { data } = await api.put(`/submissions/${id}`, { content_url });
    return data;
  },

  grade: async (id: number, score: number) => {
    const { data } = await api.put(`/submissions/${id}/grade`, { score });
    return data;
  },
};
