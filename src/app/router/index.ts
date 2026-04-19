import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
  type Router,
} from 'vue-router';
import { defineComponent, h } from 'vue';

const CustomersPage = defineComponent({
  render: () => h('div', 'Page placeholder'),
});

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
    name: 'customers',
    component: CustomersPage,
    meta: {
      requiresAuth: true,
      title: 'Customers',
    },
  },
];

const router: Router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
