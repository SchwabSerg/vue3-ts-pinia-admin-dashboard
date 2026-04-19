<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'warning' | 'info' | 'primary' | 'success' | 'danger' | 'default';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
});

const variantClass = computed<string>(() => {
  switch (props.variant) {
    case 'success':
      return 'bg-green-100 text-green-700';
    case 'warning':
      return 'bg-amber-100 text-amber-700';
    case 'danger':
      return 'bg-red-100 text-red-700';
    case 'info':
      return 'bg-blue-100 text-blue-700';
    case 'primary':
      return 'bg-violet-100 text-violet-700';
    default:
      return 'bg-slate-100 text-slate-600';
  }
});
</script>

<template>
  <span class="inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium" :class="variantClass">
    <slot />
  </span>
</template>
