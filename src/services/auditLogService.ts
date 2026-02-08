import { api } from '@/lib/api';

export interface AuditLog {
  audit_id: number;
  actor_user_id: number;
  action_type: string;
  entity_type: string;
  before_json?: any;
  after_json?: any;
  actor?: any;
  created_at: string;
}

export const auditLogService = {
  getAll: async (params?: { per_page?: number }) => {
    const { data } = await api.get('/audit-logs', { params });
    return data;
  },
};
