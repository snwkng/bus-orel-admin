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
		}
		// {
		//   path: '/about',
		//   name: 'about',
		//   // route level code-splitting
		//   // this generates a separate chunk (About.[hash].js) for this route
		//   // which is lazy-loaded when the route is visited.
		//   component: () => import('@/pages/AboutView.vue')
		// }
	]
});

export default router;
