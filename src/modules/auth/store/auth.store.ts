import { defineStore } from 'pinia';
import { computed, ref, type ComputedRef, type Ref } from 'vue';
import router from '@/app/router';
import * as authApi from '@/modules/auth/api/auth.api';
import type { AuthState, LoginCredentials, User } from '@/modules/auth/domain/auth.types';

export const useAuthStore = defineStore('auth', () => {
  const parseStoredUser = (): User | null => {
    const storedUser = localStorage.getItem('auth_user');

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as User;
    } catch {
      return null;
    }
  };

  const initialState: AuthState = {
    user: parseStoredUser(),
    token: localStorage.getItem('auth_token'),
  };

  const user: Ref<User | null> = ref(initialState.user);
  const token: Ref<string | null> = ref(initialState.token);
  const isAuthenticated: ComputedRef<boolean> = computed<boolean>(() => !!token.value);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    const response = await authApi.login(credentials);

    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('auth_user', JSON.stringify(response.user));

    token.value = response.token;
    user.value = response.user;
  };

  const logout = async (): Promise<void> => {
    await authApi.logout();

    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');

    token.value = null;
    user.value = null;

    await router.push({ name: 'login' });
  };

  return { user, token, isAuthenticated, login, logout };
});

export type { User } from '@/modules/auth/domain/auth.types';
