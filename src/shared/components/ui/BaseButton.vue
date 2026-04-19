<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  type: 'button',
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const isDisabled = computed<boolean>(() => props.loading || props.disabled);
const sizeClass = computed<string>(() => (props.size === 'sm' ? 'h-8 px-3 text-xs' : 'h-9 px-4'));
const variantClass = computed<string>(() => {
  switch (props.variant) {
    case 'secondary':
      return 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100';
    case 'ghost':
      return 'text-slate-600 hover:bg-slate-100 hover:text-slate-800 active:bg-slate-200';
    case 'danger':
      return 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700';
    default:
      return 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700';
  }
});

const handleClick = (event: MouseEvent): void => {
  emit('click', event);
};
</script>

<template>
  <button
    :type="type"
    :disabled="isDisabled"
    class="inline-flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-[7px] font-medium outline-none transition disabled:cursor-not-allowed disabled:opacity-45"
    :class="[sizeClass, variantClass]"
    @click="handleClick"
  >
    <svg v-if="loading" width="13" height="13" viewBox="0 0 13 13" fill="none" class="spinner">
      <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" stroke-opacity="0.3" stroke-width="2"/>
      <path d="M6.5 1.5A5 5 0 0 1 11.5 6.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
    <slot />
  </button>
</template>

<style scoped>
.spinner { animation: spin 0.75s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
