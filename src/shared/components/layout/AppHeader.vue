<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import BaseButton from '@/shared/components/ui/BaseButton.vue';
import { useUiStore } from '@/shared/stores/ui.store';

const route = useRoute();
const uiStore = useUiStore();
const authStore = useAuthStore();

const pageTitle = computed<string>(() => {
  const title: unknown = route.meta.title;

  return typeof title === 'string' && title.length > 0 ? title : 'Dashboard';
});

const userName = computed<string>(() => authStore.user?.name ?? 'Guest');

const handleLogout = (): void => {
  authStore.logout();
};
</script>

<template>
  <header class="flex h-[52px] shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5">
    <div class="flex items-center gap-2.5">
      <button
        class="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500"
        type="button"
        aria-label="Toggle sidebar"
        @click="uiStore.toggleSidebar()"
      >
        <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M3 5.75A.75.75 0 0 1 3.75 5h12.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 5.75Zm0 4.25a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 10Zm0 4.25a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" />
        </svg>
      </button>
      <span class="text-[13px] font-semibold text-slate-900">{{ pageTitle }}</span>
    </div>

    <div class="flex items-center gap-3">
      <span class="text-xs text-slate-500">{{ userName }}</span>
      <button
        class="h-7 cursor-pointer rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-500"
        type="button"
        @click="handleLogout"
      >
        Log out
      </button>
    </div>
  </header>
</template>
