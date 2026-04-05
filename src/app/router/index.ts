import { nextTick } from 'vue';
import {
	createRouter,
	createWebHistory,
	type RouteLocationNormalized
} from 'vue-router';
import { loadLayoutMiddleware } from '@/app/router/middleware/loadLayout';
import { useAuthStore } from '@/features/auth/model';
import { RouteNames } from './RouteNames.enum';

const DEFAULT_TITLE = 'Панель управления';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/login',
			name: RouteNames.Login,
			component: () => import('@/pages/login'),
			meta: {
				layout: 'auth',
				public: true
			}
		},
		{
			path: '/',
			name: RouteNames.Home,
			component: () => import('@/pages/home')
		},
		{
			path: '/hotels',
			name: RouteNames.Hotels,
			component: () => import('@/pages/busTours'),
			meta: {
				title: 'Автобусные туры к морю'
			}
		},
		{
			path: '/hotels/create',
			name: RouteNames.CreateHotel,
			component: () => import('@/pages/createBusTour'),
			meta: {
				title: 'Создать автобусный тур к морю'
			}
		},
		{
			path: '/hotels/edit/:id',
			name: RouteNames.EditHotel,
			component: () => import('@/pages/editBusTour'),
			meta: {
				title: 'Редактировать автобусный тур к морю'
			}
		},
		{
			path: '/excursions',
			name: RouteNames.Excursions,
			component: () => import('@/pages/excursions'),
			meta: {
				title: 'Экскурсии'
			}
		},
		{
			path: '/excursions/create',
			name: RouteNames.CreateExcursion,
			component: () => import('@/pages/createExcursion'),
			meta: {
				title: 'Создать экскурсию'
			}
		},
		{
			path: '/excursions/edit/:id',
			name: RouteNames.EditExcursion,
			component: () => import('@/pages/editExcursion'),
			meta: {
				title: 'Редактировать эскурсию'
			}
		},
		{
			path: '/bus-rent',
			name: RouteNames.BusRent,
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
	if (to.meta.public) return true;

	if (!authStore.isLoggedIn && to.name !== 'login') {
		return { name: 'login' };
	}

	if (!authStore.user) {
		try {
			await authStore.fetchProfile();
			return to;
		} catch {
			return { name: 'login' };
		}
	}
});

router.afterEach((to: RouteLocationNormalized) => {
	nextTick(() => {
		document.title = (to?.meta?.title as string) || DEFAULT_TITLE;
	});
});

export default router;
