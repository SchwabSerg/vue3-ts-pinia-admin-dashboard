<script setup lang="ts">
import { computed, ref, type Ref } from 'vue';
import { RouterLink } from 'vue-router';
import BaseBadge from '@/shared/components/ui/BaseBadge.vue';
import BaseButton from '@/shared/components/ui/BaseButton.vue';
import { formatDateTime } from '@/shared/utils/formatDate';
import OrderStatusBadge from '@/modules/orders/components/OrderStatusBadge.vue';
import {
  getAvailableTransitions,
  getStatusLabel,
  isOverdue,
} from '@/modules/orders/domain/order.helpers';
import type { Order, OrderStatus } from '@/modules/orders/domain/order.types';
import { useOrdersStore } from '@/modules/orders/store/orders.store';

interface Props {
  order: Order;
}

const props = defineProps<Props>();
const ordersStore = useOrdersStore();
const activeStatusChange: Ref<OrderStatus | null> = ref(null);

const availableTransitions = computed<OrderStatus[]>(() =>
  getAvailableTransitions(props.order.status),
);

const handleStatusChange = async (status: OrderStatus): Promise<void> => {
  activeStatusChange.value = status;

  try {
    await ordersStore.changeStatus(props.order.id, status);
  } finally {
    activeStatusChange.value = null;
  }
};
</script>

<template>
  <section class="order-detail-panel">
    <div class="order-detail-panel__header">
      <div>
        <p class="order-detail-panel__eyebrow">Order details</p>
        <h1 class="order-detail-panel__title">{{ order.orderNumber }}</h1>
      </div>
      <div class="order-detail-panel__badges">
        <OrderStatusBadge :status="order.status" />
        <BaseBadge v-if="isOverdue(order)" variant="warning">Overdue</BaseBadge>
      </div>
    </div>

    <div class="order-detail-panel__grid">
      <section class="order-detail-panel__card">
        <h2>General info</h2>
        <dl>
          <div>
            <dt>Order number</dt>
            <dd>{{ order.orderNumber }}</dd>
          </div>
          <div>
            <dt>Date</dt>
            <dd>{{ formatDateTime(order.createdAt) }}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{{ getStatusLabel(order.status) }}</dd>
          </div>
        </dl>
      </section>

      <section class="order-detail-panel__card">
        <h2>Customer info</h2>
        <dl>
          <div>
            <dt>Name</dt>
            <dd>
              <RouterLink
                class="order-detail-panel__customer-link"
                :to="`/customers/${order.customer.id}`"
              >
                {{ order.customer.name }}
              </RouterLink>
            </dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{{ order.customer.email }}</dd>
          </div>
        </dl>
      </section>

      <section class="order-detail-panel__card">
        <h2>Payment</h2>
        <dl>
          <div>
            <dt>Status</dt>
            <dd>{{ order.payment.status }}</dd>
          </div>
          <div>
            <dt>Method</dt>
            <dd>{{ order.payment.method }}</dd>
          </div>
          <div>
            <dt>Amount</dt>
            <dd>{{ order.payment.currency }} {{ order.payment.amount.toFixed(2) }}</dd>
          </div>
        </dl>
      </section>

      <section class="order-detail-panel__card">
        <h2>Delivery</h2>
        <dl>
          <div>
            <dt>Address</dt>
            <dd>{{ order.delivery.address }}, {{ order.delivery.city }}, {{ order.delivery.country }}</dd>
          </div>
          <div>
            <dt>Tracking number</dt>
            <dd>{{ order.delivery.trackingNumber ?? 'Not available yet' }}</dd>
          </div>
        </dl>
      </section>
    </div>

    <section class="order-detail-panel__card">
      <h2>Status change</h2>
      <div v-if="availableTransitions.length > 0" class="order-detail-panel__actions">
        <BaseButton
          v-for="status in availableTransitions"
          :key="status"
          variant="secondary"
          :loading="activeStatusChange === status"
          @click="handleStatusChange(status)"
        >
          Mark as {{ getStatusLabel(status) }}
        </BaseButton>
      </div>
      <p v-else class="order-detail-panel__muted">No further status transitions are available.</p>
    </section>
  </section>
</template>

<style scoped>
.order-detail-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-detail-panel__header,
.order-detail-panel__badges,
.order-detail-panel__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.order-detail-panel__eyebrow {
  margin: 0 0 0.35rem;
  color: var(--color-primary, #3b82f6);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.order-detail-panel__title {
  margin: 0;
  color: var(--color-text, #1e293b);
  font-size: 1.75rem;
}

.order-detail-panel__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.order-detail-panel__card {
  padding: 1.25rem;
  background: var(--color-surface, #fff);
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: 1rem;
}

.order-detail-panel__card h2 {
  margin: 0 0 1rem;
  color: var(--color-text, #1e293b);
  font-size: 1rem;
}

.order-detail-panel__card dl {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.order-detail-panel__card dt {
  margin-bottom: 0.2rem;
  color: var(--color-text-muted, #64748b);
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.order-detail-panel__card dd {
  margin: 0;
  color: var(--color-text, #1e293b);
  font-weight: 600;
}

.order-detail-panel__muted {
  margin: 0;
  color: var(--color-text-muted, #64748b);
}

.order-detail-panel__customer-link {
  color: var(--color-primary, #3b82f6);
  text-decoration: none;
}

.order-detail-panel__customer-link:hover {
  text-decoration: underline;
}

@media (max-width: 900px) {
  .order-detail-panel__grid {
    grid-template-columns: 1fr;
  }
}
</style>
