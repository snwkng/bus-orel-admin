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
		class="flex h-screen flex-col overflow-hidden bg-white transition-all"
		:class="isExpanded ? 'w-62.5' : 'w-15'"
	>
		<div class="flex items-center justify-center">
			<RouterLink
				class="header-height flex flex-row items-center justify-center"
				to="/"
			>
				<img
					class="h-full w-full"
					src="/src/app/assets/icons/logo_black.svg"
					alt="logo"
				/>
			</RouterLink>
		</div>
		<div class="relative h-full">
			<nav
				:class="[
					'flex flex-col gap-2 transition-all base-py items-center',
					{ 'px-3': isExpanded }
				]"
			>
				<RouterLink
					v-for="value in routes"
					:key="value.name"
					:class="[
						'link w-full',
						{ 'link-active': route.name === value.name },
						{ 'justify-center rounded-full! w-fit!': !isExpanded }
					]"
					:to="{ name: value.name }"
					:title="value.title"
				>
					<component
						:is="value.iconComponent"
						:fill="'#020202'"
						:width="28"
						:height="28"
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
