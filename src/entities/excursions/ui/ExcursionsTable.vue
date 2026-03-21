<script setup lang="ts">
import { computed, h, shallowRef, watch } from 'vue';
import { useExcursionStore } from '../model';
import { useRoute, useRouter, type LocationQuery } from 'vue-router';

import BaseTable from '@/shared/ui/table/BaseTable.vue';
import type { ITableConfig } from '@/shared/config/interfaces/table.interface';
import type { IExcursion } from '../model/types';

const router = useRouter();
const route = useRoute();
const store = useExcursionStore();

watch(
	() => route.query,
	async (val: LocationQuery) => {
		await store.getExcursions(val as Record<string, string>);
	},
	{ immediate: true }
);

const excursions = computed(() => store.excursions);

const tableDataConfig = shallowRef<ITableConfig[]>([
	{ label: 'Название', propertyName: 'name', cellWidth: '200px' },
	{
		label: 'Описание',
		propertyName: 'description',
		cellWidth: '300px',
		format: (val: IExcursion['description']) => Array.isArray(val) ? val.join(', ') : val 
	},
	{ label: 'Изображения', propertyName: 'images', cellWidth: '350px' },
	{ label: 'Длительность', propertyName: 'duration' },
	{
		label: 'Цена',
		propertyName: 'price',
		cellWidth: '120px'
	},
	{ label: 'Отель', propertyName: 'hotelName' },
	{
		label: 'Название прайса',
		propertyName: 'documentName',
	},
	{
		label: 'Даты экскурсий',
		propertyName: 'excursionStartDates',
		format: (val: string[]) => h('div', (val || []).map(t => h('span', t)))
	},
	{ label: 'Город', propertyName: 'cities' },
	{
		label: 'В стоимость включено',
		propertyName: 'thePriceIncludes',
		cellWidth: '250px',
	},

	{
		label: 'Дополнительно оплачивается',
		propertyName: 'additionallyPaid',
		cellWidth: '250px',
	}
] as const);

const deleteExcursion = async (id: string) => {
	await store
		.deleteExcursion(id)
		.then(async () => {
			await store.getExcursions();
		})
		.catch((err) => {
			console.error(err);
		});
};
</script>
<template>
	<BaseTable
		:table-data-config="tableDataConfig"
		:table-data="excursions"
		@edit="router.push({ name: 'edit-excursion', params: { id: $event } })"
		@delete="deleteExcursion"
	>
		<template #cell(name)="row">
			<RouterLink
				class="text-ligth-blue hover:underline"
				:to="{ name: 'edit-excursion', params: { id: row.row._id } }"
			>
				{{ row.row.name }}
			</RouterLink>
		</template>
		<!-- <template #images="row">
			<div class="flex flex-row flex-wrap gap-1">
				<div
					class="relative"
					v-for="(imageName, index) in row?.row.images"
					:key="imageName"
				>
					<img
						loading="lazy"
						:src="`/api/s3/download/${imageName}`"
						:alt="`preview-${index}`"
						class="h-[70px] w-[80px] rounded-lg object-fill"
					/>
				</div>
			</div>
		</template> -->
	</BaseTable>
</template>
