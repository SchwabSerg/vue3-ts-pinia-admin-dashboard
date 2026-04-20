import { mockOrders } from './data/orders.data';
import { mockCustomers } from './data/customers.data';
import type { OrderStatus } from '@/modules/orders/domain/order.types';

const mutableOrders = mockOrders.map((o) => ({ ...o }));

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function setupFetchInterceptor(): void {
  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const raw =
      typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.href
          : input.url;
    const path = raw.startsWith('http') ? new URL(raw).pathname : raw;
    const method = (init?.method ?? 'GET').toUpperCase();

    await delay(300);

    if (method === 'POST' && path === '/api/auth/login') {
      const body = JSON.parse((init?.body as string | undefined) ?? '{}') as {
        email?: string;
        password?: string;
      };
      if (body.password !== 'password') {
        return json({ message: 'Invalid credentials' }, 401);
      }
      return json({ user: { id: '1', name: 'Admin User', email: body.email ?? '' }, token: 'fake-jwt-token' });
    }

    if (method === 'POST' && path === '/api/auth/logout') {
      return json({ success: true });
    }

    if (method === 'GET' && path === '/api/orders') {
      const params = new URL(raw, 'http://x').searchParams;
      const page = Number(params.get('page') ?? 1);
      const perPage = Number(params.get('perPage') ?? 10);
      const search = params.get('search') ?? '';
      const status = params.get('status') ?? '';

      let filtered = [...mutableOrders];
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter((o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customer.name.toLowerCase().includes(q),
        );
      }
      if (status) {
        filtered = filtered.filter((o) => o.status === status);
      }

      const total = filtered.length;
      const data = filtered.slice((page - 1) * perPage, page * perPage);
      return json({ data, total, page, perPage, lastPage: Math.ceil(total / perPage) });
    }

    if (method === 'GET' && path.match(/^\/api\/orders\/[^/]+$/) && !path.endsWith('/status')) {
      const id = path.split('/').pop();
      const order = mutableOrders.find((o) => o.id === id);
      if (!order) {
        return json({ message: 'Not found' }, 404);
      }
      return json(order);
    }

    if (method === 'PATCH' && path.match(/^\/api\/orders\/[^/]+\/status$/)) {
      const id = path.split('/')[3];
      const body = JSON.parse((init?.body as string | undefined) ?? '{}') as { status?: OrderStatus };
      const order = mutableOrders.find((o) => o.id === id);
      if (!order) {
        return json({ message: 'Not found' }, 404);
      }
      order.status = body.status as OrderStatus;
      order.updatedAt = new Date().toISOString();
      return json(order);
    }

    if (method === 'GET' && path.match(/^\/api\/customers\/[^/]+\/orders$/)) {
      const id = path.split('/')[3];
      const orders = mutableOrders.filter((o) => o.customer.id === id);
      return json({ data: orders, total: orders.length, page: 1, perPage: 100, lastPage: 1 });
    }

    if (method === 'GET' && path.match(/^\/api\/customers\/[^/]+$/)) {
      const id = path.split('/').pop();
      const customer = mockCustomers.find((c) => c.id === id);
      if (!customer) {
        return json({ message: 'Not found' }, 404);
      }
      return json(customer);
    }

    return originalFetch(input, init);
  };
}
