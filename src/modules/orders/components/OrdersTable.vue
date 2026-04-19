<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import OrderStatusBadge from '@/modules/orders/components/OrderStatusBadge.vue';
import { useOrdersStore } from '@/modules/orders/store/orders.store';
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
  <section class="orders-table">
    <div class="orders-table__header">
      <div>
        <p class="orders-table__eyebrow">Orders</p>
        <h2 class="orders-table__title">Recent activity</h2>
      </div>
      <p class="orders-table__count">{{ total }} total orders</p>
    </div>

    <div v-if="loading === 'error' && error" class="orders-table__state orders-table__state--error">
      <div class="orders-table__state-icon">!</div>
      <h3>Unable to load orders</h3>
      <p>{{ error.message }}</p>
      <button class="orders-table__retry" type="button" @click="retry">Retry</button>
    </div>

    <div
      v-else-if="loading === 'loading'"
      class="orders-table__skeleton"
      aria-label="Loading orders"
    >
      <div v-for="index in 5" :key="index" class="orders-table__skeleton-row">
        <span v-for="cell in 6" :key="cell" class="orders-table__skeleton-cell" />
      </div>
    </div>

    <div v-else-if="orders.length === 0" class="orders-table__state orders-table__state--empty">
      <div class="orders-table__state-icon">⊘</div>
      <h3>No orders found</h3>
      <p>Try adjusting your search or status filters.</p>
    </div>

    <div v-else class="orders-table__content">
      <table class="orders-table__table">
        <thead>
          <tr>
            <th>
              <button class="orders-table__sort" type="button" @click="emit('sort', 'orderNumber')">
                Order #
                <span>{{ sortIndicator('orderNumber') }}</span>
              </button>
            </th>
            <th>
              <button class="orders-table__sort" type="button" @click="emit('sort', 'customer')">
                Customer
                <span>{{ sortIndicator('customer') }}</span>
              </button>
            </th>
            <th>Status</th>
            <th>
              <button class="orders-table__sort" type="button" @click="emit('sort', 'amount')">
                Amount
                <span>{{ sortIndicator('amount') }}</span>
              </button>
            </th>
            <th>
              <button class="orders-table__sort" type="button" @click="emit('sort', 'createdAt')">
                Date
                <span>{{ sortIndicator('createdAt') }}</span>
              </button>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td class="orders-table__mono">{{ order.orderNumber }}</td>
            <td>
              <div class="orders-table__customer">
                <strong>{{ order.customer.name }}</strong>
                <span>{{ order.customer.email }}</span>
              </div>
            </td>
            <td>
              <OrderStatusBadge :status="order.status" />
            </td>
            <td>${{ order.payment.amount.toFixed(2) }}</td>
            <td>{{ formatDate(order.createdAt) }}</td>
            <td>
              <button class="orders-table__view" type="button" @click="viewOrder(order.id)">View</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="orders-table__pagination">
        <div class="orders-table__pagination-group">
          <label for="orders-per-page">Rows</label>
          <select
            id="orders-per-page"
            v-model.number="pagination.perPage.value"
            class="orders-table__per-page"
          >
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
          </select>
        </div>

        <div class="orders-table__pagination-group">
          <button
            class="orders-table__pagination-button"
            type="button"
            :disabled="pagination.page.value <= 1"
            @click="pagination.setPage(pagination.page.value - 1)"
          >
            Previous
          </button>
          <span>Page {{ pagination.page.value }} of {{ totalPages }}</span>
          <button
            class="orders-table__pagination-button"
            type="button"
            :disabled="pagination.page.value >= totalPages"
            @click="pagination.setPage(pagination.page.value + 1)"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.orders-table {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--color-surface, #fff);
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: 1rem;
}

.orders-table__header,
.orders-table__pagination,
.orders-table__pagination-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.orders-table__eyebrow {
  margin: 0 0 0.3rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-primary, #3b82f6);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.orders-table__title,
.orders-table__count {
  margin: 0;
  color: var(--color-text, #1e293b);
}

.orders-table__count {
  color: var(--color-text-muted, #64748b);
}

.orders-table__table {
  width: 100%;
  border-collapse: collapse;
}

.orders-table__table th,
.orders-table__table td {
  padding: 0.95rem 0.75rem;
  border-bottom: 1px solid var(--color-border, #e2e8f0);
  text-align: left;
  vertical-align: middle;
}

.orders-table__table th {
  color: var(--color-text-muted, #64748b);
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.orders-table__sort {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
}

.orders-table__customer {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.orders-table__customer span {
  color: var(--color-text-muted, #64748b);
  font-size: 0.875rem;
}

.orders-table__mono {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
  font-weight: 700;
}

.orders-table__view,
.orders-table__retry,
.orders-table__pagination-button,
.orders-table__per-page {
  min-height: 2.5rem;
  padding: 0.625rem 0.875rem;
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: 0.75rem;
  background: #fff;
  color: var(--color-text, #1e293b);
  font: inherit;
}

.orders-table__view,
.orders-table__retry,
.orders-table__pagination-button {
  cursor: pointer;
}

.orders-table__state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  min-height: 20rem;
  border-radius: 1rem;
  text-align: center;
}

.orders-table__state--empty {
  background: linear-gradient(180deg, #f8fafc 0%, #fff 100%);
  color: var(--color-text-muted, #64748b);
}

.orders-table__state--error {
  background: #fef2f2;
  color: #b91c1c;
}

.orders-table__state-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 999px;
  background: rgb(255 255 255 / 70%);
  font-size: 1.5rem;
  font-weight: 800;
}

.orders-table__skeleton {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.orders-table__skeleton-row {
  display: grid;
  grid-template-columns: 1fr 1.3fr 0.8fr 0.8fr 0.9fr 0.6fr;
  gap: 0.75rem;
}

.orders-table__skeleton-cell {
  height: 3rem;
  border-radius: 0.75rem;
  background: linear-gradient(90deg, #e2e8f0 0%, #f8fafc 50%, #e2e8f0 100%);
  background-size: 200% 100%;
  animation: pulse 1.2s ease-in-out infinite;
}

@keyframes pulse {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@media (max-width: 900px) {
  .orders-table__content {
    overflow-x: auto;
  }

  .orders-table__pagination {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
