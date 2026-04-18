import type { OrderStatus } from '@/modules/orders/domain/order.types';
import { mockCustomers, type MockCustomer } from './customers.data';

interface MockOrderCustomer {
  id: string;
  name: string;
  email: string;
}

interface MockOrderPayment {
  status: 'paid' | 'pending' | 'failed';
  method: 'card' | 'paypal' | 'bank_transfer';
  amount: number;
  currency: 'USD';
}

interface MockOrderDelivery {
  address: string;
  city: string;
  country: string;
  trackingNumber: string | null;
}

interface MockOrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface MockOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  customer: MockOrderCustomer;
  payment: MockOrderPayment;
  delivery: MockOrderDelivery;
  items: MockOrderItem[];
  createdAt: string;
  updatedAt: string;
}

const dayMs = 24 * 60 * 60 * 1000;
const baseDate = new Date('2026-04-19T12:00:00.000Z');

const productSets: MockOrderItem[][] = [
  [{ name: 'Wireless Mouse', quantity: 1, price: 39 }],
  [
    { name: 'Mechanical Keyboard', quantity: 1, price: 129 },
    { name: 'Palm Rest', quantity: 1, price: 24 },
  ],
  [
    { name: 'USB-C Dock', quantity: 1, price: 89 },
    { name: 'HDMI Cable', quantity: 2, price: 15 },
  ],
  [
    { name: '27" Monitor', quantity: 1, price: 299 },
    { name: 'Monitor Arm', quantity: 1, price: 79 },
    { name: 'Cable Sleeve', quantity: 1, price: 18 },
  ],
  [
    { name: 'Laptop Stand', quantity: 1, price: 54 },
    { name: 'Webcam', quantity: 1, price: 94 },
    { name: 'Desk Lamp', quantity: 1, price: 48 },
    { name: 'Notebook', quantity: 2, price: 9 },
  ],
  [
    { name: 'Office Chair', quantity: 1, price: 345 },
    { name: 'Floor Mat', quantity: 1, price: 56 },
  ],
];

const addresses = [
  { address: '125 Market Street', city: 'San Francisco', country: 'USA' },
  { address: '88 Madison Avenue', city: 'New York', country: 'USA' },
  { address: '742 Lake Shore Drive', city: 'Chicago', country: 'USA' },
  { address: '301 Sunset Boulevard', city: 'Los Angeles', country: 'USA' },
  { address: '56 Congress Street', city: 'Boston', country: 'USA' },
  { address: '910 Pine Street', city: 'Seattle', country: 'USA' },
];

const statuses: OrderStatus[] = [
  'pending',
  'pending',
  'pending',
  'pending',
  'pending',
  'processing',
  'processing',
  'processing',
  'processing',
  'processing',
  'shipped',
  'shipped',
  'shipped',
  'shipped',
  'shipped',
  'delivered',
  'delivered',
  'delivered',
  'delivered',
  'delivered',
  'delivered',
  'delivered',
  'cancelled',
  'cancelled',
  'cancelled',
];

const getCustomer = (index: number): MockCustomer => mockCustomers[index % mockCustomers.length];

const getItems = (index: number): MockOrderItem[] =>
  productSets[index % productSets.length].map((item: MockOrderItem): MockOrderItem => ({ ...item }));

const getPaymentStatus = (status: OrderStatus, index: number): MockOrderPayment['status'] => {
  if (status === 'cancelled') {
    return index % 2 === 0 ? 'failed' : 'pending';
  }

  if (status === 'pending') {
    return 'pending';
  }

  return 'paid';
};

const getPaymentMethod = (index: number): MockOrderPayment['method'] => {
  const methods: MockOrderPayment['method'][] = ['card', 'paypal', 'bank_transfer'];

  return methods[index % methods.length];
};

const getTrackingNumber = (status: OrderStatus, index: number): string | null => {
  if (status === 'shipped' || status === 'delivered') {
    return `TRK-${120000 + index}`;
  }

  return null;
};

const calculateAmount = (items: MockOrderItem[]): number =>
  items.reduce((total: number, item: MockOrderItem): number => total + item.quantity * item.price, 0);

export const mockOrders: MockOrder[] = statuses.map((status: OrderStatus, index: number): MockOrder => {
  const customer: MockCustomer = getCustomer(index);
  const items: MockOrderItem[] = getItems(index);
  const amount: number = calculateAmount(items);
  const deliveryBase = addresses[index % addresses.length];
  const createdAt = new Date(baseDate.getTime() - (index * 2 + 1) * dayMs);
  const updatedAt = new Date(createdAt.getTime() + ((index % 5) + 2) * 60 * 60 * 1000);

  return {
    id: `order-${String(index + 1).padStart(3, '0')}`,
    orderNumber: `ORD-${String(1001 + index).padStart(4, '0')}`,
    status,
    customer: {
      id: customer.id,
      name: customer.name,
      email: customer.email,
    },
    payment: {
      status: getPaymentStatus(status, index),
      method: getPaymentMethod(index),
      amount,
      currency: 'USD',
    },
    delivery: {
      address: deliveryBase.address,
      city: deliveryBase.city,
      country: deliveryBase.country,
      trackingNumber: getTrackingNumber(status, index),
    },
    items,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
  };
});
