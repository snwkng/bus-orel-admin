<script setup lang="ts">
import { markRaw, onMounted, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { PanelRightOpenIcon } from '@lucide/vue';
import { SeaIcon, ExcursionIcon, BusIcon } from '@/shared/ui/icons';
import { RouteNames } from '@/app/router/RouteNames.enum';

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

const isExpanded = ref(false);

const changeExpanded = (val: boolean) => {
	isExpanded.value = val;
	localStorage.setItem('isExpanded', val.toString());
};

onMounted(() => {
	const expanded = localStorage.getItem('isExpanded');
	isExpanded.value = expanded === 'true';
});
</script>
<template>
	<aside
		class="flex h-[100vh] flex-col overflow-hidden bg-white transition-all"
		:class="isExpanded ? 'w-[250px]' : 'w-[60px]'"
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
					'flex flex-col gap-2 transition-all base-py',
					{ 'px-3': isExpanded }
				]"
			>
				<RouterLink
					v-for="value in routes"
					:key="value.name"
					:class="[
						'link w-full',
						{ 'link-active': route.name === value.name },
						{ 'justify-center !rounded-xl': !isExpanded }
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
			<div class="absolute bottom-2 right-2">
				<div
					class="cursor-pointer rounded-xl bg-gray-300 p-2 shadow-xl transition-all hover:bg-gray-200"
					@click="changeExpanded(!isExpanded)"
					:title="isExpanded ? 'Свернуть' : 'Развернуть'"
				>
					<PanelRightOpenIcon
						:size="32"
						color="#291715"
						:class="['duration-300', { 'rotate-180': !isExpanded }]"
					/>
				</div>
			</div>
		</div>
	</aside>
</template>
