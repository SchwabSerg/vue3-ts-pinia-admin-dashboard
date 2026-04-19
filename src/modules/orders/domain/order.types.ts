import type { SortDirection } from '@/shared/types/api.types';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Money {
  readonly amount: number;
  readonly currency: 'USD' | 'EUR' | 'UAH';
}

export interface Address {
  readonly street: string;
  readonly city: string;
  readonly country: string;
}

export interface OrderCustomer {
  id: string;
  name: string;
  email: string;
}

export interface OrderPayment {
  status: 'paid' | 'pending' | 'failed';
  method: 'card' | 'paypal' | 'bank_transfer';
  amount: number;
  currency: string;
}

export interface OrderDelivery {
  address: string;
  city: string;
  country: string;
  trackingNumber: string | null;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  customer: OrderCustomer;
  payment: OrderPayment;
  delivery: OrderDelivery;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrdersParams {
  page?: number;
  perPage?: number;
  search?: string;
  status?: OrderStatus | '';
  sortBy?: string;
  sortDirection?: SortDirection;
}
