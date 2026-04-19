<script setup lang="ts">
import { computed } from 'vue';
import BaseBadge from '@/shared/components/ui/BaseBadge.vue';
import { getStatusColor, getStatusLabel } from '@/modules/orders/domain/order.helpers';
import type { OrderStatus } from '@/modules/orders/domain/order.types';

interface Props {
  status: OrderStatus;
}

const props = defineProps<Props>();

const badgeVariant = computed<
  'warning' | 'info' | 'primary' | 'success' | 'danger' | 'default'
>(() => getStatusColor(props.status) as 'warning' | 'info' | 'primary' | 'success' | 'danger' | 'default');
</script>

<template>
  <BaseBadge :variant="badgeVariant">
    {{ getStatusLabel(status) }}
  </BaseBadge>
</template>
