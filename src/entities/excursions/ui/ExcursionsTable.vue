<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue';
import { useExcursionStore } from '../model';
import { useRouter } from 'vue-router';

import BaseTable from '@/shared/ui/table/BaseTable.vue';

const imagePath = 'excursions';

const router = useRouter();
const store = useExcursionStore();

onMounted(async () => {
	await store.getExcursions();
});

const excursions = computed(() => store.excursions);

const tableHeaders = reactive([
	{ title: 'Название', name: 'name', meta: { classes: 'w-72'} },
	{ title: 'Описание', name: 'description', meta: { classes: 'w-96'} },
	{ title: 'Изображения', name: 'images' },
	{ title: 'Длительность', name: 'duration' },
	{ title: 'Цена', name: 'price', meta: { classes: 'w-30'} },
	{ title: 'Отель', name: 'hotelName' },
	{ title: 'Название прайса', name: 'documentName' },
	{ title: 'Начало экскурсии', name: 'excursionStart' },
	{ title: 'Город', name: 'city' },
	{ title: 'В стоимость включено', name: 'thePriceIncludes', meta: { classes: 'w-96'} }
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
		:headers="tableHeaders"
		:table-data="excursions"
		:image-path="imagePath"
		@edit="router.push({ name: 'edit-excursion', params: { id: $event } })"
		@delete="deleteExcursion"
	>
	<template #name="row">
      <RouterLink class="text-ligth-blue hover:underline" :to="{ name: 'edit-excursion', params: { id: row.row._id } }">
        {{ row.row.name }}
      </RouterLink>
    </template>
	</BaseTable>
</template>
