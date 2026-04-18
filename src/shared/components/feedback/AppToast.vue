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
  <div class="app-toast" aria-live="polite" aria-atomic="true">
    <TransitionGroup name="toast-list" tag="div" class="app-toast__list">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="app-toast__item"
        :class="`app-toast__item--${toast.type}`"
      >
        <span class="app-toast__icon" aria-hidden="true">
          {{ toastIcons[toast.type] }}
        </span>
        <span class="app-toast__message">
          {{ toast.message }}
        </span>
        <button
          class="app-toast__close"
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

<style scoped>
.app-toast {
  position: fixed;
  right: 1.5rem;
  bottom: 1.5rem;
  z-index: 1200;
  pointer-events: none;
}

.app-toast__list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.app-toast__item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.75rem;
  min-width: 18rem;
  max-width: 24rem;
  padding: 0.875rem 1rem;
  border: 1px solid transparent;
  border-radius: 1rem;
  background: var(--color-surface, #fff);
  box-shadow: 0 16px 40px rgb(15 23 42 / 12%);
  pointer-events: auto;
}

.app-toast__item--success {
  border-color: #86efac;
  color: #166534;
}

.app-toast__item--error {
  border-color: #fca5a5;
  color: #991b1b;
}

.app-toast__item--info {
  border-color: #93c5fd;
  color: #1d4ed8;
}

.app-toast__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 999px;
  background: rgb(255 255 255 / 70%);
  font-weight: 700;
}

.app-toast__message {
  color: inherit;
  font-size: 0.9375rem;
  line-height: 1.4;
}

.app-toast__close {
  border: 0;
  background: transparent;
  color: currentColor;
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
  opacity: 0.7;
}

.app-toast__close:hover {
  opacity: 1;
}

.toast-list-enter-active,
.toast-list-leave-active,
.toast-list-move {
  transition: all 0.22s ease;
}

.toast-list-enter-from,
.toast-list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 640px) {
  .app-toast {
    right: 1rem;
    bottom: 1rem;
    left: 1rem;
  }

  .app-toast__item {
    min-width: 0;
    max-width: none;
  }
}
</style>
