<script setup lang="ts">
import dayjs from 'dayjs';
import { TheInput, TheTextArea } from '@/shared/ui/forms';
import type { IExcursion } from '@/entities/excursions/model/types';
import { reactive, ref, watch, type Ref } from 'vue';
import DragAndDrop from '@/shared/ui/dragAndDrop';
import { useExcursionStore } from '@/entities/excursions/model';

const store = useExcursionStore();

const { createExcursion, uploadFiles } = store;

const excursion: IExcursion = reactive({
	name: '',
	description: Array.from({ length: 1 }),
	images: [],
	duration: 0,
	price: 0,
	hotelName: '',
	documentName: '',
	excursionStart: '',
	city: '',
	thePriceIncludes: Array.from({ length: 1 })
});

const images: Ref<File[]> = ref([]);
const price: Ref<File> = ref({} as File);

watch(
	() => excursion.duration,
	() => {
		excursion.description = Array.from({ length: excursion.duration });
	}
);

watch(
	() => images.value,
	() => {
		if (images.value.length) {
			excursion.images = images.value.map((image: File) => ({
				name: image.name.split('.')[0]+'.webp'
			}));
		}
	}
);

watch(
	() => price.value,
	() => {
		if (price.value) {
			excursion.documentName = price.value.name;
		}
	}
);

const updateImages = ($event: File[]) => {
	images.value = $event;
};

const updatePrice = ($event: File[]) => {
	price.value = $event[0];
};

const mappedFiles = (files: File[]): FormData => {
	const formData = new FormData();
	files.forEach((file) => {
		formData.append('file', file);
	});

  return formData;
};

const create = async (excursion: IExcursion) => {
	try {
		await Promise.all([
			createExcursion(excursion),
			uploadFiles(mappedFiles(images.value), 'images/excursions'),
			uploadFiles(mappedFiles([price.value]), 'docs/excursions')
		]);
	} catch (err) {
		console.error(err);
	}
};
</script>
<template>
	<form class="flex flex-col gap-y-5" @submit.prevent="create(excursion)">
		<TheInput
			label="Название экскурсии"
			:modelValue="excursion.name"
			@update:modelValue="($event) => (excursion.name = $event)"
		/>
		<TheInput
			label="Длительность экскурсии (в днях)"
			type="number"
			:modelValue="excursion.duration.toString()"
			@update:modelValue="($event) => (excursion.duration = Number($event))"
		/>
		<TheInput
			label="Город"
			:modelValue="excursion.city"
			@update:modelValue="($event) => (excursion.city = $event)"
		/>
		<TheInput
			label="Стоимость экскрусии"
			type="number"
			:modelValue="excursion.price.toString()"
			@update:modelValue="($event) => (excursion.price = Number($event))"
		/>
		<TheInput
			label="Дата отправления"
			type="date"
			:modelValue="excursion.excursionStart.toString()"
			@update:modelValue="
				($event) =>
					(excursion.excursionStart = dayjs($event).format('YYYY-MM-DD'))
			"
		/>
		<TheInput
			label="Название отеля (если есть)"
			:modelValue="excursion.hotelName"
			@update:modelValue="($event) => (excursion.hotelName = $event)"
		/>

		<div class="flex w-full flex-col items-start">
			<div class="mb-1 text-slate-700">Программа экскурсии</div>
			<div class="flex w-full flex-col gap-y-2">
				<TheTextArea
					v-for="(inc, index) in excursion.description"
					:key="index"
					:placeholder="`День ${index + 1}`"
					:modelValue="inc"
					@update:modelValue="
						($event) => (excursion.description[index] = $event)
					"
				/>
			</div>
			<button
				type="button"
				class="base-btn mt-3"
				@click="() => excursion.description.push('')"
			>
				Добавить день
			</button>
		</div>

		<div class="flex w-full flex-col items-start">
			<div class="mb-1 text-slate-700">В стоимость включено</div>
			<div class="flex w-full flex-col gap-y-2">
				<TheTextArea
					v-for="(inc, index) in excursion.thePriceIncludes"
					:key="index"
					:placeholder="`Опция ${index + 1}`"
					:modelValue="inc"
					@update:modelValue="
						($event) => (excursion.thePriceIncludes[index] = $event)
					"
				/>
			</div>
			<button
				type="button"
				class="base-btn mt-3"
				@click="() => excursion.thePriceIncludes.push('')"
			>
				Добавить поле
			</button>
		</div>

		<DragAndDrop
			title="Изображения эксркусии"
			name="images"
			accept="image/*"
			multiple
			@change="updateImages"
		/>

		<DragAndDrop
			title="Прайс"
			name="document"
			accept="application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
			@change="updatePrice"
		/>

		<button class="base-btn w-[300px]" type="submit">Создать экскурсию</button>
	</form>
</template>
