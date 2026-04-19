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
  <div>
    <button
      class="mb-4 inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-500"
      @click="goBack"
    >← Back to orders</button>

    <div v-if="ordersStore.loading === 'loading'" class="flex items-center justify-center p-12">
      <div class="spinner h-6 w-6 rounded-full border-2 border-slate-200 border-t-blue-500"></div>
    </div>

    <ErrorMessage
      v-else-if="ordersStore.loading === 'error' && ordersStore.error"
      :message="ordersStore.error.message"
      :retryable="true"
      @retry="ordersStore.fetchOrderById(orderId)"
    />

    <div v-else-if="!ordersStore.currentOrder" class="flex flex-col items-center justify-center gap-2 p-12">
      <div class="text-[13px] font-medium text-slate-900">Order not found</div>
      <div class="text-xs text-slate-400">The order you're looking for doesn't exist</div>
    </div>

    <OrderDetailPanel v-else :order="ordersStore.currentOrder" />
  </div>
</template>

<style scoped>
.spinner { animation: spin 0.75s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
