import api from '../services/api.ts';
import { User } from '../types/index.ts';

export const login = async (data: { email: string; password: string }) => {
  const res = await api.post<{ token: string; user: User }>('/auth/login', data);
  return res.data;
};


export const register = async (data: { name: string; email: string; password: string }) => {
  const res = await api.post<{ token: string; user: User; message: string }>('/auth/register', data);
  return res.data; 
};
