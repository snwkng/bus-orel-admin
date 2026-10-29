<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { Bus, Map, Eye, EyeOff } from '@lucide/vue';

import { busToursApi } from '@/entities/busTours/api';
import { excursionsApi } from '@/entities/excursions/api';
import type { EditHotelDto } from '@/entities/busTours/model/types';
import type { EditExcursionDto } from '@/entities/excursions/model/types';
import { priceFormat } from '@/shared/lib/useRenderFunctions';

interface StatCard {
	label: string;
	value: number | null;
	icon: typeof Bus;
	iconClass: string;
}

const isLoading = ref(true);
const stats = ref<StatCard[]>([]);
const recentHotels = ref<EditHotelDto[]>([]);
const recentExcursions = ref<EditExcursionDto[]>([]);

onMounted(async () => {
	try {
		const [hotelsRes, excursionsRes] = await Promise.all([
			busToursApi.getTours({ limit: 100, sortBy: 'createdAt', sortDir: 'desc' }),
			excursionsApi.getExcursions({ limit: 5, sortBy: 'createdAt', sortDir: 'desc' })
		]);

		const hotels = hotelsRes.data ?? [];
		const hotelsTotal = hotelsRes.meta?.pagination?.total ?? hotels.length;
		const published = hotels.filter((h) => h.published).length;
		const excursionsTotal =
			excursionsRes.meta?.pagination?.total ?? (excursionsRes.data ?? []).length;

		recentHotels.value = hotels.slice(0, 5);
		recentExcursions.value = excursionsRes.data ?? [];

		stats.value = [
			{
				label: 'Автобусные туры',
				value: hotelsTotal,
				icon: Bus,
				iconClass: 'bg-deep-orange/10 text-deep-orange'
			},
			{
				label: 'Опубликовано',
				value: published,
				icon: Eye,
				iconClass: 'bg-deep-teal/10 text-deep-teal'
			},
			{
				label: 'Скрыто',
				value: hotelsTotal - published,
				icon: EyeOff,
				iconClass: 'bg-slate-100 text-slate-500'
			},
			{
				label: 'Экскурсии',
				value: excursionsTotal,
				icon: Map,
				iconClass: 'bg-deep-teal/10 text-deep-teal'
			}
		];
	} catch (err) {
		console.error(err);
	} finally {
		isLoading.value = false;
	}
});
</script>
<template>
	<div class="flex h-full flex-col gap-6 overflow-auto">
		<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
			<div
				v-for="stat in stats"
				:key="stat.label"
				class="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-card"
			>
				<div
					class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
					:class="stat.iconClass"
				>
					<component :is="stat.icon" :size="22" />
				</div>
				<div class="min-w-0">
					<div class="text-2xl font-semibold text-slate-900">
						<span v-if="isLoading" class="text-slate-300">…</span>
						<template v-else>{{ stat.value }}</template>
					</div>
					<div class="truncate text-sm text-slate-500">{{ stat.label }}</div>
				</div>
			</div>
		</div>

		<div class="grid gap-4 lg:grid-cols-2">
			<section class="rounded-2xl bg-white p-6 shadow-card">
				<div class="mb-4 flex items-center justify-between">
					<h2 class="text-lg font-semibold text-slate-800">Последние туры</h2>
					<RouterLink class="link text-sm" :to="{ name: 'hotels' }">
						Все туры
					</RouterLink>
				</div>
				<div
					v-if="!isLoading && !recentHotels.length"
					class="py-8 text-center text-sm text-slate-400"
				>
					Туров пока нет
				</div>
				<ul v-else class="divide-y divide-slate-100">
					<li v-for="hotel in recentHotels" :key="String(hotel._id)">
						<RouterLink
							class="flex items-center justify-between gap-4 rounded-lg px-2 py-3 transition-colors hover:bg-slate-50"
							:to="{ name: 'edit-hotel', params: { id: hotel._id } }"
						>
							<div class="min-w-0">
								<div class="truncate font-medium text-slate-900">
									{{ hotel.name }}
								</div>
								<div class="truncate text-sm text-slate-500">
									{{ hotel.address?.city }}<template v-if="hotel.seaType"> · {{ hotel.seaType }}</template>
								</div>
							</div>
							<div class="shrink-0 text-sm text-slate-600">
								<component :is="priceFormat(hotel.minPrice)" />
							</div>
						</RouterLink>
					</li>
				</ul>
			</section>

			<section class="rounded-2xl bg-white p-6 shadow-card">
				<div class="mb-4 flex items-center justify-between">
					<h2 class="text-lg font-semibold text-slate-800">
						Последние экскурсии
					</h2>
					<RouterLink class="link text-sm" :to="{ name: 'excursions' }">
						Все экскурсии
					</RouterLink>
				</div>
				<div
					v-if="!isLoading && !recentExcursions.length"
					class="py-8 text-center text-sm text-slate-400"
				>
					Экскурсий пока нет
				</div>
				<ul v-else class="divide-y divide-slate-100">
					<li v-for="excursion in recentExcursions" :key="excursion._id">
						<RouterLink
							class="flex items-center justify-between gap-4 rounded-lg px-2 py-3 transition-colors hover:bg-slate-50"
							:to="{ name: 'edit-excursion', params: { id: excursion._id } }"
						>
							<div class="min-w-0">
								<div class="truncate font-medium text-slate-900">
									{{ excursion.name }}
								</div>
								<div class="truncate text-sm text-slate-500">
									{{ (excursion.cities || []).join(', ') }}
								</div>
							</div>
							<div class="shrink-0 text-sm text-slate-600">
								<component :is="priceFormat(excursion.price)" />
							</div>
						</RouterLink>
					</li>
				</ul>
			</section>
		</div>
	</div>
</template>
