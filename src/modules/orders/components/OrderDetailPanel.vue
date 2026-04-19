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
  <div>
    <div class="mb-4 flex items-center gap-2.5">
      <span class="text-[15px] font-semibold text-slate-900">{{ order.orderNumber }}</span>
      <OrderStatusBadge :status="order.status" />
      <span v-if="isOverdue(order)" class="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-medium text-red-800">Overdue</span>
      <span class="ml-auto text-xs text-slate-400">{{ formatDateTime(order.createdAt) }}</span>
    </div>

    <div class="grid grid-cols-1 gap-3 lg:grid-cols-2">
      <div>
        <div class="mb-3 overflow-hidden rounded-[10px] border border-slate-200 bg-white">
          <div class="border-b border-slate-100 px-4 py-2.5">
            <span class="text-[11px] font-medium uppercase tracking-[0.06em] text-slate-500">Customer</span>
          </div>
          <div class="grid grid-cols-1 gap-x-5 gap-y-2.5 px-4 py-3.5 sm:grid-cols-2">
            <div>
              <div class="mb-0.5 text-[11px] text-slate-400">Name</div>
              <RouterLink :to="{ name: 'customer-detail', params: { id: order.customer.id } }" class="text-[13px] font-medium text-blue-500 no-underline">{{ order.customer.name }}</RouterLink>
            </div>
            <div>
              <div class="mb-0.5 text-[11px] text-slate-400">Email</div>
              <div class="text-xs font-medium text-slate-900">{{ order.customer.email }}</div>
            </div>
          </div>
        </div>

        <div class="mb-3 overflow-hidden rounded-[10px] border border-slate-200 bg-white">
          <div class="border-b border-slate-100 px-4 py-2.5">
            <span class="text-[11px] font-medium uppercase tracking-[0.06em] text-slate-500">Payment</span>
          </div>
          <div class="grid grid-cols-1 gap-x-5 gap-y-2.5 px-4 py-3.5 sm:grid-cols-2">
            <div>
              <div class="mb-0.5 text-[11px] text-slate-400">Status</div>
              <span
                class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
                :class="{
                  'bg-green-100 text-green-800': order.payment.status === 'paid',
                  'bg-red-100 text-red-800': order.payment.status === 'failed',
                  'bg-amber-100 text-amber-800': order.payment.status === 'pending',
                }"
              >{{ order.payment.status }}</span>
            </div>
            <div>
              <div class="mb-0.5 text-[11px] text-slate-400">Method</div>
              <div class="text-[13px] font-medium text-slate-900">{{ order.payment.method.replace('_', ' ') }}</div>
            </div>
            <div>
              <div class="mb-0.5 text-[11px] text-slate-400">Amount</div>
              <div class="text-[13px] font-medium text-slate-900">${{ order.payment.amount.toFixed(2) }}</div>
            </div>
            <div>
              <div class="mb-0.5 text-[11px] text-slate-400">Currency</div>
              <div class="text-[13px] font-medium text-slate-900">{{ order.payment.currency }}</div>
            </div>
          </div>
        </div>

        <div class="overflow-hidden rounded-[10px] border border-slate-200 bg-white">
          <div class="border-b border-slate-100 px-4 py-2.5">
            <span class="text-[11px] font-medium uppercase tracking-[0.06em] text-slate-500">Delivery</span>
          </div>
          <div class="grid grid-cols-1 gap-x-5 gap-y-2.5 px-4 py-3.5 sm:grid-cols-2">
            <div class="sm:col-span-2">
              <div class="mb-0.5 text-[11px] text-slate-400">Address</div>
              <div class="text-[13px] font-medium text-slate-900">{{ order.delivery.address }}, {{ order.delivery.city }}, {{ order.delivery.country }}</div>
            </div>
            <div>
              <div class="mb-0.5 text-[11px] text-slate-400">Tracking</div>
              <div class="font-mono text-xs font-medium text-slate-900">{{ order.delivery.trackingNumber ?? '—' }}</div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="mb-3 overflow-hidden rounded-[10px] border border-slate-200 bg-white">
          <div class="border-b border-slate-100 px-4 py-2.5">
            <span class="text-[11px] font-medium uppercase tracking-[0.06em] text-slate-500">Order items</span>
          </div>
          <div class="px-4 py-3.5">
            <table class="w-full border-collapse">
              <thead>
                <tr>
                  <th class="border-b border-slate-100 py-1 text-left text-[11px] font-medium uppercase tracking-[0.04em] text-slate-400">Item</th>
                  <th class="border-b border-slate-100 py-1 text-center text-[11px] font-medium uppercase tracking-[0.04em] text-slate-400">Qty</th>
                  <th class="border-b border-slate-100 py-1 text-right text-[11px] font-medium uppercase tracking-[0.04em] text-slate-400">Price</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in order.items" :key="item.name" class="border-b border-slate-50">
                  <td class="py-[7px] text-[13px] text-slate-700">{{ item.name }}</td>
                  <td class="py-[7px] text-center text-[13px] text-slate-700">{{ item.quantity }}</td>
                  <td class="py-[7px] text-right text-[13px] text-slate-700">${{ (item.price * item.quantity).toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
            <div class="mt-1 flex justify-end border-t border-slate-100 pt-2.5 text-[13px] font-semibold text-slate-900">
              Total: ${{ order.payment.amount.toFixed(2) }}
            </div>
          </div>
        </div>

        <div class="overflow-hidden rounded-[10px] border border-slate-200 bg-white">
          <div class="border-b border-slate-100 px-4 py-2.5">
            <span class="text-[11px] font-medium uppercase tracking-[0.06em] text-slate-500">Change status</span>
          </div>
          <div class="flex flex-wrap gap-2 px-4 py-3.5">
            <button
              v-for="nextStatus in availableTransitions"
              :key="nextStatus"
              :disabled="activeStatusChange === nextStatus"
              @click="handleStatusChange(nextStatus)"
              class="h-[30px] cursor-pointer rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-600 transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              {{ getStatusLabel(nextStatus) }}
            </button>
            <div v-if="availableTransitions.length === 0" class="text-xs text-slate-400">No further transitions available</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
