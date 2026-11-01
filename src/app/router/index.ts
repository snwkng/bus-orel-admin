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
			component: () => import('@/pages/hotels'),
			meta: {
				title: 'Автобусные туры к морю'
			}
		},
		{
			path: '/hotels/create',
			name: RouteNames.CreateHotel,
			component: () => import('@/pages/createHotel'),
			meta: {
				title: 'Создать автобусный тур к морю',
				backTo: RouteNames.Hotels
			}
		},
		{
			path: '/hotels/edit/:id',
			name: RouteNames.EditHotel,
			component: () => import('@/pages/editHotel'),
			meta: {
				title: 'Редактировать автобусный тур к морю',
				backTo: RouteNames.Hotels
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
				title: 'Создать экскурсию',
				backTo: RouteNames.Excursions
			}
		},
		{
			path: '/excursions/edit/:id',
			name: RouteNames.EditExcursion,
			component: () => import('@/pages/editExcursion'),
			meta: {
				title: 'Редактировать экскурсию',
				backTo: RouteNames.Excursions
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

	if (!authStore.isLoggedIn) {
		return { name: RouteNames.Login };
	}

	if (!authStore.user) {
		// Профиль подгружаем в фоне: ошибка запроса не должна разлогинивать
		// валидную сессию, реальный 401 обработает api-клиент
		void authStore.fetchProfile();
	}

	return true;
});

router.afterEach((to: RouteLocationNormalized) => {
	nextTick(() => {
		document.title = (to?.meta?.title as string) || DEFAULT_TITLE;
	});
});

export default router;
