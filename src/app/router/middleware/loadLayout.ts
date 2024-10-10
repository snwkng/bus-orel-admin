import type { RouteLocationNormalized } from 'vue-router';

export async function loadLayoutMiddleware(
	route: RouteLocationNormalized
): Promise<void> {
	const layout: string = (route.meta?.layout as string) || 'default';
	const component = await import(`@/shared/ui/layouts/${layout}/index.ts`);
	route.meta.layoutComponent = component.default;
}
