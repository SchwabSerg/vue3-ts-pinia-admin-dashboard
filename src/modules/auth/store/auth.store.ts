import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<{ name: string } | null>(null);
  const token = ref<string | null>(null);
  const isAuthenticated = computed<boolean>(() => !!token.value);

  function logout(): void {}

  return { user, token, isAuthenticated, logout };
});
