<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import OrderStatusBadge from '@/modules/orders/components/OrderStatusBadge.vue';
import { useOrdersStore } from '@/modules/orders/store/orders.store';
import BaseButton from '@/shared/components/ui/BaseButton.vue';
import type { Order } from '@/modules/orders/domain/order.types';
import { usePagination } from '@/shared/composables/usePagination';
import { formatDate } from '@/shared/utils/formatDate';
import type { LoadingState } from '@/shared/types/api.types';

interface Props {
  orders: Order[];
  loading: LoadingState;
  total: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  sort: [field: string];
}>();

const router = useRouter();
const ordersStore = useOrdersStore();
const { error, filters } = storeToRefs(ordersStore);
const pagination = usePagination({
  initialPage: filters.value.page ?? 1,
  initialPerPage: filters.value.perPage ?? 10,
});

watch(
  () => filters.value.page,
  (value: number | undefined): void => {
    if (typeof value === 'number' && pagination.page.value !== value) {
      pagination.setPage(value);
    }
  },
  { immediate: true },
);

watch(
  () => filters.value.perPage,
  (value: number | undefined): void => {
    if (typeof value === 'number' && pagination.perPage.value !== value) {
      pagination.setPerPage(value);
    }
  },
  { immediate: true },
);

watch(pagination.page, async (value: number): Promise<void> => {
  if (value !== (filters.value.page ?? 1)) {
    await ordersStore.setFilters({ page: value });
  }
});

watch(pagination.perPage, async (value: number): Promise<void> => {
  if (value !== (filters.value.perPage ?? 10)) {
    await ordersStore.setFilters({ perPage: value, page: 1 });
  }
});

const totalPages = computed<number>(() => {
  const perPage = filters.value.perPage ?? 10;

  return Math.max(1, Math.ceil(props.total / perPage));
});

const sortIndicator = (field: string): string => {
  if (filters.value.sortBy !== field) {
    return '↕';
  }

  return filters.value.sortDirection === 'desc' ? '↓' : '↑';
};

const viewOrder = async (id: string): Promise<void> => {
  await router.push({ name: 'order-detail', params: { id } });
};

const retry = async (): Promise<void> => {
  await ordersStore.fetchOrders();
};
</script>

<template>
  <div class="overflow-hidden rounded-[10px] border border-slate-200 bg-white">
    <div v-if="loading === 'error' && error" class="flex flex-col items-center justify-center gap-2 p-12">
      <div class="text-2xl">⚠️</div>
      <div class="text-[13px] font-medium text-slate-900">{{ error.message }}</div>
      <BaseButton variant="ghost" size="sm" @click="retry">Try again</BaseButton>
    </div>

    <div v-else-if="loading === 'loading'">
      <table class="w-full border-collapse">
        <thead class="border-b border-slate-200 bg-slate-50">
          <tr>
            <th v-for="col in ['Order #', 'Customer', 'Status', 'Amount', 'Date', '']" :key="col" class="px-3.5 py-2 text-left text-[11px] font-medium uppercase tracking-[0.04em] text-slate-500">{{ col }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="i in 8" :key="i">
            <td v-for="col in ['Order #', 'Customer', 'Status', 'Amount', 'Date', '']" :key="col" class="border-b border-slate-100 px-3.5 py-2.5">
              <div class="h-3.5 w-[70%] rounded bg-slate-100 animate-[pulse_1.5s_ease-in-out_infinite]"></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else-if="orders.length === 0" class="flex flex-col items-center justify-center gap-2 p-12">
      <div class="text-2xl opacity-30">📭</div>
      <div class="text-[13px] font-medium text-slate-900">No orders found</div>
      <div class="text-xs text-slate-400">Try adjusting your search or filters</div>
    </div>

    <table v-else class="w-full border-collapse">
      <thead class="border-b border-slate-200 bg-slate-50">
          <tr>
            <th @click="emit('sort', 'orderNumber')" class="cursor-pointer whitespace-nowrap px-3.5 py-2 text-left text-[11px] font-medium uppercase tracking-[0.04em] text-slate-500">
                Order #
            </th>
            <th @click="emit('sort', 'customer')" class="cursor-pointer px-3.5 py-2 text-left text-[11px] font-medium uppercase tracking-[0.04em] text-slate-500">
                Customer
            </th>
            <th class="px-3.5 py-2 text-left text-[11px] font-medium uppercase tracking-[0.04em] text-slate-500">Status</th>
            <th @click="emit('sort', 'amount')" class="cursor-pointer whitespace-nowrap px-3.5 py-2 text-left text-[11px] font-medium uppercase tracking-[0.04em] text-slate-500">
                Amount
            </th>
            <th @click="emit('sort', 'createdAt')" class="cursor-pointer px-3.5 py-2 text-left text-[11px] font-medium uppercase tracking-[0.04em] text-slate-500">
                Date
            </th>
            <th class="px-3.5 py-2"></th>
          </tr>
      </thead>
      <tbody>
          <tr
            v-for="order in orders"
            :key="order.id"
            class="border-b border-slate-100"
          >
            <td class="px-3.5 py-[9px]">
              <span class="font-mono text-xs text-slate-600">{{ order.orderNumber }}</span>
            </td>
            <td class="px-3.5 py-[9px]">
              <div>
                <div class="text-[13px] font-medium text-slate-900">{{ order.customer.name }}</div>
                <div class="mt-px text-[11px] text-slate-400">{{ order.customer.email }}</div>
              </div>
            </td>
            <td class="px-3.5 py-[9px]">
              <OrderStatusBadge :status="order.status" />
            </td>
            <td class="px-3.5 py-[9px]">
              <span class="text-[13px] font-medium text-slate-900">${{ order.payment.amount.toFixed(2) }}</span>
            </td>
            <td class="px-3.5 py-[9px]">
              <span class="text-xs text-slate-500">{{ formatDate(order.createdAt) }}</span>
            </td>
            <td class="px-3.5 py-[9px]">
              <button @click="viewOrder(order.id)" class="h-[26px] cursor-pointer rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-600">View</button>
            </td>
          </tr>
      </tbody>
    </table>

    <div class="flex items-center justify-between border-t border-slate-100 px-3.5 py-2.5">
      <div class="flex items-center gap-2">
        <span class="text-xs text-slate-400">Page {{ pagination.page.value }} of {{ totalPages }} · {{ total }} results</span>
        <select
            v-model.number="pagination.perPage.value"
            class="h-7 cursor-pointer rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-600"
          >
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
          </select>
      </div>
      <div class="flex gap-1">
        <button :disabled="pagination.page.value <= 1" @click="pagination.setPage(pagination.page.value - 1)" class="h-7 cursor-pointer rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-600 disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
        <button :disabled="pagination.page.value >= totalPages" @click="pagination.setPage(pagination.page.value + 1)" class="h-7 cursor-pointer rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-600 disabled:cursor-not-allowed disabled:opacity-40">Next</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
</style>
