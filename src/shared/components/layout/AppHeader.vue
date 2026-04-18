<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useUiStore } from '@/shared/stores/ui.store';

interface AuthStoreLike {
  user: {
    name: string;
  } | null;
  logout: () => void;
}

const route = useRoute();
const uiStore = useUiStore();
const authStore = ref<AuthStoreLike | null>(null);

const pageTitle = computed<string>(() => {
  const title: unknown = route.meta.title;

  return typeof title === 'string' && title.length > 0 ? title : 'Dashboard';
});

const userName = computed<string>(() => authStore.value?.user?.name ?? 'Guest');

const handleLogout = (): void => {
  authStore.value?.logout();
};

onMounted(async (): Promise<void> => {
  try {
    const authModule = await import('@/modules/auth/store/auth.store');
    authStore.value = authModule.useAuthStore();
  } catch {
    authStore.value = null;
  }
});
</script>

<template>
  <header class="app-header">
    <div class="app-header__left">
      <button
        class="app-header__menu"
        type="button"
        aria-label="Toggle sidebar"
        @click="uiStore.toggleSidebar()"
      >
        <span />
        <span />
        <span />
      </button>
      <div>
        <p class="app-header__eyebrow">Overview</p>
        <h2 class="app-header__title">
          {{ pageTitle }}
        </h2>
      </div>
    </div>

    <div class="app-header__right">
      <div class="app-header__user">
        <span class="app-header__avatar">
          {{ userName.charAt(0).toUpperCase() }}
        </span>
        <div>
          <p class="app-header__user-label">Signed in as</p>
          <p class="app-header__user-name">
            {{ userName }}
          </p>
        </div>
      </div>

      <button class="app-header__logout" type="button" @click="handleLogout">
        Logout
      </button>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 4.75rem;
  padding: 1rem 1.5rem;
  background: rgb(248 250 252 / 88%);
  border-bottom: 1px solid var(--color-border, #e2e8f0);
  backdrop-filter: blur(12px);
}

.app-header__left,
.app-header__right,
.app-header__user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.app-header__menu {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.25rem;
  width: 2.75rem;
  height: 2.75rem;
  padding: 0;
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: 0.875rem;
  background: var(--color-surface, #fff);
  cursor: pointer;
}

.app-header__menu span {
  width: 1rem;
  height: 2px;
  margin: 0 auto;
  background: var(--color-text, #1e293b);
  border-radius: 999px;
}

.app-header__eyebrow,
.app-header__user-label {
  margin: 0 0 0.2rem;
  font-size: 0.75rem;
  color: var(--color-text-muted, #64748b);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.app-header__title,
.app-header__user-name {
  margin: 0;
  color: var(--color-text, #1e293b);
}

.app-header__title {
  font-size: 1.375rem;
  font-weight: 700;
}

.app-header__user-name {
  font-size: 0.9375rem;
  font-weight: 600;
}

.app-header__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 999px;
  background: #dbeafe;
  color: var(--color-primary, #3b82f6);
  font-weight: 700;
}

.app-header__logout {
  min-height: 2.5rem;
  padding: 0.625rem 0.875rem;
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: 0.75rem;
  background: var(--color-surface, #fff);
  color: var(--color-text, #1e293b);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.app-header__logout:hover {
  background: #f8fafc;
}

@media (min-width: 1024px) {
  .app-header__menu {
    display: none;
  }
}

@media (max-width: 640px) {
  .app-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .app-header__right {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
