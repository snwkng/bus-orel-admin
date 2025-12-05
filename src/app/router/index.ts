import { nextTick } from 'vue';
import {
	createRouter,
	createWebHistory,
	type RouteLocationNormalized
} from 'vue-router';
import { loadLayoutMiddleware } from '@/app/router/middleware/loadLayout';
import { useAuthStore } from '@/features/auth/model';

const DEFAULT_TITLE = 'Панель управления';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/login',
			name: 'login',
			component: () => import('@/pages/login'),
			meta: {
				layout: 'auth',
				public: true
			}
		},
		{
			path: '/',
			name: 'home',
			component: () => import('@/pages/home')
		},
		{
			path: '/bus-tours',
			name: 'bus-tours',
			component: () => import('@/pages/busTours'),
			meta: {
				title: 'Автобусные туры к морю'
			}
		},
		{
			path: '/bus-tours/create',
			name: 'create-tour',
			component: () => import('@/pages/createBusTour'),
			meta: {
				title: 'Создать автобусный тур к морю'
			}
		},
		{
			path: '/bus-tours/edit/:id',
			name: 'edit-tour',
			component: () => import('@/pages/editBusTour'),
			meta: {
				title: 'Редактировать автобусный тур к морю'
			}
		},
		{
			path: '/excursions',
			name: 'excursions',
			component: () => import('@/pages/excursions'),
			meta: {
				title: 'Экскурсии из Орла'
			}
		},
		{
			path: '/excursions/create',
			name: 'create-excursion',
			component: () => import('@/pages/createExcursion'),
			meta: {
				title: 'Создать экскурсию'
			}
		},
		{
			path: '/excursions/edit/:id',
			name: 'edit-excursion',
			component: () => import('@/pages/editExcursion'),
			meta: {
				title: 'Редактировать эскурсию'
			}
		},
		{
			path: '/bus-rent',
			name: 'bus-rent',
			component: () => import('@/pages/busRent'),
			meta: {
				title: 'Аренда микроавтобусов'
			}
		}
	]
});

router.beforeEach(async (to) => {
	await loadLayoutMiddleware(to);
	const authStore = useAuthStore();
  
  // Публичные страницы
  if (to.meta.public) return;
  
  if (!authStore.isLoggedIn) {
    return '/login';
  }
  
  if (!authStore.user) {
    await authStore.checkAuth();
  }
});

router.afterEach((to: RouteLocationNormalized) => {
	nextTick(() => {
		document.title = (to?.meta?.title as string) || DEFAULT_TITLE;
	});
});

export default router;
