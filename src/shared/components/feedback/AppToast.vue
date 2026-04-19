<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUiStore } from '@/shared/stores/ui.store';

const uiStore = useUiStore();
const { toasts } = storeToRefs(uiStore);
const { removeToast } = uiStore;

const toastIcons: Record<'success' | 'error' | 'info', string> = {
  success: '✓',
  error: '✗',
  info: 'ℹ',
};
</script>

<template>
  <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2" aria-live="polite" aria-atomic="true">
    <TransitionGroup
      tag="div"
      class="flex flex-col gap-2"
      enter-active-class="transition-all duration-150"
      leave-active-class="transition-all duration-150"
      move-class="transition-all duration-150"
      enter-from-class="translate-y-2 opacity-0"
      leave-to-class="translate-y-2 opacity-0"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="flex min-w-[320px] max-w-[380px] items-start gap-3 rounded-xl border bg-white px-4 py-3.5 text-sm text-slate-800 shadow-sm"
        :class="{
          'border-green-200': toast.type === 'success',
          'border-red-200': toast.type === 'error',
          'border-blue-200': toast.type === 'info',
        }"
      >
        <span
          class="mt-0.5 text-sm"
          :class="{
            'text-green-600': toast.type === 'success',
            'text-red-600': toast.type === 'error',
            'text-blue-600': toast.type === 'info',
          }"
          aria-hidden="true"
        >
          {{ toastIcons[toast.type] }}
        </span>
        <div class="min-w-0 flex-1">
          <p class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
            {{ toast.type }}
          </p>
          <p class="mt-1 text-sm leading-5 text-slate-700">{{ toast.message }}</p>
        </div>
        <button
          class="ml-auto cursor-pointer text-slate-400 transition-colors duration-150 hover:text-slate-600"
          type="button"
          aria-label="Close toast"
          @click="removeToast(toast.id)"
        >
          ×
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>
