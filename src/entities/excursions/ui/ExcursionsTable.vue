<script setup lang="ts">
import { computed, h, shallowRef, watch } from 'vue';
import { useExcursionStore } from '../model';
import { useRoute, useRouter, type LocationQuery } from 'vue-router';

import BaseTable from '@/shared/ui/table/BaseTable.vue';
import type { ITableConfig } from '@/shared/config/interfaces/table.interface';
import type { IExcursion } from '../model/types';
import {
	dateFormat,
	imageFormat,
	linkFormat,
	priceFormat
} from '@/shared/config/composables/useRenderFunctions';

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
	{
		label: 'Название',
		propertyName: 'name',
		cellWidth: '200px',
		format: (val: IExcursion['name'], row: IExcursion) =>
			linkFormat(val, { name: 'edit-excursion', params: { id: row._id } })
	},
	{
		label: 'Описание',
		propertyName: 'description',
		cellWidth: '300px',
		format: (val: IExcursion['description']) =>
			Array.isArray(val) ? val.join(', ') : val
	},
	{
		label: 'Изображения',
		propertyName: 'images',
		cellWidth: '350px',
		format: (val) => imageFormat(val)
	},
	{ label: 'Длительность', propertyName: 'duration' },
	{
		label: 'Цена',
		propertyName: 'price',
		cellWidth: '120px',
		format: (val: IExcursion['price']) => priceFormat(val)
	},
	{ label: 'Отель', propertyName: 'hotelName' },
	{
		label: 'Наличие прайса',
		propertyName: 'documentName',
		format: (val: IExcursion['documentName']) => (val.length ? 'Есть' : 'Нет')
	},
	{
		label: 'Даты экскурсий',
		propertyName: 'excursionStartDates',
		format: (val: string[]) =>
			h(
				'div',
				(val || []).map((t) => h('span', dateFormat(t, 'DD.MM.YYYY')))
			)
	},
	{
		label: 'Город(-а)',
		propertyName: 'cities',
		format: (val: string[]) =>
			h(
				'div',
				{class: 'flex flex-col'},
				(val || []).map((t) => h('span', t))
			)
	},
	{
		label: 'В стоимость включено',
		propertyName: 'thePriceIncludes',
		cellWidth: '250px'
	},

	{
		label: 'Дополнительно оплачивается',
		propertyName: 'additionallyPaid',
		cellWidth: '250px'
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
	/>
</template>
