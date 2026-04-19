<script setup lang="ts">
import { RouterView } from 'vue-router';
import AppHeader from '@/shared/components/layout/AppHeader.vue';
import AppSidebar from '@/shared/components/layout/AppSidebar.vue';
import AppToast from '@/shared/components/feedback/AppToast.vue';
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-slate-50">
    <AppSidebar />
    <div class="flex min-w-0 flex-1 flex-col overflow-hidden">
      <AppHeader />
      <main class="flex-1 overflow-y-auto p-5">
        <RouterView />
      </main>
    </div>
  </div>
  <AppToast />
</template>
