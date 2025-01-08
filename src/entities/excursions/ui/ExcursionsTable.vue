<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue';
import { useExcursionStore } from '../model';
import { useRouter } from 'vue-router';

import BaseTable from '@/shared/ui/table/BaseTable.vue';
import GenerateFilePreview from '@/shared/ui/files/GenerateFilePreview.vue';

const router = useRouter();
const store = useExcursionStore();
const { getFile } = store;

onMounted(async () => {
	await store.getExcursions();
});

const excursions = computed(() => store.excursions);

const tableHeaders = reactive([
	{ title: 'Название', name: 'name', meta: { classes: 'w-72' } },
	{ title: 'Описание', name: 'description', meta: { classes: 'w-96' } },
	{ title: 'Изображения', name: 'images' },
	{ title: 'Длительность', name: 'duration' },
	{ title: 'Цена', name: 'price', meta: { classes: 'w-30' } },
	{ title: 'Отель', name: 'hotelName' },
	{ title: 'Название прайса', name: 'documentName' },
	{ title: 'Начало экскурсии', name: 'excursionStart' },
	{ title: 'Город', name: 'city' },
	{
		title: 'В стоимость включено',
		name: 'thePriceIncludes',
		meta: { classes: 'w-96' }
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
		:headers="tableHeaders"
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
