<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BaseBadge from '@/shared/components/ui/BaseBadge.vue';
import BaseButton from '@/shared/components/ui/BaseButton.vue';
import ErrorMessage from '@/shared/components/feedback/ErrorMessage.vue';
import BaseSpinner from '@/shared/components/ui/BaseSpinner.vue';
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

const retryLoad = async (): Promise<void> => {
  await Promise.all([
    customersStore.fetchCustomer(customerId.value),
    customersStore.fetchCustomerOrders(customerId.value),
  ]);
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
  <div>
    <button
      @click="goBack"
      class="mb-4 inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-500"
    >← Back to orders</button>

    <div v-if="customersStore.loading === 'loading'" class="flex items-center justify-center p-12">
      <div class="spinner h-6 w-6 rounded-full border-2 border-slate-200 border-t-blue-500"></div>
    </div>

    <div v-else-if="customersStore.error" class="flex flex-col items-center justify-center gap-2 p-12">
      <div class="text-[13px] font-medium text-slate-900">Customer not found</div>
      <div class="text-xs text-slate-400">{{ customersStore.error.message }}</div>
    </div>

    <template v-else-if="customersStore.currentCustomer">
      <div class="mb-4 overflow-hidden rounded-[10px] border border-slate-200 bg-white">
        <div class="flex items-center gap-3.5 p-4">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[15px] font-semibold text-blue-800">
            {{ customersStore.currentCustomer.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0,2) }}
          </div>
          <div>
            <div class="text-[15px] font-semibold text-slate-900">{{ customersStore.currentCustomer.name }}</div>
            <div class="mt-0.5 text-xs text-slate-500">{{ customersStore.currentCustomer.email }}</div>
          </div>
          <div class="ml-auto flex items-center gap-2">
            <BaseBadge :variant="statusVariant">{{ customersStore.currentCustomer.status }}</BaseBadge>
            <span class="text-xs text-slate-400">Since {{ formatDate(customersStore.currentCustomer.registeredAt) }}</span>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-2.5 px-4 pb-4 md:grid-cols-3">
          <div class="rounded-lg border border-slate-100 bg-slate-50 p-3">
            <div class="text-lg font-semibold text-slate-900">{{ customersStore.currentCustomer.totalOrders }}</div>
            <div class="mt-0.5 text-[11px] text-slate-400">Total orders</div>
          </div>
          <div class="rounded-lg border border-slate-100 bg-slate-50 p-3">
            <div class="text-lg font-semibold text-slate-900">{{ totalSpentFormatted }}</div>
            <div class="mt-0.5 text-[11px] text-slate-400">Total spent</div>
          </div>
          <div class="rounded-lg border border-slate-100 bg-slate-50 p-3">
            <div class="text-[13px] font-semibold text-slate-900">{{ customersStore.currentCustomer.phone }}</div>
            <div class="mt-0.5 text-[11px] text-slate-400">Phone</div>
          </div>
        </div>
      </div>

      <div class="mb-2.5 text-[13px] font-semibold text-slate-900">Orders by this customer</div>
      <CustomerOrdersList :orders="customersStore.customerOrders" :loading="customersStore.ordersLoading" />
    </template>
  </div>
</template>

<style scoped>
.spinner { animation: spin 0.75s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
