import { api } from '@/lib/api';

export interface UserProfile {
  user_id: number;
  full_name: string;
  email: string;
  role: string;
  role_id: number;
  status: string;
  created_at: string;
}

export const accountService = {
  getProfile: async () => {
    const { data } = await api.get<UserProfile>('/account/profile');
    return data;
  },

  updateProfile: async (profileData: { full_name?: string; email?: string }) => {
    const { data } = await api.put('/account/profile', profileData);
    return data;
  },

  changePassword: async (passwordData: {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
  }) => {
    const { data } = await api.put('/account/password', passwordData);
    return data;
  },
};
