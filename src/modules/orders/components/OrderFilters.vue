<script setup lang="ts">
import BaseButton from '@/shared/components/ui/BaseButton.vue';
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from '@/shared/constants/orderStatuses';
import { useOrderFilters } from '@/modules/orders/composables/useOrderFilters';

const { search, statusFilter, clearFilters } = useOrderFilters();
</script>

<template>
  <div class="flex items-center gap-2">
    <input
      v-model="search"
      type="text"
      placeholder="Search by order number or customer..."
      class="h-8 w-[260px] rounded-[7px] border border-slate-200 bg-white px-2.5 text-[13px] text-slate-900 outline-none"
    />
    <select
      v-model="statusFilter"
      class="h-8 w-[150px] cursor-pointer rounded-[7px] border border-slate-200 bg-white px-2.5 text-xs text-slate-600 outline-none"
    >
      <option value="">All statuses</option>
      <option v-for="s in ORDER_STATUSES" :key="s" :value="s">{{ ORDER_STATUS_LABELS[s] }}</option>
    </select>
    <button
      @click="clearFilters"
      class="h-8 cursor-pointer rounded-[7px] border border-slate-200 bg-white px-3 text-xs text-slate-500"
    >Clear</button>
  </div>
</template>
