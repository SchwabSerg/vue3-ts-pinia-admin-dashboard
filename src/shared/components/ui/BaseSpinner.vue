<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'currentColor',
});

const spinnerClass = computed<string>(() => {
  switch (props.size) {
    case 'sm':
      return 'w-4 h-4';
    case 'lg':
      return 'w-8 h-8';
    default:
      return 'w-6 h-6';
  }
});
</script>

<template>
  <div
    class="base-spinner animate-spin rounded-full border-2 border-current border-t-transparent"
    :class="spinnerClass"
    aria-hidden="true"
  />
</template>

<style scoped>
.base-spinner {
  color: v-bind(color);
}
</style>
