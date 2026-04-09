<script setup lang="ts">
import { computed, h, shallowRef, watch } from 'vue';
import { useExcursionStore } from '../model';
import { useRouter } from 'vue-router';

import BaseTable from '@/shared/ui/table/BaseTable.vue';
import { TrashIcon, EditIcon } from '@/shared/ui/icons';
import type { ITableConfig } from '@/shared/config/interfaces/table.interface';
import type { EditExcursionDto } from '../model/types';
import {
	dateFormat,
	imageFormat,
	linkFormat,
	priceFormat
} from '@/shared/lib/useRenderFunctions';
import { storeToRefs } from 'pinia';
import { useQueryFilters } from '@/shared/lib/useQueryFilters';
import { excursionSchema } from '../model/excursion.schema';

const router = useRouter();
const store = useExcursionStore();

const { filters, updateFilters } = useQueryFilters(excursionSchema);

const { excursions, pagination } = storeToRefs(store);

watch(filters,
	(newFilters) => {
		store.getExcursions(newFilters);
	},
	{ immediate: true, deep: true }
);

const tablePagination = computed(() => ({
	page: filters.value.page,
	limit: filters.value.limit,
	lastPage: pagination.value?.lastPage ?? 0,
	total: pagination.value?.total ?? 0
}));

const tableDataConfig = shallowRef<ITableConfig[]>([
	{
		label: 'Название',
		propertyName: 'name',
		cellWidth: '200px',
		format: (val: EditExcursionDto['name'], row: EditExcursionDto) =>
			linkFormat(val, { name: 'edit-excursion', params: { id: row._id } })
	},
	{
		label: 'Описание',
		propertyName: 'description',
		cellWidth: '300px',
		format: (val: EditExcursionDto['description']) =>
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
		format: (val: EditExcursionDto['price']) => priceFormat(val)
	},
	{ label: 'Отель', propertyName: 'hotelName' },
	{
		label: 'Наличие прайса',
		propertyName: 'documentName',
		format: (val: EditExcursionDto['documentName']) =>
			val.length ? 'Есть' : 'Нет'
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
				{ class: 'flex flex-col' },
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
			await store.getExcursions(filters.value);
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
		:pagination="tablePagination"
		sticky-header
		@update-filters="updateFilters"
	>
		<template #actions="{ item }">
			<div class="flex items-center justify-between gap-2">
				<button
					type="button"
					class="cursor-pointer transition-transform hover:scale-110"
					title="Редактировать"
					@click="
						router.push({ name: 'edit-excursion', params: { id: item._id } })
					"
				>
					<EditIcon fill="#006DF0" :width="25" :height="25" />
				</button>
				<button
					type="button"
					class="cursor-pointer transition-transform hover:scale-110"
					title="Удалить"
					@click="deleteExcursion(item._id)"
				>
					<TrashIcon fill="red" :width="25" :height="25" />
				</button>
			</div>
		</template>
	</BaseTable>
</template>
