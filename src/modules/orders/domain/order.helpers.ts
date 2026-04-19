import { differenceInDays } from 'date-fns';
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '@/shared/constants/orderStatuses';
import type { Order, OrderStatus } from './order.types';

export const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

export const canChangeStatus = (current: OrderStatus, next: OrderStatus): boolean =>
  ALLOWED_TRANSITIONS[current].includes(next);

export const getAvailableTransitions = (current: OrderStatus): OrderStatus[] =>
  ALLOWED_TRANSITIONS[current];

export const isOverdue = (order: Order): boolean => {
  if (order.status === 'delivered' || order.status === 'cancelled') {
    return false;
  }

  return differenceInDays(new Date(), new Date(order.createdAt)) > 7;
};

export const getStatusLabel = (status: OrderStatus): string => ORDER_STATUS_LABELS[status];

export const getStatusColor = (status: OrderStatus): string => ORDER_STATUS_COLORS[status];
