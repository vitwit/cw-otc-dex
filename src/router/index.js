import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
      path: '/',
      name: 'deotc-home',
      component: () => import('../components/deotc/index.vue')
    },
    {
      path: '/create-deal',
      name: 'create-deal',
      component: () => import('../components/deotc/create.deal.vue')
    },
    {
      path: '/deals',
      name: 'deals',
      component: () => import('../components/deotc/deals.vue')
    },
    {
      path: '/bid',
      name: 'bid',
      component: () => import('../components/deotc/bid.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../components/deotc/profile.vue')
    }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});


export default router;
