import type { RouteLocationNormalized } from 'vue-router';
import type { Component } from 'vue';

const layouts = {
	default: () => import('@/shared/ui/layouts/default'),
	auth: () => import('@/shared/ui/layouts/auth')
} satisfies Record<string, () => Promise<{ default: Component }>>;

type LayoutName = keyof typeof layouts;

export async function loadLayoutMiddleware(
	route: RouteLocationNormalized
): Promise<void> {
	const layout = (route.meta?.layout as LayoutName) || 'default';
	const load = layouts[layout] ?? layouts.default;
	const component = await load();
	route.meta.layoutComponent = component.default;
}
