import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: () => import('@/pages/home')
		},
		{
			path: '/bus-tours',
			name: 'bus-tours',
			component: () => import('@/pages/bus-tours')
		},
		{
			path: '/excursions',
			name: 'excursions',
			component: () => import('@/pages/excursions')
		},
		{
			path: '/excursions/create',
			name: 'create-excursion',
			component: () => import('@/pages/createExcursion')
		},
		{
			path: '/excursions/edit/:id',
			name: 'edit-excursion',
			component: () => import('@/pages/editExcursion')
		},
		{
			path: '/bus-rent',
			name: 'bus-rent',
			component: () => import('@/pages/bus-rent')
		},
	]
});

export default router;
