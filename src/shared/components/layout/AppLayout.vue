<script setup lang="ts">
import { RouterView } from 'vue-router';
import AppHeader from '@/shared/components/layout/AppHeader.vue';
import AppSidebar from '@/shared/components/layout/AppSidebar.vue';
import AppToast from '@/shared/components/feedback/AppToast.vue';
</script>

<template>
  <div class="app-layout">
    <AppSidebar />
    <div class="app-layout__shell">
      <AppHeader />
      <main class="app-layout__main">
        <RouterView />
      </main>
    </div>
    <AppToast />
  </div>
</template>

<style scoped>
.app-layout {
  --color-primary: #3b82f6;
  --color-sidebar-bg: #1e293b;
  --color-sidebar-text: #94a3b8;
  --color-sidebar-active: #ffffff;
  --color-bg: #f8fafc;
  --color-surface: #ffffff;
  --color-border: #e2e8f0;
  --color-text: #1e293b;
  --color-text-muted: #64748b;

  min-height: 100vh;
  background: var(--color-bg);
  color: var(--color-text);
}

.app-layout__shell {
  min-height: 100vh;
}

.app-layout__main {
  padding: 1.5rem;
}

@media (min-width: 1024px) {
  .app-layout__shell {
    margin-left: 17.5rem;
  }

  .app-layout__main {
    padding: 2rem;
  }
}
</style>
