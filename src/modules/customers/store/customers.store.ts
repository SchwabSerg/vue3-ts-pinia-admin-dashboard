import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';
import * as customersApi from '@/modules/customers/api/customers.api';
import type { Customer } from '@/modules/customers/domain/customer.types';
import type { Order } from '@/modules/orders/domain/order.types';
import type { ApiError, LoadingState } from '@/shared/types/api.types';

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

export const useCustomersStore = defineStore('customers', () => {
  const currentCustomer: Ref<Customer | null> = ref(null);
  const customerOrders: Ref<Order[]> = ref([]);
  const loading: Ref<LoadingState> = ref('idle');
  const ordersLoading: Ref<LoadingState> = ref('idle');
  const error: Ref<ApiError | null> = ref(null);

  const fetchCustomer = async (id: string): Promise<void> => {
    loading.value = 'loading';
    error.value = null;

    try {
      currentCustomer.value = await customersApi.getCustomerById(id);
      loading.value = 'success';
    } catch (caughtError: unknown) {
      currentCustomer.value = null;
      error.value = toApiError(caughtError);
      loading.value = 'error';
    }
  };

  const fetchCustomerOrders = async (id: string): Promise<void> => {
    ordersLoading.value = 'loading';

    try {
      const response = await customersApi.getCustomerOrders(id);

      customerOrders.value = response.data;
      ordersLoading.value = 'success';
    } catch {
      customerOrders.value = [];
      ordersLoading.value = 'error';
    }
  };

  const clearCustomer = (): void => {
    currentCustomer.value = null;
    customerOrders.value = [];
    loading.value = 'idle';
    ordersLoading.value = 'idle';
    error.value = null;
  };

  return {
    currentCustomer,
    customerOrders,
    loading,
    ordersLoading,
    error,
    fetchCustomer,
    fetchCustomerOrders,
    clearCustomer,
  };
});
