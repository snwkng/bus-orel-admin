<script setup lang="ts">
import dayjs from 'dayjs';
import { TheInput, TheTextArea } from '@/shared/ui/forms';
import type { IExcursion } from '@/entities/excursions/model/types';
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref, watch, type Ref } from 'vue';
import { useExcursionStore } from '@/entities/excursions/model';
import DragAndDrop from '@/shared/ui/dragAndDrop';
import { FilesPath } from '@/shared/lib/enums';

export interface Props {
	type: string;
}

const props = defineProps<Props>();

const store = useExcursionStore();

const router = useRouter();
const route = useRoute();

const { createExcursion, editExcursion, uploadFiles, getExcursion, getFile } = store;

const excursion: Ref<IExcursion> = ref({
	_id: '',
	name: '',
	description: Array.from(' '),
	images: [],
	duration: 0,
	price: 0,
	documentName: '',
	excursionStart: '',
	city: '',
	hotelName: '',
	thePriceIncludes: Array.from(' ')
});

const images: Ref<File[]> = ref([]);
const price: Ref<File[]> = ref([]);

watch(
	() => images.value,
	() => {
		if (images.value.length) {
			excursion.value.images = images.value.map((image: File) => ({
				name: image.name.split('.')[0] + '.webp'
			}));
		}
	}
);

watch(
	() => price.value,
	() => {
		if (price.value.length) {
			excursion.value.documentName = price.value[0].name;
		}
	}
);

const updateImages = ($event: File[]) => {
	images.value = $event;
};

const updatePrice = ($event: File[]) => {
	price.value[0] = $event[0];
};

const mappedFiles = (files: File[]): FormData => {
	const formData = new FormData();
	files.forEach((file) => {
		formData.append('file', file);
	});

	return formData;
};

const create = async (excursion: IExcursion) => {
	delete excursion._id;
	try {
		if (images.value && images.value.length) {
			await uploadFiles(mappedFiles(images.value), FilesPath.EXCURSION_IMAGE);
		}
		if (price.value && price.value.length) {
			await uploadFiles(mappedFiles(price.value), FilesPath.EXCURSION_DOCS);
		}
		await createExcursion(excursion);
		router.push('/excursions');
	} catch (err) {
		console.error(err);
	}
};

const edit = async (excursion: IExcursion) => {
	try {
		if (images.value && images.value.length) {
			await uploadFiles(mappedFiles(images.value), FilesPath.EXCURSION_IMAGE);
		}
		if (price.value && price.value.length) {
			await uploadFiles(mappedFiles(price.value), FilesPath.EXCURSION_DOCS);
		}
		await editExcursion(excursion);
		router.push('/excursions');
	} catch (err) {
		console.error(err);
	}
};

onMounted(async () => {
	if (props.type === 'edit' && route.params.id) {
		excursion.value = await getExcursion(route.params.id as string);
		const exImages = excursion.value.images.map((image) => {
			return getFile(image.name, 'images', 'excursions');
		});

		images.value = await Promise.all(exImages);

		await getFile(
			excursion.value.documentName,
			'docs',
			'excursions'
		)
		.then((res) => price.value[0] = res)
		.catch((err) => console.log(err));
	}
});
</script>
<template>
	<form
		class="flex flex-col gap-y-5"
		@submit.prevent="type === 'create' ? create(excursion) : edit(excursion)"
	>
		<TheInput label="Название экскурсии" v-model="excursion.name" />
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
			:modelValue="dayjs(excursion.excursionStart).format('YYYY-MM-DD')"
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
			<div class="flex flex-row gap-x-3">
				<button
					type="button"
					class="base-btn mt-3"
					@click="() => excursion.description.push('')"
				>
					Добавить день
				</button>
				<button
					type="button"
					class="secondary-btn mt-3"
					@click="() => excursion.description.pop()"
				>
					Удалить день
				</button>
			</div>
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
			<div class="flex flex-row gap-x-3">
				<button
					type="button"
					class="base-btn mt-3"
					@click="() => excursion.thePriceIncludes.push('')"
				>
					Добавить опцию
				</button>
				<button
					type="button"
					class="secondary-btn mt-3"
					@click="() => excursion.thePriceIncludes.pop()"
				>
					Удалить опцию
				</button>
			</div>
		</div>

		<DragAndDrop
			title="Изображения эксркусии"
			name="images"
			accept="image/*"
			multiple
			@change="updateImages"
			:value="images"
		/>

		<DragAndDrop
			title="Прайс"
			name="document"
			accept="application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
			@change="updatePrice"
			:value="price"
		/>

		<button class="base-btn w-[300px]" type="submit">{{ type === 'create' ? 'Создать экскурсию' : 'Редактировать экскурсию' }}</button>
	</form>
</template>
