<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue';
import { useBusTourStore } from '../model';
import { useRouter } from 'vue-router';

import BaseTable from '@/shared/ui/table/BaseTable.vue';
import GenerateFilePreview from '@/shared/ui/files/GenerateFilePreview.vue';

const imagePath = 'hotels';

const router = useRouter();
const store = useBusTourStore();
const { getFile } = store;

onMounted(async () => {
	await store.getTours();
});

const tours = computed(() => store.tours);

const tableHeaders = reactive([
	{ title: 'Название', name: 'name' },
	{ title: 'Тип', name: 'type' },
	{ title: 'Описание', name: 'locationDescription', meta: { classes: 'w-96'} },
	{ title: 'Изображения', name: 'images' },
	{ title: 'Питание', name: 'food' },
	{ title: 'Тип пляжа', name: 'beach' },
	{ title: 'Расстояние до пляжа', name: 'distanceToBeach' },
	{ title: 'Заселение / Выселение', name: 'checkInConditions' },
	{ title: 'Адрес', name: 'address' },
	{ title: 'Цена (от)', name: 'price', meta: { classes: 'w-30'} },
	{ title: 'В стоимость включено', name: 'thePriceIncludes' },
	{ title: 'Название прайса', name: 'documentName' },
	{ title: 'Туры', name: 'tours' },
	{ title: 'Город', name: 'city', meta: { classes: 'w-30'} },
	{ title: 'Регион', name: 'region' },
	{ title: 'Море', name: 'seaType' },
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
		:headers="tableHeaders"
		:table-data="tours"
		:image-path="imagePath"
		@edit="router.push({ name: 'edit-tour', params: { id: $event } })"
		@delete="deleteTour"
	>
    <template #name="row">
      <RouterLink class="text-ligth-blue hover:underline" :to="{ name: 'edit-tour', params: { id: row.row._id } }">
        {{ row.row.name }}
      </RouterLink>
    </template>
    <template #tours="row">
      <div class="line-clamp-4" :title="tour.roomName" v-for="tour in row.row.tours" :key="tour">
        {{ tour.roomName }}
      </div>
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
