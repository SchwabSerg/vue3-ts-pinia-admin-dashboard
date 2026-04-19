<script setup lang="ts">
import { onMounted } from 'vue';
import OrderFilters from '@/modules/orders/components/OrderFilters.vue';
import OrdersTable from '@/modules/orders/components/OrdersTable.vue';
import { useOrdersStore } from '@/modules/orders/store/orders.store';
import EmptyState from '@/shared/components/feedback/EmptyState.vue';
import ErrorMessage from '@/shared/components/feedback/ErrorMessage.vue';

const ordersStore = useOrdersStore();

onMounted(async (): Promise<void> => {
  await ordersStore.fetchOrders();
});

const handleSort = async (field: string): Promise<void> => {
  const nextDirection =
    ordersStore.filters.sortBy === field && ordersStore.filters.sortDirection === 'asc'
      ? 'desc'
      : 'asc';

  await ordersStore.setFilters({
    sortBy: field,
    sortDirection: nextDirection,
  });
};
</script>

<template>
  <div>
    <div class="mb-4 flex items-center justify-between">
      <OrderFilters />
      <span class="text-xs text-slate-400">{{ ordersStore.total }} orders</span>
    </div>
    <ErrorMessage
      v-if="ordersStore.loading === 'error' && ordersStore.error"
      :message="ordersStore.error.message"
      :retryable="true"
      @retry="ordersStore.fetchOrders"
    />
    <EmptyState
      v-else-if="ordersStore.loading === 'success' && ordersStore.orders.length === 0"
      title="No orders found"
      description="Try adjusting your search or status filters."
    />
    <OrdersTable
      v-else
      :orders="ordersStore.orders"
      :loading="ordersStore.loading"
      :total="ordersStore.total"
      @sort="handleSort"
    />
  </div>
</template>
