import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
  type Router,
} from 'vue-router';
import { defineComponent, h } from 'vue';

const OrdersPage = defineComponent({
  render: () => h('div', 'Page placeholder'),
});

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
    component: OrdersPage,
    meta: {
      requiresAuth: true,
      title: 'Orders',
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
