import { http, HttpResponse } from 'msw';
import { setupWorker } from 'msw/browser';
import { authHandlers } from './handlers/auth.handlers';
import { customersHandlers } from './handlers/customers.handlers';
import { ordersHandlers } from './handlers/orders.handlers';

const fallbackApiHandlers = [
  http.all('/api/*', async ({ request }) => {
    console.warn(`[MSW] Unhandled API request: ${request.method} ${request.url}`);

    return HttpResponse.json(
      {
        message: 'Mock handler is not implemented for this endpoint',
      },
      { status: 404 },
    );
  }),
];

export const worker = setupWorker(
  ...authHandlers,
  ...ordersHandlers,
  ...customersHandlers,
  ...fallbackApiHandlers,
);
