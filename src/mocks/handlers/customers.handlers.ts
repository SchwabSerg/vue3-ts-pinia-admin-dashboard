import { http, HttpResponse } from 'msw';
import type { PaginatedResponse } from '@/shared/types/api.types';
import { mockCustomers, type MockCustomer } from '../data/customers.data';
import { mockOrders, type MockOrder } from '../data/orders.data';

const toPaginatedResponse = <T>(items: T[]): PaginatedResponse<T> => ({
  data: items,
  total: items.length,
  page: 1,
  perPage: items.length,
  lastPage: 1,
});

export const customersHandlers = [
  http.get('/api/customers/:id', async ({ params }) => {
    await new Promise<void>((resolve) => setTimeout(resolve, 200));

    const customer = mockCustomers.find((entry: MockCustomer): boolean => entry.id === params.id);

    if (!customer) {
      return HttpResponse.json({ message: 'Customer not found' }, { status: 404 });
    }

    return HttpResponse.json(customer);
  }),
  http.get('/api/customers/:id/orders', async ({ params }) => {
    await new Promise<void>((resolve) => setTimeout(resolve, 300));

    const customerOrders = mockOrders.filter(
      (order: MockOrder): boolean => order.customer.id === params.id,
    );

    return HttpResponse.json(toPaginatedResponse(customerOrders));
  }),
];
