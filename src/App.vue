<script setup lang="ts">
import { computed, onErrorCaptured } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import AppLayout from '@/shared/components/layout/AppLayout.vue';
import { useUiStore } from '@/shared/stores/ui.store';

const route = useRoute();
const uiStore = useUiStore();

const shouldUseAppLayout = computed<boolean>(() => route.meta.requiresAuth !== false);

onErrorCaptured((error: unknown) => {
  const message =
    error instanceof Error && error.message.length > 0 ? error.message : 'Unexpected application error';

  console.error(error);
  uiStore.addToast(message, 'error');

  return false;
});
</script>

<template>
  <AppLayout v-if="shouldUseAppLayout" />
  <RouterView v-else />
</template>
