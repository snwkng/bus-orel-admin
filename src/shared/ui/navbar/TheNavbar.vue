<script setup lang="ts">
import { ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import {
	SeaIcon,
	ExcursionIcon,
	BusIcon,
	DoubleArrowLeft
} from '@/shared/ui/icons';

const route = useRoute();

const isExpanded = ref(localStorage.getItem('isExpanded') !== 'false');

watch(
	() => isExpanded.value,
	() => {
		localStorage.setItem('isExpanded', String(isExpanded.value))
	}
);
</script>
<template>
	<aside
		class="flex h-[100vh] w-[300px] flex-col overflow-hidden bg-white transition-all sticky top-0"
		:class="{ 'w-[60px]': !isExpanded }"
	>
		<div class="flex h-20 py-6 md:py-12 items-center justify-center">
			<RouterLink
				class="flex flex-row items-center justify-center rounded-full bg-slate-100 py-2 px-3"
				to="/"
			>
				<span class="text-2xl font-semibold text-deep-orange">Г</span
				><span class="text-2xl font-semibold text-ligth-blue">Т</span>
			</RouterLink>
		</div>
		<nav :class="['flex flex-col gap-2', isExpanded ? 'px-6' : 'px-2']">
			<RouterLink
				:class="[
					'link w-full',
					{ 'link-active': route.path.includes('/bus-tours') },
					{ '!rounded-full !px-0 justify-center': !isExpanded }
				]"
				to="/bus-tours"
				title="Автобусом к морю"
			>
				<SeaIcon
					:fill="route.path.includes('/bus-tours') ? '#FFFFFF' : '#020202'" :width="28" :height="28"
				/>
				<span v-if="isExpanded">Автобусом к морю</span>
			</RouterLink>
			<RouterLink
				:class="[
					'link',
					{ 'link-active': route.path.includes('/excursions') },
					{ '!rounded-full !px-0 justify-center': !isExpanded }
				]"
				to="/excursions"
				title="Экскурсии"
			>
				<ExcursionIcon
					:fill="route.path.includes('/excursions') ? '#FFFFFF' : '#020202'" :width="28" :height="28"
				/>
				<span v-if="isExpanded">Экскурсии</span>
			</RouterLink>
			<RouterLink
				:class="[
					'link',
					{ 'link-active': route.path.includes('/bus-rent') },
					{ '!rounded-full !px-0 justify-center': !isExpanded }
				]"
				to="/bus-rent"
				title="Аренда автобусов"
			>
				<BusIcon
					:fill="route.path.includes('/bus-rent') ? '#FFFFFF' : '#020202'" :width="28" :height="28"
				/>
				<span v-if="isExpanded">Аренда автобусов</span>
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
