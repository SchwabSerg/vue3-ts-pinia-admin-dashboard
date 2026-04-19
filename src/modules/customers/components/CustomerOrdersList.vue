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
  <div class="overflow-hidden rounded-[10px] border border-slate-200 bg-white">
    <div v-if="loading === 'loading'">
      <table class="w-full border-collapse">
        <thead class="border-b border-slate-200 bg-slate-50">
          <tr>
            <th v-for="col in ['Order #','Status','Amount','Date']" :key="col" class="px-3.5 py-2 text-left text-[11px] font-medium uppercase tracking-[0.04em] text-slate-500">{{ col }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="i in 4" :key="i">
            <td v-for="col in 4" :key="col" class="border-b border-slate-100 px-3.5 py-2.5">
              <div class="h-[13px] w-[65%] rounded bg-slate-100 animate-[pulse_1.5s_ease-in-out_infinite]"></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else-if="orders.length === 0" class="flex flex-col items-center justify-center gap-1.5 p-8">
      <div class="text-[13px] font-medium text-slate-900">No orders yet</div>
      <div class="text-xs text-slate-400">This customer has no orders</div>
    </div>

    <table v-else class="w-full border-collapse">
      <thead class="border-b border-slate-200 bg-slate-50">
        <tr>
          <th class="px-3.5 py-2 text-left text-[11px] font-medium uppercase tracking-[0.04em] text-slate-500">Order #</th>
          <th class="px-3.5 py-2 text-left text-[11px] font-medium uppercase tracking-[0.04em] text-slate-500">Status</th>
          <th class="px-3.5 py-2 text-left text-[11px] font-medium uppercase tracking-[0.04em] text-slate-500">Amount</th>
          <th class="px-3.5 py-2 text-left text-[11px] font-medium uppercase tracking-[0.04em] text-slate-500">Date</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="order in orders"
          :key="order.id"
          class="border-b border-slate-100"
        >
          <td class="px-3.5 py-[9px] font-mono text-xs text-slate-600">
            <RouterLink
              class="text-slate-600 no-underline"
              :to="`/orders/${order.id}`"
            >
              {{ order.orderNumber }}
            </RouterLink>
          </td>
          <td class="px-3.5 py-[9px]">
            <OrderStatusBadge :status="order.status" />
          </td>
          <td class="px-3.5 py-[9px] text-[13px] font-medium text-slate-900">${{ order.payment.amount.toFixed(2) }}</td>
          <td class="px-3.5 py-[9px] text-xs text-slate-500">{{ formatDate(order.createdAt) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
</style>
