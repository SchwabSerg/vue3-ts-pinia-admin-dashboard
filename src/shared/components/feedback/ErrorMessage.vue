<script setup lang="ts">
import BaseButton from '@/shared/components/ui/BaseButton.vue';

interface Props {
  message: string;
  retryable?: boolean;
}

withDefaults(defineProps<Props>(), {
  retryable: false,
});

defineEmits<{
  retry: [];
}>();
</script>

<template>
  <div class="error-message" role="alert">
    <div class="error-message__icon">⚠</div>
    <p class="error-message__title">Something went wrong</p>
    <p class="error-message__text">{{ message }}</p>
    <BaseButton v-if="retryable" variant="ghost" @click="$emit('retry')">Try again</BaseButton>
  </div>
</template>

<style scoped>
.error-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  min-height: 16rem;
  padding: 2rem;
  border: 1px solid #fecaca;
  border-radius: 1rem;
  background: #fff7f7;
  text-align: center;
}

.error-message__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 999px;
  background: #fee2e2;
  color: #b91c1c;
  font-size: 1.5rem;
}

.error-message__title {
  margin: 0;
  color: var(--color-text, #1e293b);
  font-size: 1.125rem;
  font-weight: 700;
}

.error-message__text {
  margin: 0;
  max-width: 28rem;
  color: var(--color-text-muted, #64748b);
}
</style>
