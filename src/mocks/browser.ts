import { setupWorker } from 'msw/browser';
import { authHandlers } from './handlers/auth.handlers';
import { customersHandlers } from './handlers/customers.handlers';
import { ordersHandlers } from './handlers/orders.handlers';

export const worker = setupWorker(...authHandlers, ...ordersHandlers, ...customersHandlers);
