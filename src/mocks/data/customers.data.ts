export interface MockCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  registeredAt: string;
  status: 'active' | 'inactive';
}

export const mockCustomers: MockCustomer[] = [
  {
    id: 'cust-001',
    name: 'Olivia Bennett',
    email: 'olivia.bennett@example.com',
    phone: '+1 202 555 0101',
    totalOrders: 8,
    totalSpent: 2140,
    registeredAt: '2026-02-14T10:15:00.000Z',
    status: 'active',
  },
  {
    id: 'cust-002',
    name: 'Noah Carter',
    email: 'noah.carter@example.com',
    phone: '+1 202 555 0102',
    totalOrders: 5,
    totalSpent: 1285,
    registeredAt: '2026-01-28T09:40:00.000Z',
    status: 'active',
  },
  {
    id: 'cust-003',
    name: 'Emma Foster',
    email: 'emma.foster@example.com',
    phone: '+1 202 555 0103',
    totalOrders: 3,
    totalSpent: 640,
    registeredAt: '2026-03-02T14:25:00.000Z',
    status: 'active',
  },
  {
    id: 'cust-004',
    name: 'Liam Hayes',
    email: 'liam.hayes@example.com',
    phone: '+1 202 555 0104',
    totalOrders: 11,
    totalSpent: 3890,
    registeredAt: '2025-12-19T08:30:00.000Z',
    status: 'inactive',
  },
  {
    id: 'cust-005',
    name: 'Sophia Reed',
    email: 'sophia.reed@example.com',
    phone: '+1 202 555 0105',
    totalOrders: 6,
    totalSpent: 1725,
    registeredAt: '2026-02-08T16:10:00.000Z',
    status: 'active',
  },
  {
    id: 'cust-006',
    name: 'Mason Cooper',
    email: 'mason.cooper@example.com',
    phone: '+1 202 555 0106',
    totalOrders: 2,
    totalSpent: 290,
    registeredAt: '2026-03-18T11:55:00.000Z',
    status: 'inactive',
  },
  {
    id: 'cust-007',
    name: 'Ava Morgan',
    email: 'ava.morgan@example.com',
    phone: '+1 202 555 0107',
    totalOrders: 9,
    totalSpent: 2415,
    registeredAt: '2026-01-12T13:45:00.000Z',
    status: 'active',
  },
  {
    id: 'cust-008',
    name: 'Ethan Brooks',
    email: 'ethan.brooks@example.com',
    phone: '+1 202 555 0108',
    totalOrders: 4,
    totalSpent: 980,
    registeredAt: '2026-02-26T07:20:00.000Z',
    status: 'active',
  },
  {
    id: 'cust-009',
    name: 'Isabella Turner',
    email: 'isabella.turner@example.com',
    phone: '+1 202 555 0109',
    totalOrders: 7,
    totalSpent: 1935,
    registeredAt: '2026-01-30T12:35:00.000Z',
    status: 'inactive',
  },
  {
    id: 'cust-010',
    name: 'James Walker',
    email: 'james.walker@example.com',
    phone: '+1 202 555 0110',
    totalOrders: 10,
    totalSpent: 3275,
    registeredAt: '2025-12-07T15:05:00.000Z',
    status: 'active',
  },
];
