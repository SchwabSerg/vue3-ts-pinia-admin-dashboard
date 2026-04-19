import { onMounted, ref, watch, type Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { OrderStatus } from '@/modules/orders/domain/order.types';
import { useOrdersStore } from '@/modules/orders/store/orders.store';
import { useDebounce } from '@/shared/composables/useDebounce';

interface UseOrderFiltersResult {
  search: Ref<string>;
  statusFilter: Ref<OrderStatus | ''>;
  clearFilters: () => Promise<void>;
}

const toStatus = (value: unknown): OrderStatus | '' => {
  if (
    value === 'pending' ||
    value === 'processing' ||
    value === 'shipped' ||
    value === 'delivered' ||
    value === 'cancelled'
  ) {
    return value;
  }

  return '';
};

export const useOrderFilters = (): UseOrderFiltersResult => {
  const ordersStore = useOrdersStore();
  const route = useRoute();
  const router = useRouter();

  const search: Ref<string> = ref('');
  const statusFilter: Ref<OrderStatus | ''> = ref('');
  const debouncedSearch: Ref<string> = useDebounce(search, 500);
  const isReady: Ref<boolean> = ref(false);

  onMounted((): void => {
    const initialSearch = typeof route.query.search === 'string' ? route.query.search : '';
    const initialStatus = toStatus(route.query.status);

    search.value = initialSearch;
    statusFilter.value = initialStatus;
    ordersStore.filters = {
      ...ordersStore.filters,
      search: initialSearch,
      status: initialStatus,
      page: 1,
    };
    isReady.value = true;
  });

  watch(debouncedSearch, async (value: string): Promise<void> => {
    if (!isReady.value) {
      return;
    }

    await ordersStore.setFilters({ search: value, page: 1 });
  });

  watch(statusFilter, async (value: OrderStatus | ''): Promise<void> => {
    if (!isReady.value) {
      return;
    }

    await ordersStore.setFilters({ status: value, page: 1 });
  });

  watch(
    [debouncedSearch, statusFilter],
    async ([searchValue, statusValue]: [string, OrderStatus | '']): Promise<void> => {
      if (!isReady.value) {
        return;
      }

      const query: Record<string, string> = {};

      if (searchValue.length > 0) {
        query.search = searchValue;
      }

      if (statusValue.length > 0) {
        query.status = statusValue;
      }

      await router.replace({ query });
    },
  );

  const clearFilters = async (): Promise<void> => {
    search.value = '';
    statusFilter.value = '';
    await ordersStore.resetFilters();
    await router.replace({ query: {} });
  };

  return {
    search,
    statusFilter,
    clearFilters,
  };
};
