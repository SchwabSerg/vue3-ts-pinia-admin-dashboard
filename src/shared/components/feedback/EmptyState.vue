<script setup lang="ts">
interface Props {
  title: string;
  description?: string;
  icon?: string;
}

withDefaults(defineProps<Props>(), {
  description: '',
  icon: '📭',
});
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-slate-200 bg-white px-4 py-12 text-center shadow-sm">
    <div class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-2xl text-slate-500">
      {{ icon }}
    </div>
    <div class="space-y-1">
      <p class="text-sm font-semibold text-slate-800">{{ title }}</p>
      <p v-if="description" class="max-w-sm text-center text-sm leading-6 text-slate-500">{{ description }}</p>
    </div>
    <div v-if="$slots.default">
      <slot />
    </div>
  </div>
</template>
