<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router';
import { SeaIcon, ExcursionIcon, BusIcon } from '@/shared/ui/icons';

const route = useRoute();
</script>
<template>
	<div class="min-h-[100vh] min-w-[300px] bg-white">
		<div class="flex h-20 items-center justify-center">
			<RouterLink
				class="flex flex-row items-center justify-center rounded-full bg-slate-200 p-2"
				to="/"
			>
				<span class="text-2xl font-semibold text-deep-orange">G</span
				><span class="text-2xl font-semibold text-ligth-blue">T</span>
			</RouterLink>
		</div>
		<nav class="flex flex-col gap-2 px-6">
			<RouterLink
				:class="['link', { 'link-active': route.path === '/bus-tours' }]"
				to="/bus-tours"
			>
				<SeaIcon :fill="route.path === '/bus-tours' ? '#FFFFFF' : '#020202'" />
				<span>Автобусом к морю</span>
			</RouterLink>
			<RouterLink
				:class="['link', { 'link-active': route.path === '/excursions' }]"
				to="/excursions"
			>
				<ExcursionIcon
					:fill="route.path === '/excursions' ? '#FFFFFF' : '#020202'"
				/>
				<span>Экскурсии</span>
			</RouterLink>
			<RouterLink
				:class="['link', { 'link-active': route.path === '/bus-rent' }]"
				to="/bus-rent"
			>
				<BusIcon :fill="route.path === '/bus-rent' ? '#FFFFFF' : '#020202'" />
				<span>Аренда автобусов</span>
			</RouterLink>
		</nav>
	</div>
</template>
