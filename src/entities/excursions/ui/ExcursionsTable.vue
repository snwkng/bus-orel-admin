<script setup lang="ts">
import { computed, h, shallowRef, watch } from 'vue';
import { useExcursionStore } from '../model';
import { useRouter } from 'vue-router';
import { RouteNames } from '@/app/router/RouteNames.enum';

import BaseTable from '@/shared/ui/table/BaseTable.vue';
import TableToolbar from '@/shared/ui/table/TableToolbar.vue';
import ConfirmDialog from '@/shared/ui/ConfirmDialog.vue';
import FileActions from '@/shared/ui/files/FileActions.vue';
import { useToast } from '@/shared/lib/useToasts';
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
import { excursionSchema, type ExcursionFilters } from '../model/excursion.schema';

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
		cellWidth: '110px',
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
	{ label: 'Прайс', propertyName: 'documentName', cellWidth: '100px' },
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
	router.push({ name: RouteNames.EditExcursion, params: { id: item._id } });
};

const sortOptions = [
	{ value: 'createdAt', label: 'По дате добавления' },
	{ value: 'name', label: 'По названию' },
	{ value: 'price', label: 'По цене' },
	{ value: 'type', label: 'По типу' },
	{ value: 'duration', label: 'По длительности' }
];

const { show } = useToast();

const excursionToDelete = shallowRef<EditExcursionDto | null>(null);

const askDeleteExcursion = (item: EditExcursionDto) => {
	excursionToDelete.value = item;
};

const confirmDeleteExcursion = async () => {
	const item = excursionToDelete.value;
	excursionToDelete.value = null;
	if (!item) return;
	try {
		await store.deleteExcursion(item._id);
		await store.getExcursions(filters.value);
		show('Экскурсия удалена', 'success');
	} catch (err) {
		console.error(err);
		show('Не удалось удалить экскурсию', 'error');
	}
};
</script>
<template>
	<div class="flex h-full min-h-0 flex-col gap-4">
		<TableToolbar
			with-search
			search-placeholder="Поиск по названию"
			:search="filters.search ?? ''"
			:sort-by="filters.sortBy"
			:sort-dir="filters.sortDir"
			:sort-options="sortOptions"
			@update:search="(v) => updateFilters({ search: v || undefined, page: 1 })"
			@update:sort-by="(v) => updateFilters({ sortBy: v, page: 1 })"
			@update:sort-dir="(v) => updateFilters({ sortDir: v as ExcursionFilters['sortDir'] })"
		/>
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
		<template #cell(documentName)="{ value }">
			<FileActions :files="(value as string[])" />
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
					@click.stop="askDeleteExcursion(item)"
				>
					<TrashIcon fill="currentColor" :width="20" :height="20" />
				</button>
			</div>
		</template>
		</BaseTable>
		<ConfirmDialog
			:open="!!excursionToDelete"
			title="Удалить экскурсию?"
			:message="`Экскурсия «${excursionToDelete?.name}» будет удалена без возможности восстановления.`"
			@confirm="confirmDeleteExcursion"
			@cancel="excursionToDelete = null"
		/>
	</div>
</template>
