<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue';
import { useBusTourStore } from '../model';
import { useRouter } from 'vue-router';

import BaseTable from '@/shared/ui/table/BaseTable.vue';
import type { ITableDataConfig } from '@/shared/config/interfaces/table.interface';

const router = useRouter();
const store = useBusTourStore();
const { getFile } = store;

onMounted(async () => {
	await store.getTours();
});

const tours = computed(() => store.tours);

const tableDataConfig = reactive<ITableDataConfig[]>([
	{ label: 'Название', propertyName: 'name', cellWidth: '250px' },
	{ label: 'Тип', propertyName: 'type' },
	{ label: 'Описание', propertyName: 'description', cellWidth: '400px' },
	{
		label: 'Изображения',
		propertyName: 'images',
		cellWidth: '350px',
		dataType: 'image'
	},
	{ label: 'Питание', propertyName: 'additionalInfo.food.type' },
	{ label: 'Тип пляжа', propertyName: 'additionalInfo.beach.type' },
	{
		label: 'Расстояние до пляжа (мин.)',
		propertyName: 'additionalInfo.beach.distanceMinutes'
	},
	{ label: 'Заселение / Выселение', propertyName: 'checkInConditions' },
	{ label: 'Адрес', propertyName: 'address.fullAddress', cellWidth: '300px' },
	{ label: 'Цена (от)', propertyName: 'minPrice', dataType: 'money' },
	{ label: 'В стоимость включено', propertyName: 'includedInThePrice' },
	{ label: 'Название прайса', propertyName: 'documentName' },
	{ label: 'Туры', propertyName: 'tours' },
	{ label: 'Город', propertyName: 'address.city' },
	{ label: 'Регион', propertyName: 'address.region' },
	{ label: 'Море', propertyName: 'seaType' }
]);

const getImage = async (imageName: string): Promise<File | undefined> => {
	return await getFile(imageName);
};

const deleteTour = async (id: string) => {
	await store
		.deleteTour(id)
		.then(async () => {
			await store.getTours();
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
		@edit="router.push({ name: 'edit-tour', params: { id: $event } })"
		@delete="deleteTour"
		:get-image="getImage"
	>
		<template #name="row">
			<RouterLink
				class="text-ligth-blue hover:underline"
				:to="{ name: 'edit-tour', params: { id: row.row._id } }"
			>
				{{ row.row.name }}
			</RouterLink>
		</template>
		<template #tours="row">
			<div
				class="line-clamp-4"
				:title="tour.roomName"
				v-for="tour in row.row.tours"
				:key="tour"
			>
				{{ tour.roomName }}
			</div>
		</template>
	</BaseTable>
</template>
