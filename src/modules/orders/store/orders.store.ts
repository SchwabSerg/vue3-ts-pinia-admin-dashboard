import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';
import * as ordersApi from '@/modules/orders/api/orders.api';
import type { Order, OrdersParams, OrderStatus } from '@/modules/orders/domain/order.types';
import { useUiStore } from '@/shared/stores/ui.store';
import type { ApiError, LoadingState } from '@/shared/types/api.types';

const defaultFilters = (): OrdersParams => ({
  page: 1,
  perPage: 10,
  search: '',
  status: '',
});

const toApiError = (error: unknown): ApiError => {
  if (typeof error === 'object' && error !== null) {
    const message: unknown = Reflect.get(error, 'message');
    const status: unknown = Reflect.get(error, 'status');
    const errors: unknown = Reflect.get(error, 'errors');

    if (typeof message === 'string' && typeof status === 'number') {
      return {
        message,
        status,
        errors:
          typeof errors === 'object' && errors !== null
            ? (errors as Record<string, string[]>)
            : undefined,
      };
    }
  }

  return {
    message: error instanceof Error ? error.message : 'Unknown error',
    status: 0,
  };
};

export const useOrdersStore = defineStore('orders', () => {
  const uiStore = useUiStore();
  const orders: Ref<Order[]> = ref([]);
  const currentOrder: Ref<Order | null> = ref(null);
  const total: Ref<number> = ref(0);
  const loading: Ref<LoadingState> = ref('idle');
  const error: Ref<ApiError | null> = ref(null);
  const filters: Ref<OrdersParams> = ref(defaultFilters());

  const fetchOrders = async (): Promise<void> => {
    loading.value = 'loading';
    error.value = null;

    try {
      const response = await ordersApi.getOrders(filters.value);

      orders.value = response.data;
      total.value = response.total;
      filters.value = {
        ...filters.value,
        page: response.page,
        perPage: response.perPage,
      };
      loading.value = 'success';
    } catch (caughtError: unknown) {
      error.value = toApiError(caughtError);
      loading.value = 'error';
    }
  };

  const fetchOrderById = async (id: string): Promise<void> => {
    loading.value = 'loading';
    error.value = null;
    currentOrder.value = null;

    try {
      currentOrder.value = await ordersApi.getOrderById(id);
      loading.value = 'success';
    } catch (caughtError: unknown) {
      error.value = toApiError(caughtError);
      currentOrder.value = null;
      loading.value = 'error';
    }
  };

  const changeStatus = async (id: string, status: OrderStatus): Promise<void> => {
    const updatedOrder = await ordersApi.updateOrderStatus(id, status);

    orders.value = orders.value.map((order: Order): Order => (order.id === id ? updatedOrder : order));

    if (currentOrder.value?.id === id) {
      currentOrder.value = updatedOrder;
    }

    uiStore.addToast(`Order ${updatedOrder.orderNumber} updated to ${updatedOrder.status}`, 'success');
  };

  const setFilters = async (newFilters: Partial<OrdersParams>): Promise<void> => {
    const shouldResetPage = Object.keys(newFilters).some(
      (key: string): boolean => key !== 'page' && key !== 'perPage',
    );

    filters.value = {
      ...filters.value,
      ...newFilters,
      page: shouldResetPage ? 1 : (newFilters.page ?? filters.value.page ?? 1),
    };

    await fetchOrders();
  };

  const resetFilters = async (): Promise<void> => {
    filters.value = defaultFilters();
    await fetchOrders();
  };

  return {
    orders,
    currentOrder,
    total,
    loading,
    error,
    filters,
    fetchOrders,
    fetchOrderById,
    changeStatus,
    setFilters,
    resetFilters,
  };
});
