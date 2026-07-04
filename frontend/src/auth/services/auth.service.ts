import { api } from '@/common/services/api';
import { LoginRequest, RegisterRequest, AuthResponse } from '../types/api.types';

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/login', payload);
  return response.data;
}

export async function register(payload: RegisterRequest): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/register', payload);
  return response.data;
}
