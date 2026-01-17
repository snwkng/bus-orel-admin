<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { useExcursionStore } from '../model';
import { useRoute, useRouter, type LocationQuery } from 'vue-router';

import BaseTable from '@/shared/ui/table/BaseTable.vue';
import type { ITableDataConfig } from '@/shared/config/interfaces/table.interface';

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

const tableDataConfig = reactive<ITableDataConfig[]>([
	{ label: 'Название', propertyName: 'name', cellWidth: '200px' },
	{
		label: 'Описание',
		propertyName: 'description',
		cellWidth: '300px',
		dataType: 'arrayString'
	},
	{ label: 'Изображения', propertyName: 'images', cellWidth: '250px', dataType: 'images' },
	{ label: 'Длительность', propertyName: 'duration' },
	{
		label: 'Цена',
		propertyName: 'price',
		dataType: 'money',
		cellWidth: '120px'
	},
	{ label: 'Отель', propertyName: 'hotelName' },
	{
		label: 'Название прайса',
		propertyName: 'documentName',
		dataType: 'arrayString'
	},
	{
		label: 'Даты экскурсий',
		propertyName: 'excursionStartDates',
		dataType: 'arrayDates'
	},
	{ label: 'Город', propertyName: 'cities', dataType: 'arrayString' },
	{
		label: 'В стоимость включено',
		propertyName: 'thePriceIncludes',
		cellWidth: '250px',
		dataType: 'arrayString'
	},

	{
		label: 'Дополнительно оплачивается',
		propertyName: 'additionallyPaid',
		cellWidth: '250px',
		dataType: 'arrayString'
	}
]);

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
		<template #name="row">
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
