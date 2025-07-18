<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue';
import { useExcursionStore } from '../model';
import { useRouter } from 'vue-router';

import BaseTable from '@/shared/ui/table/BaseTable.vue';
import GenerateFilePreview from '@/shared/ui/files/GenerateFilePreview.vue';
import type { ITableDataConfig } from '@/shared/config/interfaces/table.interface';

const router = useRouter();
const store = useExcursionStore();
const { getFile } = store;

onMounted(async () => {
	await store.getExcursions();
});

const excursions = computed(() => store.excursions);

const tableDataConfig = reactive<ITableDataConfig[]>([
	{ label: 'Название', propertyName: 'name', cellWidth: '200px' },
	{
		label: 'Описание',
		propertyName: 'description',
		cellWidth: '300px',
		dataType: 'arrayString'
	},
	{ label: 'Изображения', propertyName: 'images' },
	{ label: 'Длительность', propertyName: 'duration' },
	{ label: 'Цена', propertyName: 'price', cellWidth: '100px' },
	{ label: 'Отель', propertyName: 'hotelName' },
	{ label: 'Название прайса', propertyName: 'documentName' },
	{
		label: 'Начало экскурсии',
		propertyName: 'excursionStartDates',
		dataType: 'date'
	},
	{ label: 'Город', propertyName: 'cities', dataType: 'arrayString' },
	{
		label: 'В стоимость включено',
		propertyName: 'thePriceIncludes',
		cellWidth: '250px',
		dataType: 'arrayString'
	}
]);

const getImage = async (imageName: string): Promise<File | undefined> => {
	return await getFile(imageName);
};

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
		<template #images="row">
			<div class="flex flex-row flex-wrap gap-1">
				<div
					class="relative"
					v-for="imageName in row?.row.images"
					:key="imageName"
				>
					<GenerateFilePreview
						:get-file="getImage(imageName)"
						preview-width="w-[80px]"
						preview-height="h-[70px]"
					/>
				</div>
			</div>
		</template>
	</BaseTable>
</template>
