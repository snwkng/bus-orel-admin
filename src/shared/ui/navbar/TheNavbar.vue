<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import {
	SeaIcon,
	ExcursionIcon,
	BusIcon,
	DoubleArrowLeft
} from '@/shared/ui/icons';

const route = useRoute();

const isExpanded = ref(true);
</script>
<template>
	<aside
		class="flex flex-col relative overflow-hidden h-[100vh] w-[300px] bg-white transition-all"
		:class="{ 'w-[60px]': !isExpanded }"
	>
		<div class="flex h-20 items-center justify-center">
			<RouterLink
				class="flex flex-row items-center justify-center rounded-full bg-slate-100 p-2"
				to="/"
			>
				<span class="text-2xl font-semibold text-deep-orange">G</span
				><span class="text-2xl font-semibold text-ligth-blue">T</span>
			</RouterLink>
		</div>
		<nav class="flex flex-col gap-2 px-6">
			<RouterLink
				:class="[
					'link w-full',
					{ 'link-active': route.path.includes('/bus-tours') }
				]"
				to="/bus-tours"
			>
				<SeaIcon
					:fill="route.path.includes('/bus-tours') ? '#FFFFFF' : '#020202'"
				/>
				<span v-if="isExpanded">Автобусом к морю</span>
			</RouterLink>
			<RouterLink
				:class="['link', { 'link-active': route.path.includes('/excursions') }]"
				to="/excursions"
			>
				<ExcursionIcon
					:fill="route.path.includes('/excursions') ? '#FFFFFF' : '#020202'"
				/>
				<span>Экскурсии</span>
			</RouterLink>
			<RouterLink
				:class="['link', { 'link-active': route.path.includes('/bus-rent') }]"
				to="/bus-rent"
			>
				<BusIcon
					:fill="route.path.includes('/bus-rent') ? '#FFFFFF' : '#020202'"
				/>
				<span>Аренда автобусов</span>
			</RouterLink>
		</nav>
		<div class="absolute bottom-2 right-2">
			<div
				class="flex cursor-pointer items-center justify-center rounded-full bg-slate-100 p-2 shadow-lg"
				@click="isExpanded = !isExpanded"
			>
				<DoubleArrowLeft
					fill="#020202"
					:width="24"
					:height="24"
					:class="[
						'transition-all duration-300',
						{ 'rotate-180': !isExpanded }
					]"
				/>
			</div>
		</div>
	</aside>
</template>
