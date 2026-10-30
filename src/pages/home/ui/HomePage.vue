<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Bus, Map as MapIcon, Eye, EyeOff } from '@lucide/vue';

import { busToursApi } from '@/entities/busTours/api';
import { excursionsApi } from '@/entities/excursions/api';
import type { EditHotelDto } from '@/entities/busTours/model/types';
import type { EditExcursionDto } from '@/entities/excursions/model/types';
import { pluralize } from '@/shared/lib/pluralize';
import StatCard from './StatCard.vue';
import RecentList, { type RecentItem } from './RecentList.vue';

const isLoading = ref(true);
const hotelsTotal = ref<number | null>(null);
const hotelsPublished = ref<number | null>(null);
const excursionsTotal = ref<number | null>(null);
const recentHotels = ref<EditHotelDto[]>([]);
const recentExcursions = ref<EditExcursionDto[]>([]);

onMounted(async () => {
	try {
		// limit 100 у отелей: счётчики «опубликовано/скрыто» считаются по выборке,
		// отдельного эндпоинта статистики на бэкенде нет
		const [hotelsRes, excursionsRes] = await Promise.all([
			busToursApi.getTours({ limit: 100, sortBy: 'createdAt', sortDir: 'desc' }),
			excursionsApi.getExcursions({ limit: 5, sortBy: 'createdAt', sortDir: 'desc' })
		]);

		const hotels = hotelsRes.data ?? [];
		hotelsTotal.value = hotelsRes.meta?.pagination?.total ?? hotels.length;
		hotelsPublished.value = hotels.filter((h: EditHotelDto) => h.published).length;
		recentHotels.value = hotels.slice(0, 5);

		recentExcursions.value = excursionsRes.data ?? [];
		excursionsTotal.value =
			excursionsRes.meta?.pagination?.total ?? recentExcursions.value.length;
	} catch (err) {
		console.error(err);
	} finally {
		isLoading.value = false;
	}
});

const hotelsHidden = computed(() =>
	hotelsTotal.value === null || hotelsPublished.value === null
		? null
		: hotelsTotal.value - hotelsPublished.value
);

const hotelItems = computed<RecentItem[]>(() =>
	recentHotels.value.map((hotel: EditHotelDto) => ({
		id: String(hotel._id),
		title: hotel.name,
		subtitle: [hotel.address?.city, hotel.seaType].filter(Boolean).join(' · '),
		value: `${hotel.minPrice}₽`,
		to: { name: 'edit-hotel', params: { id: String(hotel._id) } }
	}))
);

const excursionItems = computed<RecentItem[]>(() =>
	recentExcursions.value.map((excursion: EditExcursionDto) => ({
		id: excursion._id,
		title: excursion.name,
		subtitle: (excursion.cities || []).join(', '),
		value: `${excursion.duration} ${pluralize(excursion.duration, ['день', 'дня', 'дней'])}`,
		to: { name: 'edit-excursion', params: { id: excursion._id } }
	}))
);
</script>
<template>
	<div class="flex h-full flex-col gap-6 overflow-auto">
		<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
			<StatCard
				label="Автобусные туры"
				:value="hotelsTotal"
				:icon="Bus"
				icon-class="bg-deep-orange/10 text-deep-orange"
				:loading="isLoading"
			/>
			<StatCard
				label="Опубликовано"
				:value="hotelsPublished"
				:icon="Eye"
				icon-class="bg-deep-teal/10 text-deep-teal"
				:loading="isLoading"
			/>
			<StatCard
				label="Скрыто"
				:value="hotelsHidden"
				:icon="EyeOff"
				icon-class="bg-slate-100 text-slate-500"
				:loading="isLoading"
			/>
			<StatCard
				label="Экскурсии"
				:value="excursionsTotal"
				:icon="MapIcon"
				icon-class="bg-deep-teal/10 text-deep-teal"
				:loading="isLoading"
			/>
		</div>

		<div class="grid gap-4 lg:grid-cols-2">
			<RecentList
				title="Последние туры"
				:link-to="{ name: 'hotels' }"
				link-label="Все туры"
				:items="hotelItems"
				empty-text="Туров пока нет"
				:loading="isLoading"
			/>
			<RecentList
				title="Последние экскурсии"
				:link-to="{ name: 'excursions' }"
				link-label="Все экскурсии"
				:items="excursionItems"
				empty-text="Экскурсий пока нет"
				:loading="isLoading"
			/>
		</div>
	</div>
</template>
