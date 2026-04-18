import { createRouter, createWebHistory, type RouteRecordRaw, type Router } from 'vue-router';

const routes: RouteRecordRaw[] = [];

const router: Router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
