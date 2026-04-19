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

const spinnerClass = computed<string>(() => `base-spinner--${props.size}`);
</script>

<template>
  <span class="base-spinner" :class="spinnerClass" :style="{ color }" aria-hidden="true" />
</template>

<style scoped>
.base-spinner {
  display: inline-flex;
  border: 3px solid rgb(148 163 184 / 22%);
  border-top-color: currentColor;
  border-radius: 999px;
  animation: spin 0.8s linear infinite;
}

.base-spinner--sm {
  width: 1rem;
  height: 1rem;
}

.base-spinner--md {
  width: 2rem;
  height: 2rem;
}

.base-spinner--lg {
  width: 3rem;
  height: 3rem;
  border-width: 4px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
