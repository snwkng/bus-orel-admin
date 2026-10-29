<script setup lang="ts">
import { computed, h, shallowRef, watch } from 'vue';
import { useBusTourStore } from '../model';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import BaseTable from '@/shared/ui/table/BaseTable.vue';
import { TrashIcon, EditIcon } from '@/shared/ui/icons';
import type { ITableConfig } from '@/shared/config/interfaces/table.interface';
import type { EditHotelDto } from '../model/types';
import { imageFormat, priceFormat } from '@/shared/lib/useRenderFunctions';
import { useQueryFilters } from '@/shared/lib/useQueryFilters';
import { hotelSchema } from '../model/hotel.schema';

const router = useRouter();
const store = useBusTourStore();

const { filters, updateFilters } = useQueryFilters(hotelSchema);

const { tours, pagination } = storeToRefs(store);

watch(
	filters,
	(newFilters) => {
		store.getTours(newFilters);
	},
	{ immediate: true, deep: true }
);

const tablePagination = computed(() => ({
	page: filters.value.page,
	limit: filters.value.limit,
	lastPage: pagination.value?.lastPage ?? 0,
	total: pagination.value?.total ?? 0
}));

const tableDataConfig = shallowRef<ITableConfig<EditHotelDto>[]>([
	{ label: 'Название', propertyName: 'name', cellWidth: '240px' },
	{
		label: 'Изображения',
		propertyName: 'images',
		cellWidth: '280px',
		format: (val) => imageFormat(val)
	},
	{ label: 'Тип', propertyName: 'type', cellWidth: '140px' },
	{ label: 'Питание', propertyName: 'additionalInfo.food.type', cellWidth: '130px' },
	{ label: 'Тип пляжа', propertyName: 'additionalInfo.beach.type', cellWidth: '140px' },
	{
		label: 'Расстояние до пляжа (мин.)',
		propertyName: 'additionalInfo.beach.distanceMinutes',
		cellWidth: '160px'
	},
	{ label: 'Адрес', propertyName: 'address.fullAddress', cellWidth: '260px' },
	{
		label: 'Цена (от)',
		propertyName: 'minPrice',
		cellWidth: '110px',
		format: (val: EditHotelDto['minPrice']) => priceFormat(val)
	},
	{
		label: 'В стоимость включено',
		propertyName: 'includedInThePrice',
		cellWidth: '220px',
		format: (val: EditHotelDto['includedInThePrice']) =>
			h(
				'div',
				{ class: 'flex flex-col' },
				(val || []).map((t: EditHotelDto['includedInThePrice'][number]) => h('span', t.serviceName))
			)
	},
	{ label: 'Город', propertyName: 'address.city', cellWidth: '140px' },
	{ label: 'Регион', propertyName: 'address.region', cellWidth: '140px' },
	{ label: 'Море', propertyName: 'seaType', cellWidth: '140px' }
] as const);

const openTour = (item: EditHotelDto) => {
	router.push({ name: 'edit-tour', params: { id: item._id } });
};

const deleteTour = async (id: string) => {
	await store
		.deleteTour(id)
		.then(async () => {
			await store.getTours(filters.value);
		})
		.catch((err: unknown) => {
			console.error(err);
		});
};
</script>
<template>
	<BaseTable
		:table-data-config="tableDataConfig"
		:table-data="tours"
		:pagination="tablePagination"
		sticky-header
		clickable-rows
		@update-filters="updateFilters"
		@row-click="openTour"
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
					@click.stop="openTour(item)"
				>
					<EditIcon fill="currentColor" :width="20" :height="20" />
				</button>
				<button
					type="button"
					class="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
					title="Удалить"
					@click.stop="deleteTour(item._id)"
				>
					<TrashIcon fill="currentColor" :width="20" :height="20" />
				</button>
			</div>
		</template>
	</BaseTable>
</template>
