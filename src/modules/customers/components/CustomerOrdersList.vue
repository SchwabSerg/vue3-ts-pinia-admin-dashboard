<script setup lang="ts">
import { RouterLink } from 'vue-router';
import type { Order } from '@/modules/orders/domain/order.types';
import type { LoadingState } from '@/shared/types/api.types';
import { formatDate } from '@/shared/utils/formatDate';
// Cross-module import: reusing domain-specific UI component rather than duplicating
import OrderStatusBadge from '@/modules/orders/components/OrderStatusBadge.vue';

interface Props {
  orders: Order[];
  loading: LoadingState;
}

defineProps<Props>();
</script>

<template>
  <div class="customer-orders-list">
    <div v-if="loading === 'loading'" class="customer-orders-list__skeleton">
      <div v-for="index in 4" :key="index" class="customer-orders-list__skeleton-row">
        <span v-for="cell in 4" :key="cell" class="customer-orders-list__skeleton-cell" />
      </div>
    </div>

    <div v-else-if="orders.length === 0" class="customer-orders-list__empty">
      No orders yet
    </div>

    <table v-else class="customer-orders-list__table">
      <thead>
        <tr>
          <th>Order #</th>
          <th>Status</th>
          <th>Amount</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>
            <RouterLink class="customer-orders-list__link" :to="`/orders/${order.id}`">
              {{ order.orderNumber }}
            </RouterLink>
          </td>
          <td>
            <OrderStatusBadge :status="order.status" />
          </td>
          <td>{{ order.payment.currency }} {{ order.payment.amount.toFixed(2) }}</td>
          <td>{{ formatDate(order.createdAt) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.customer-orders-list__table {
  width: 100%;
  border-collapse: collapse;
}

.customer-orders-list__table th,
.customer-orders-list__table td {
  padding: 0.9rem 0.75rem;
  border-bottom: 1px solid var(--color-border, #e2e8f0);
  text-align: left;
}

.customer-orders-list__table th {
  color: var(--color-text-muted, #64748b);
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.customer-orders-list__link {
  color: var(--color-primary, #3b82f6);
  text-decoration: none;
  font-weight: 700;
}

.customer-orders-list__link:hover {
  text-decoration: underline;
}

.customer-orders-list__empty {
  padding: 2rem 1rem;
  text-align: center;
  color: var(--color-text-muted, #64748b);
}

.customer-orders-list__skeleton {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.customer-orders-list__skeleton-row {
  display: grid;
  grid-template-columns: 1fr 0.8fr 0.8fr 0.9fr;
  gap: 0.75rem;
}

.customer-orders-list__skeleton-cell {
  height: 2.75rem;
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
</style>
