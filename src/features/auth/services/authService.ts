import { api } from '@/src/core/api/apiClient';

interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    name: string;
    role: 'CLIENT' | 'SHOPPER';
  };
}

interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  role: 'CLIENT' | 'SHOPPER';
}

export const AuthService = {
  login: async (email: string, password: string) => {
    const { data } = await api.post<LoginResponse>('/auth/login', { 
      email, 
      password 
    });
    return data;
  },

  register: async (payload: RegisterPayload) => {
    const { data } = await api.post('/auth/register', payload);
    return data;
  },

  updateProfile: async (userId: string, data: Partial<User>, imageUri?: string) => {
    const formData = new FormData();
    
    if (data.name) {
        formData.append('fullName', data.name);
    }
    if (data.phone) {
        formData.append('phone', data.phone);
    }
    
    if (imageUri) {
      const filename = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename as string);
      const type = match ? `image/${match[1]}` : `image`;

      formData.append('avatar', { uri: imageUri, name: filename, type } as any);
    }

    const response = await api.patch(`/users/${userId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }
};