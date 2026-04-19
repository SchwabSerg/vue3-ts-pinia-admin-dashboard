import * as client from '@/shared/api/client';
import type { LoginCredentials, User } from '../domain/auth.types';

interface LoginResponse {
  user: User;
  token: string;
}

export const login = (credentials: LoginCredentials): Promise<LoginResponse> =>
  client.post<LoginResponse>('/auth/login', {
    body: JSON.stringify(credentials),
    headers: {
      'Content-Type': 'application/json',
    },
  });

export const logout = async (): Promise<void> => {
  await client.post<{ success: true }>('/auth/logout', {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
