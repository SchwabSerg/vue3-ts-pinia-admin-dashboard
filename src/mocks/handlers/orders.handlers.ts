import { http, HttpResponse } from 'msw';
import { canChangeStatus } from '@/modules/orders/domain/order.helpers';
import type { OrderStatus } from '@/modules/orders/domain/order.types';
import type { PaginatedResponse } from '@/shared/types/api.types';
import { mockOrders, type MockOrder } from '../data/orders.data';

interface OrderStatusRequestBody {
  status: OrderStatus;
}

let orders: MockOrder[] = [...mockOrders];

const paginate = <T>(items: T[], page: number, perPage: number): PaginatedResponse<T> => {
  const start = (page - 1) * perPage;
  const end = start + perPage;

  return {
    data: items.slice(start, end),
    total: items.length,
    page,
    perPage,
    lastPage: Math.max(1, Math.ceil(items.length / perPage)),
  };
};

export const ordersHandlers = [
  http.get('/api/orders', async ({ request }) => {
    await new Promise<void>((resolve) => setTimeout(resolve, 300));

    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? '1');
    const perPage = Number(url.searchParams.get('perPage') ?? '10');
    const search = (url.searchParams.get('search') ?? '').trim().toLowerCase();
    const status = (url.searchParams.get('status') ?? '').trim() as OrderStatus | '';

    const filteredOrders = orders.filter((order: MockOrder): boolean => {
      const matchesSearch =
        search.length === 0 ||
        order.orderNumber.toLowerCase().includes(search) ||
        order.customer.name.toLowerCase().includes(search);
      const matchesStatus = status.length === 0 || order.status === status;

      return matchesSearch && matchesStatus;
    });

    return HttpResponse.json(paginate(filteredOrders, page, perPage));
  }),
  http.get('/api/orders/:id', async ({ params }) => {
    await new Promise<void>((resolve) => setTimeout(resolve, 200));

    const order = orders.find((entry: MockOrder): boolean => entry.id === params.id);

    if (!order) {
      return HttpResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    return HttpResponse.json(order);
  }),
  http.patch('/api/orders/:id/status', async ({ params, request }) => {
    await new Promise<void>((resolve) => setTimeout(resolve, 300));

    const body = (await request.json()) as OrderStatusRequestBody;
    const orderIndex = orders.findIndex((entry: MockOrder): boolean => entry.id === params.id);

    if (orderIndex === -1) {
      return HttpResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    if (!canChangeStatus(orders[orderIndex].status, body.status)) {
      return HttpResponse.json({ message: 'Invalid status transition' }, { status: 422 });
    }

    orders[orderIndex] = {
      ...orders[orderIndex],
      status: body.status,
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json(orders[orderIndex]);
  }),
];
