import * as client from '@/shared/api/client';
import type { PaginatedResponse } from '@/shared/types/api.types';
import type { Order } from '@/modules/orders/domain/order.types';
import type { Customer } from '../domain/customer.types';

export const getCustomerById = (id: string): Promise<Customer> =>
  client.get<Customer>(`/customers/${id}`);

export const getCustomerOrders = (id: string): Promise<PaginatedResponse<Order>> =>
  client.get<PaginatedResponse<Order>>(`/customers/${id}/orders`);
