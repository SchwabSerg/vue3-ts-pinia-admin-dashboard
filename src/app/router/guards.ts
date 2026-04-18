import type { Router } from 'vue-router';
import { useAuthStore } from '@/modules/auth/store/auth.store';

export const registerGuards = (router: Router): void => {
  router.beforeEach((to) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth === true && !authStore.isAuthenticated) {
      return { name: 'login' };
    }

    if (to.name === 'login' && authStore.isAuthenticated) {
      return { name: 'orders' };
    }

    return true;
  });
};
