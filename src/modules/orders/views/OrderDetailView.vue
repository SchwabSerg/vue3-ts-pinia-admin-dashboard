<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BaseButton from '@/shared/components/ui/BaseButton.vue';
import ErrorMessage from '@/shared/components/feedback/ErrorMessage.vue';
import BaseSpinner from '@/shared/components/ui/BaseSpinner.vue';
import OrderDetailPanel from '@/modules/orders/components/OrderDetailPanel.vue';
import { useOrdersStore } from '@/modules/orders/store/orders.store';

const route = useRoute();
const router = useRouter();
const ordersStore = useOrdersStore();

const orderId = computed<string>(() => String(route.params.id));

onMounted(async (): Promise<void> => {
  await ordersStore.fetchOrderById(orderId.value);
});

const goBack = async (): Promise<void> => {
  await router.push({ name: 'orders' });
};
</script>

<template>
  <div class="order-detail-view">
    <BaseButton variant="ghost" @click="goBack">Back to orders</BaseButton>

    <div v-if="ordersStore.loading === 'loading'" class="order-detail-view__state">
      <BaseSpinner size="lg" color="var(--color-primary, #3b82f6)" />
      <p>Loading order details...</p>
    </div>

    <ErrorMessage
      v-else-if="ordersStore.loading === 'error' && ordersStore.error"
      :message="ordersStore.error.message"
      :retryable="true"
      @retry="ordersStore.fetchOrderById(orderId)"
    />
    <ErrorMessage
      v-else-if="ordersStore.currentOrder === null"
      message="The requested order could not be loaded."
    />

    <OrderDetailPanel v-else :order="ordersStore.currentOrder" />
  </div>
</template>

<style scoped>
.order-detail-view {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-detail-view__state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 18rem;
  gap: 0.75rem;
  background: var(--color-surface, #fff);
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: 1rem;
  color: var(--color-text-muted, #64748b);
  text-align: center;
}
</style>
