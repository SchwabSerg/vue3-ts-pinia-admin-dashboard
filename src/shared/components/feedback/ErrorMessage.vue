<script setup lang="ts">
import BaseButton from '@/shared/components/ui/BaseButton.vue';

interface Props {
  message: string;
  retryable?: boolean;
}

withDefaults(defineProps<Props>(), {
  retryable: false,
});

defineEmits<{
  retry: [];
}>();
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-3 rounded-lg border border-red-100 bg-white px-4 py-12 text-center shadow-sm" role="alert">
    <div class="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-2xl">⚠️</div>
    <div class="space-y-1">
      <p class="text-sm font-semibold text-slate-800">Something went wrong</p>
      <p class="max-w-sm text-sm leading-6 text-slate-500">{{ message }}</p>
    </div>
    <BaseButton v-if="retryable" variant="ghost" size="sm" @click="$emit('retry')">
      Try again
    </BaseButton>
  </div>
</template>
