import type { Order } from '@/modules/orders/domain/order.types';

export type CustomerStatus = 'active' | 'inactive';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  registeredAt: string;
  status: CustomerStatus;
}

export interface CustomerDetails extends Customer {
  recentOrders: Order[];
}
