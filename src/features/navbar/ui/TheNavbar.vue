<script setup lang="ts">
import { markRaw, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { SeaIcon, ExcursionIcon, BusIcon } from '@/shared/ui/icons';
import { RouteNames } from '@/app/router/RouteNames.enum';
import { useExpanded } from '@/shared/lib/useExpanded';

const { isExpanded } = useExpanded()

const route = useRoute();

const routes = ref([
	{
		name: RouteNames.Hotels,
		title: 'Автобусом к морю',
		iconComponent: markRaw(SeaIcon)
	},
	{
		name: RouteNames.Excursions,
		title: 'Экскурсии',
		iconComponent: markRaw(ExcursionIcon)
	},
	{
		name: RouteNames.BusRent,
		title: 'Аренда автобусов',
		iconComponent: markRaw(BusIcon)
	}
]);

</script>
<template>
	<aside
		class="flex h-screen shrink-0 flex-col overflow-hidden border-r border-slate-200 bg-white transition-all"
		:class="isExpanded ? 'w-62.5' : 'w-15'"
	>
		<div class="flex items-center justify-center border-b border-slate-100">
			<RouterLink
				class="header-height flex flex-row items-center justify-center"
				to="/"
			>
				<img
					class="h-8 w-auto max-w-full object-contain px-1"
					src="/src/app/assets/icons/logo_black.svg"
					alt="logo"
				/>
			</RouterLink>
		</div>
		<div class="relative h-full">
			<nav
				:class="[
					'flex flex-col gap-1 transition-all base-py items-stretch px-3',
					{ 'px-2': !isExpanded }
				]"
			>
				<RouterLink
					v-for="value in routes"
					:key="value.name"
					:class="[
						'link w-full',
						{ 'link-active': route.name === value.name },
						{ 'justify-center px-1!': !isExpanded }
					]"
					:to="{ name: value.name }"
					:title="value.title"
				>
					<component
						:is="value.iconComponent"
						:fill="'currentColor'"
						:width="22"
						:height="22"
						class="shrink-0"
					/>
					<span
						class="text-nowrap transition-all"
						:class="{ hidden: !isExpanded }"
						>{{ value.title }}</span
					>
				</RouterLink>
			</nav>
		</div>
	</aside>
</template>
