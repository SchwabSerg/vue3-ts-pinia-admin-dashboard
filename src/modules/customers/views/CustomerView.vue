<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BaseBadge from '@/shared/components/ui/BaseBadge.vue';
import BaseButton from '@/shared/components/ui/BaseButton.vue';
import { formatDate } from '@/shared/utils/formatDate';
import CustomerOrdersList from '@/modules/customers/components/CustomerOrdersList.vue';
import { useCustomersStore } from '@/modules/customers/store/customers.store';

const route = useRoute();
const router = useRouter();
const customersStore = useCustomersStore();

const customerId = computed<string>(() => String(route.params.id));

onMounted(async (): Promise<void> => {
  await Promise.all([
    customersStore.fetchCustomer(customerId.value),
    customersStore.fetchCustomerOrders(customerId.value),
  ]);
});

onUnmounted((): void => {
  customersStore.clearCustomer();
});

const goBack = async (): Promise<void> => {
  await router.push({ name: 'orders' });
};

const statusVariant = computed<'success' | 'danger'>(() =>
  customersStore.currentCustomer?.status === 'active' ? 'success' : 'danger',
);

const totalSpentFormatted = computed<string>(() => {
  const amount = customersStore.currentCustomer?.totalSpent ?? 0;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
});
</script>

<template>
  <div class="customer-view">
    <BaseButton variant="ghost" @click="goBack">Back to orders</BaseButton>

    <div v-if="customersStore.loading === 'loading'" class="customer-view__state">
      <div class="customer-view__spinner" />
      <p>Loading customer details...</p>
    </div>

    <div v-else-if="customersStore.error" class="customer-view__state">
      <h2>Customer not found</h2>
      <p>The requested customer could not be loaded.</p>
      <BaseButton variant="secondary" @click="goBack">Back</BaseButton>
    </div>

    <template v-else-if="customersStore.currentCustomer">
      <section class="customer-view__card">
        <div class="customer-view__header">
          <div>
            <p class="customer-view__eyebrow">Customer profile</p>
            <h1 class="customer-view__title">{{ customersStore.currentCustomer.name }}</h1>
          </div>
          <BaseBadge :variant="statusVariant">
            {{ customersStore.currentCustomer.status }}
          </BaseBadge>
        </div>

        <div class="customer-view__grid">
          <div>
            <h2>Email</h2>
            <p>{{ customersStore.currentCustomer.email }}</p>
          </div>
          <div>
            <h2>Phone</h2>
            <p>{{ customersStore.currentCustomer.phone }}</p>
          </div>
          <div>
            <h2>Registered</h2>
            <p>{{ formatDate(customersStore.currentCustomer.registeredAt) }}</p>
          </div>
          <div>
            <h2>Total orders</h2>
            <p>{{ customersStore.currentCustomer.totalOrders }}</p>
          </div>
          <div>
            <h2>Total spent</h2>
            <p>{{ totalSpentFormatted }}</p>
          </div>
        </div>
      </section>

      <section class="customer-view__card">
        <div class="customer-view__section-header">
          <h2>Orders by this customer</h2>
        </div>
        <CustomerOrdersList
          :orders="customersStore.customerOrders"
          :loading="customersStore.ordersLoading"
        />
      </section>
    </template>
  </div>
</template>

<style scoped>
.customer-view {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.customer-view__state {
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

.customer-view__spinner {
  width: 2.5rem;
  height: 2.5rem;
  border: 3px solid #dbeafe;
  border-top-color: var(--color-primary, #3b82f6);
  border-radius: 999px;
  animation: spin 0.8s linear infinite;
}

.customer-view__card {
  padding: 1.25rem;
  background: var(--color-surface, #fff);
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: 1rem;
}

.customer-view__header,
.customer-view__section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.customer-view__eyebrow {
  margin: 0 0 0.35rem;
  color: var(--color-primary, #3b82f6);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.customer-view__title,
.customer-view__section-header h2 {
  margin: 0;
  color: var(--color-text, #1e293b);
}

.customer-view__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.customer-view__grid h2 {
  margin: 0 0 0.25rem;
  color: var(--color-text-muted, #64748b);
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.customer-view__grid p {
  margin: 0;
  color: var(--color-text, #1e293b);
  font-weight: 600;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .customer-view__grid {
    grid-template-columns: 1fr;
  }
}
</style>
