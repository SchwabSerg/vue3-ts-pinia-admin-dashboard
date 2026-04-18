<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  loading: false,
  disabled: false,
  type: 'button',
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const isDisabled = computed<boolean>(() => props.loading || props.disabled);

const handleClick = (event: MouseEvent): void => {
  emit('click', event);
};
</script>

<template>
  <button
    class="base-button"
    :class="[`base-button--${variant}`, { 'base-button--loading': loading }]"
    :type="type"
    :disabled="isDisabled"
    @click="handleClick"
  >
    <svg
      v-if="loading"
      class="base-button__spinner"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle class="base-button__spinner-track" cx="12" cy="12" r="9" />
      <path class="base-button__spinner-head" d="M12 3a9 9 0 0 1 9 9" />
    </svg>
    <span class="base-button__content">
      <slot />
    </span>
  </button>
</template>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 2.75rem;
  padding: 0.75rem 1rem;
  border: 1px solid transparent;
  border-radius: 0.75rem;
  font: inherit;
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease,
    box-shadow 0.2s ease, transform 0.2s ease;
}

.base-button:hover:not(:disabled) {
  transform: translateY(-1px);
}

.base-button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgb(59 130 246 / 18%);
}

.base-button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
  transform: none;
}

.base-button--primary {
  background: var(--color-primary, #3b82f6);
  color: #fff;
}

.base-button--primary:hover:not(:disabled) {
  background: #2563eb;
}

.base-button--secondary {
  background: var(--color-surface, #fff);
  border-color: var(--color-border, #e2e8f0);
  color: var(--color-text, #1e293b);
}

.base-button--secondary:hover:not(:disabled) {
  background: #f8fafc;
}

.base-button--ghost {
  background: transparent;
  color: var(--color-text-muted, #64748b);
}

.base-button--ghost:hover:not(:disabled) {
  background: rgb(148 163 184 / 12%);
  color: var(--color-text, #1e293b);
}

.base-button--danger {
  background: #dc2626;
  color: #fff;
}

.base-button--danger:hover:not(:disabled) {
  background: #b91c1c;
}

.base-button__spinner {
  width: 1rem;
  height: 1rem;
  animation: spin 0.8s linear infinite;
}

.base-button__spinner-track {
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  opacity: 0.25;
}

.base-button__spinner-head {
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
}

.base-button__content {
  display: inline-flex;
  align-items: center;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
