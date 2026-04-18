import type { OrderStatus } from '@/modules/orders/domain/order.types';

export const canChangeStatus = (_from: OrderStatus, _to: OrderStatus): boolean => true;
