import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
  type Router,
} from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/orders',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/modules/auth/views/LoginView.vue'),
    meta: {
      requiresAuth: false,
      title: 'Login',
    },
  },
  {
    path: '/orders',
    name: 'orders',
    component: () => import('@/modules/orders/views/OrdersView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Orders',
    },
  },
  {
    path: '/orders/:id',
    name: 'order-detail',
    component: () => import('@/modules/orders/views/OrderDetailView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Order Details',
    },
  },
  {
    path: '/customers',
    redirect: { name: 'orders' },
  },
  {
    path: '/customers/:id',
    name: 'customer-detail',
    component: () => import('@/modules/customers/views/CustomerView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Customer Details',
    },
  },
];

const router: Router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
