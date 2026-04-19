import * as client from '@/shared/api/client';
import type { PaginatedResponse } from '@/shared/types/api.types';
import type { Order, OrdersParams, OrderStatus } from '../domain/order.types';

const buildQueryString = (params: OrdersParams): string => {
  const searchParams = new URLSearchParams();

  if (typeof params.page === 'number') {
    searchParams.set('page', String(params.page));
  }

  if (typeof params.perPage === 'number') {
    searchParams.set('perPage', String(params.perPage));
  }

  if (typeof params.search === 'string' && params.search.length > 0) {
    searchParams.set('search', params.search);
  }

  if (typeof params.status === 'string' && params.status.length > 0) {
    searchParams.set('status', params.status);
  }

  if (typeof params.sortBy === 'string' && params.sortBy.length > 0) {
    searchParams.set('sortBy', params.sortBy);
  }

  if (typeof params.sortDirection === 'string' && params.sortDirection.length > 0) {
    searchParams.set('sortDirection', params.sortDirection);
  }

  const query = searchParams.toString();

  return query.length > 0 ? `?${query}` : '';
};

export const getOrders = (params: OrdersParams): Promise<PaginatedResponse<Order>> =>
  client.get<PaginatedResponse<Order>>(`/orders${buildQueryString(params)}`);

export const getOrderById = (id: string): Promise<Order> => client.get<Order>(`/orders/${id}`);

export const updateOrderStatus = (id: string, status: OrderStatus): Promise<Order> =>
  client.patch<Order>(`/orders/${id}/status`, {
    body: JSON.stringify({ status }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
