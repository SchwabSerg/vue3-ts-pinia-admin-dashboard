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

const modalClass = computed<string>(() => {
  switch (props.size) {
    case 'sm':
      return 'max-w-sm';
    case 'lg':
      return 'max-w-lg';
    default:
      return 'max-w-md';
  }
});

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
    <Transition
      enter-active-class="transition-all duration-150"
      leave-active-class="transition-all duration-150"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="close">
        <div
          class="w-full rounded-lg bg-white shadow-sm"
          :class="modalClass"
          role="dialog"
          aria-modal="true"
        >
          <div class="flex items-center justify-between border-b border-[#e2e8f0] p-4">
            <h2 class="text-sm font-medium text-[#1e293b]">
              {{ title }}
            </h2>
            <button
              class="transition-colors duration-150 text-[#64748b] hover:text-[#1e293b]"
              type="button"
              @click="close"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
          <div class="p-4">
            <slot />
          </div>
          <div v-if="$slots.footer" class="flex justify-end gap-2 border-t border-[#e2e8f0] p-4">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
