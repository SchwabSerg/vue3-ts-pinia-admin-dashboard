<script setup lang="ts">
import { onMounted } from 'vue';
import OrderFilters from '@/modules/orders/components/OrderFilters.vue';
import OrdersTable from '@/modules/orders/components/OrdersTable.vue';
import { useOrdersStore } from '@/modules/orders/store/orders.store';

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
  <div class="orders-view">
    <OrderFilters />
    <OrdersTable
      :orders="ordersStore.orders"
      :loading="ordersStore.loading"
      :total="ordersStore.total"
      @sort="handleSort"
    />
  </div>
</template>

<style scoped>
.orders-view {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
