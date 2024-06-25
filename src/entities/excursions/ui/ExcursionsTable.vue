<script setup lang="ts">
import { TrashIcon, EditIcon } from '@/shared/ui/icons';
import { computed, onMounted } from 'vue';
import { useExcursionStore } from '../model';
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';

const baseURl = import.meta.env.VITE_BASE_URL
const basePort = import.meta.env.VITE_BACKEND_PORT
const imagePath = 'excursions'

const router = useRouter();
const store = useExcursionStore();

onMounted(async () => {
	await store.getExcursions();
})

const excursions = computed(() => store.excursions)

const deleteExcursion = async (id: string) => {
	await store.deleteExcursion(id).then(async () => {
		await store.getExcursions();
	}).catch((err) => {
		console.error(err);
	})
}
</script>
<template>
	<div class="mt-6 rounded-xl bg-white p-8 shadow lg:mt-0">
		<table id="excursions-table" class="block w-full max-w-fit overflow-x-auto">
			<thead>
				<tr>
					<th
						class="min-w-[200px] p-2 text-start align-middle"
						data-priority="1"
					>
						Название
					</th>
					<th
						class="min-w-[500px] p-2 text-start align-middle"
						data-priority="2"
					>
						Описание
					</th>
					<th
						class="min-w-[300px] p-2 text-start align-middle"
						data-priority="3"
					>
						Изображения
					</th>
					<th
						class="min-w-[10px] p-2 text-start align-middle"
						data-priority="4"
					>
						Длительность
					</th>
					<th
						class="min-w-[100px] p-2 text-start align-middle"
						data-priority="5"
					>
						Цена (от)
					</th>
					<th
						class="min-w-[300px] p-2 text-start align-middle"
						data-priority="6"
					>
						Отель
					</th>
					<th
						class="min-w-[200px] p-2 text-start align-middle"
						data-priority="7"
					>
						Название прайса
					</th>
					<th
						class="min-w-[100px] p-2 text-start align-middle"
						data-priority="8"
					>
						Начало экскурсии
					</th>
					<th
						class="min-w-[100px] p-2 text-start align-middle"
						data-priority="9"
					>
						Город
					</th>
					<th
						class="min-w-[700px] p-2 text-start align-middle"
						data-priority="10"
					>
						В стоимость включено
					</th>
					<th
						class="min-w-[200px] p-2 text-start align-middle"
						data-priority="11"
					>
						Действия
					</th>
				</tr>
			</thead>
			<tbody>
				<tr class="border-b border-neutral-300" v-for="excursion in excursions" :key="excursion._id">
					<td class="p-2 text-start align-top">
						{{ excursion.name }}
					</td>
					<td class="p-2 text-start align-top">
						<div class="line-clamp-4">
							<span v-for="(description, index) in excursion.description" :key="index">
								{{ description }}<br>
							</span>
						</div>
					</td>
					<td class="p-2 text-start align-top">
						<div class="flex flex-wrap gap-2">
							<img v-for="image in excursion.images" :key="image._id"
								:src="`${baseURl}:${basePort}/public/images/${imagePath}/${image.name}`"
								alt=""
								width="50"
							/>
						</div>
					</td>
					<td class="p-2 text-center align-top">{{ excursion.duration }}</td>
					<td class="p-2 text-center align-top">{{ excursion.price }}&#8381;</td>
					<td class="p-2 text-start align-top">{{ excursion.hotelName }}</td>
					<td class="p-2 text-start align-top">{{ excursion.documentName }}</td>
					<td class="p-2 text-start align-top">{{ dayjs(excursion.excursionStart).format('DD.MM.YYYY') }}</td>
					<td class="p-2 text-start align-top">{{ excursion.city }}</td>
					<td class="p-2 text-start align-top">
						<div class="line-clamp-4">
							<span v-for="(priceInclude, index) in excursion.thePriceIncludes" :key="index">
								{{ priceInclude }}<br>
							</span>
						</div>
					</td>
					<td class="p-2 text-start align-top">
						<div class="flex gap-3 items-center">
							<div class="cursor-pointer" title="Редактировать" @click="router.push({name: 'edit-excursion', params: {id: excursion._id}})">
								<EditIcon fill="#009EFF" />
							</div>
							<button type="button" class="cursor-pointer" title="Удалить" @click="deleteExcursion(excursion._id)">
								<TrashIcon fill="red" />
							</button>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>
