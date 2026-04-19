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
  <div class="empty-state">
    <div class="empty-state__icon">{{ icon }}</div>
    <p class="empty-state__title">{{ title }}</p>
    <p v-if="description" class="empty-state__description">{{ description }}</p>
    <div v-if="$slots.default" class="empty-state__action">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  min-height: 16rem;
  padding: 2rem;
  border: 1px dashed var(--color-border, #e2e8f0);
  border-radius: 1rem;
  background: linear-gradient(180deg, #f8fafc 0%, #fff 100%);
  text-align: center;
}

.empty-state__icon {
  font-size: 2rem;
}

.empty-state__title {
  margin: 0;
  color: var(--color-text, #1e293b);
  font-size: 1.125rem;
  font-weight: 700;
}

.empty-state__description {
  margin: 0;
  max-width: 28rem;
  color: var(--color-text-muted, #64748b);
}

.empty-state__action {
  margin-top: 0.25rem;
}
</style>
