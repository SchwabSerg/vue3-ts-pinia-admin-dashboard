<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue';

interface Props {
  modelValue: boolean;
  title: string;
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const modalClass = computed<string>(() => `base-modal__panel--${props.size}`);

const close = (): void => {
  emit('update:modelValue', false);
};

const handleKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Escape') {
    close();
  }
};

watch(
  () => props.modelValue,
  (isOpen: boolean): void => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeydown);
      return;
    }

    window.removeEventListener('keydown', handleKeydown);
  },
  { immediate: true },
);

onBeforeUnmount((): void => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <Teleport to="body">
    <Transition name="base-modal">
      <div v-if="modelValue" class="base-modal" @click.self="close">
        <div class="base-modal__backdrop" />
        <div class="base-modal__panel" :class="modalClass" role="dialog" aria-modal="true">
          <div class="base-modal__header">
            <h2 class="base-modal__title">
              {{ title }}
            </h2>
            <button class="base-modal__close" type="button" @click="close" aria-label="Close modal">
              ×
            </button>
          </div>
          <div class="base-modal__body">
            <slot />
          </div>
          <div v-if="$slots.footer" class="base-modal__footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.base-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.base-modal__backdrop {
  position: absolute;
  inset: 0;
  background: rgb(15 23 42 / 56%);
}

.base-modal__panel {
  position: relative;
  width: 100%;
  background: var(--color-surface, #fff);
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: 1rem;
  box-shadow: 0 24px 60px rgb(15 23 42 / 20%);
  overflow: hidden;
}

.base-modal__panel--sm {
  max-width: 28rem;
}

.base-modal__panel--md {
  max-width: 40rem;
}

.base-modal__panel--lg {
  max-width: 56rem;
}

.base-modal__header,
.base-modal__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-border, #e2e8f0);
}

.base-modal__footer {
  justify-content: flex-end;
  border-top: 1px solid var(--color-border, #e2e8f0);
  border-bottom: 0;
}

.base-modal__title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text, #1e293b);
}

.base-modal__close {
  width: 2rem;
  height: 2rem;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--color-text-muted, #64748b);
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
}

.base-modal__close:hover {
  background: #f1f5f9;
  color: var(--color-text, #1e293b);
}

.base-modal__body {
  padding: 1.5rem;
  color: var(--color-text, #1e293b);
}

.base-modal-enter-active,
.base-modal-leave-active {
  transition: opacity 0.2s ease;
}

.base-modal-enter-active .base-modal__panel,
.base-modal-leave-active .base-modal__panel {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.base-modal-enter-from,
.base-modal-leave-to {
  opacity: 0;
}

.base-modal-enter-from .base-modal__panel,
.base-modal-leave-to .base-modal__panel {
  transform: translateY(12px) scale(0.98);
  opacity: 0;
}
</style>
