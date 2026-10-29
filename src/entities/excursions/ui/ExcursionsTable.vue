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

const tableDataConfig = shallowRef<ITableConfig<EditExcursionDto>[]>([
	{
		label: 'Название',
		propertyName: 'name',
		cellWidth: '240px'
	},
	{
		label: 'Изображения',
		propertyName: 'images',
		cellWidth: '280px',
		format: (val) => imageFormat(val)
	},
	{
		label: 'Тип',
		propertyName: 'type',
		cellWidth: '140px'
	},
	{ label: 'Длительность', propertyName: 'duration', cellWidth: '130px' },
	{
		label: 'Цена',
		propertyName: 'price',
		cellWidth: '110px',
		format: (val: EditExcursionDto['price']) => priceFormat(val)
	},
	{
		label: 'Даты экскурсий',
		propertyName: 'excursionStartDates',
		cellWidth: '140px',
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
	}
] as const);

const openExcursion = (item: EditExcursionDto) => {
	router.push({ name: 'edit-excursion', params: { id: item._id } });
};

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
		clickable-rows
		@update-filters="updateFilters"
		@row-click="openExcursion"
	>
		<template #cell(name)="{ value }">
			<span class="font-medium text-slate-900">{{ value }}</span>
		</template>
		<template #actions="{ item }">
			<div class="flex items-center gap-1">
				<button
					type="button"
					class="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-deep-teal"
					title="Редактировать"
					@click.stop="openExcursion(item)"
				>
					<EditIcon fill="currentColor" :width="20" :height="20" />
				</button>
				<button
					type="button"
					class="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
					title="Удалить"
					@click.stop="deleteExcursion(item._id)"
				>
					<TrashIcon fill="currentColor" :width="20" :height="20" />
				</button>
			</div>
		</template>
	</BaseTable>
</template>
