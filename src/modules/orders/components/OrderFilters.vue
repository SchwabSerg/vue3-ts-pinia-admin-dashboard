<script setup lang="ts">
import BaseButton from '@/shared/components/ui/BaseButton.vue';
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from '@/shared/constants/orderStatuses';
import { useOrderFilters } from '@/modules/orders/composables/useOrderFilters';

const { search, statusFilter, clearFilters } = useOrderFilters();
</script>

<template>
  <div class="order-filters">
    <div class="order-filters__field order-filters__field--search">
      <label class="order-filters__label" for="order-search">Search</label>
      <input
        id="order-search"
        v-model="search"
        class="order-filters__input"
        type="search"
        placeholder="Search by order number or customer"
      />
    </div>

    <div class="order-filters__field">
      <label class="order-filters__label" for="order-status">Status</label>
      <select id="order-status" v-model="statusFilter" class="order-filters__select">
        <option value="">All statuses</option>
        <option v-for="status in ORDER_STATUSES" :key="status" :value="status">
          {{ ORDER_STATUS_LABELS[status] }}
        </option>
      </select>
    </div>

    <BaseButton variant="secondary" @click="clearFilters">Clear filters</BaseButton>
  </div>
</template>

<style scoped>
.order-filters {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 12rem auto;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--color-surface, #fff);
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: 1rem;
}

.order-filters__field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.order-filters__label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text, #1e293b);
}

.order-filters__input,
.order-filters__select {
  min-height: 2.75rem;
  padding: 0.75rem 0.875rem;
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: 0.875rem;
  background: #fff;
  color: var(--color-text, #1e293b);
  font: inherit;
}

.order-filters__input:focus,
.order-filters__select:focus {
  outline: none;
  border-color: var(--color-primary, #3b82f6);
  box-shadow: 0 0 0 3px rgb(59 130 246 / 15%);
}

@media (max-width: 768px) {
  .order-filters {
    grid-template-columns: 1fr;
  }
}
</style>
