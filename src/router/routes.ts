import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: 'index',
        path: '',
        component: () => import('pages/IndexPage.vue'),
      },
      {
        name: 'options',
        path: '/options',
        component: () => import('pages/OptionsPage.vue'),
      },
      {
        name: 'popup',
        path: '/popup',
        component: () => import('pages/PopupPage.vue'),
      },
      {
        name: 'history',
        path: '/history',
        component: () => import('pages/HistoriesPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
