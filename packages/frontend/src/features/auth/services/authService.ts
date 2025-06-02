import axios from '@/lib/axios';
import { User } from '@/types/user';

type LoginResponse = {
  user: User;
  accessToken: string;
};

type RegisterData = {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
};

const authService = {
  async login(email: string, password: string): Promise<User> {
    const response = await axios.post<LoginResponse>('/api/auth/login', {
      email,
      password,
    });
    return response.data.user;
  },

  async register(userData: RegisterData): Promise<User> {
    const response = await axios.post<LoginResponse>('/api/auth/register', userData);
    return response.data.user;
  },

  async logout(): Promise<void> {
    await axios.post('/api/auth/logout');
  },

  async getCurrentUser(): Promise<User> {
    const response = await axios.get<User>('/api/auth/me');
    return response.data;
  },

  async refreshToken(): Promise<string> {
    const response = await axios.post<{ accessToken: string }>('/api/auth/refresh');
    return response.data.accessToken;
  },
};

export default authService;