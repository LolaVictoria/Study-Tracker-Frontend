import { api } from './api';

export async function registerUser(email: string, password: string): Promise<void> {
  await api.post('/api/auth/register', { email, password });
}

export async function loginUser(email: string, password: string): Promise<void> {
  await api.post('/api/auth/login', { email, password });
}

export async function logoutUser(): Promise<void> {
  await api.post('/api/auth/logout');
}