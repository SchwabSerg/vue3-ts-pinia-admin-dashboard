<script setup lang="ts">
interface Props {
  variant?: 'warning' | 'info' | 'primary' | 'success' | 'danger' | 'default';
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
});
</script>

<template>
  <span class="base-badge" :class="`base-badge--${variant}`">
    <slot />
  </span>
</template>

<style scoped>
.base-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 1.5rem;
  padding: 0.25rem 0.625rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.01em;
}

.base-badge--default {
  background: #e2e8f0;
  color: #475569;
}

.base-badge--warning {
  background: #fef3c7;
  color: #b45309;
}

.base-badge--info {
  background: #dbeafe;
  color: #1d4ed8;
}

.base-badge--primary {
  background: #dbeafe;
  color: #1e40af;
}

.base-badge--success {
  background: #dcfce7;
  color: #15803d;
}

.base-badge--danger {
  background: #fee2e2;
  color: #b91c1c;
}
</style>
