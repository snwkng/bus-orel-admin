<script setup lang="ts">
// import dayjs from 'dayjs';
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref, watch, type Ref } from 'vue';
import type { ITour } from '@/entities/busTours/model/types';
import DragAndDrop from '@/shared/ui/dragAndDrop';
import { useBusTourStore } from '@/entities/busTours/model';
import { FilesPath } from '@/shared/lib/enums';
import { TheInput, TheTextArea } from '@/shared/ui/forms';

export interface Props {
	type: string;
}

const props = defineProps<Props>();

const store = useBusTourStore();

const router = useRouter();
const route = useRoute();

const { createTour, editTour, uploadFiles, getTour, getFile } = store;

const busTour: Ref<ITour> = ref({
	_id: '',
	name: '',
	type: '',
	locationDescription: '',
	images: [],
	tours: [],
	food: '',
	beach: '',
	distanceToBeach: '',
	checkInConditions: '',
	address: '',
	price: 0,
	thePriceIncludes: Array.from(' '),
	city: '',
	region: '',
	seaType: '',
	documentName: ''
});

const images: Ref<File[]> = ref([]);
const price: Ref<File[]> = ref([]);

watch(
	() => images.value,
	() => {
		if (images.value.length) {
			busTour.value.images = images.value.map((image: File) => ({
				name: image.name.split('.')[0] + '.webp'
			}));
		}
	}
);

watch(
	() => price.value,
	() => {
		if (price.value.length) {
			busTour.value.documentName = price.value[0].name;
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

const create = async (busTour: ITour) => {
	try {
		delete busTour._id;
		if (images.value && images.value.length) {
			await uploadFiles(mappedFiles(images.value), FilesPath.BUS_TOUR_IMAGE);
		}
		if (price.value && price.value.length) {
			await uploadFiles(mappedFiles(price.value), FilesPath.BUS_TOUR_DOCS);
		}
		await createTour(busTour);
		router.push('/bus-tours');
	} catch (err) {
		console.error(err);
	}
};

const edit = async (busTour: ITour) => {
	try {
		if (images.value && images.value.length) {
			await uploadFiles(mappedFiles(images.value), FilesPath.BUS_TOUR_IMAGE);
		}
		if (price.value && price.value.length) {
			await uploadFiles(mappedFiles(price.value), FilesPath.BUS_TOUR_DOCS);
		}
		await editTour(busTour);
		router.push('/bus-tours');
	} catch (err) {
		console.error(err);
	}
};

onMounted(async () => {
	if (props.type === 'edit' && route.params.id) {
		busTour.value = await getTour(route.params.id as string);
		const busTourImages = busTour.value?.images?.map((image) => {
			if (image) {
				return getFile(image.name, 'images', 'hotels');
			}
		});

		if (busTourImages?.length) {
			images.value = (await Promise.all(busTourImages)) as File[];
		}

		if (busTour.value.documentName) {
			await getFile(busTour.value.documentName, 'docs', 'hotels')
				.then((res: File) => (price.value[0] = res))
				.catch((err: unknown) => console.log(err));
		}
	}
});
</script>
<template>
	<form
		class="flex flex-col gap-y-5"
		@submit.prevent="type === 'create' ? create(busTour) : edit(busTour)"
	>
		<TheInput label="Название Гостиницы" v-model="busTour.name" />
		<TheInput label="Тип (отель, гостиница и т.д)" v-model="busTour.type" />
		<TheTextArea
			label="Описание гостиницы"
			v-model="busTour.locationDescription"
		/>
		<TheInput label="Питание" v-model="busTour.food" />
		<TheInput label="Тип пляжа" v-model="busTour.beach" />
		<TheInput
			label="Расстояние до пляжа в метрах или минутах"
			v-model="busTour.distanceToBeach"
		/>
		<TheInput label="Адрес гостиницы" v-model="busTour.address" />
		<TheInput
			label="Минимальная цена заезда"
			type="number"
			:modelValue="busTour.price.toString()"
			@update:modelValue="($event) => (busTour.price = Number($event))"
		/>
		<TheInput label="Регион" v-model="busTour.region" />
		<TheInput label="Город" v-model="busTour.city" />
		<TheInput label="Море" v-model="busTour.seaType" />

		<div class="flex w-full flex-col items-start">
			<div class="mb-1 text-slate-700">В стоимость включено</div>
			<div class="flex w-full flex-col gap-y-2">
				<TheTextArea
					v-for="(inc, index) in busTour.thePriceIncludes"
					:key="index"
					:placeholder="`Опция ${index + 1}`"
					:modelValue="inc"
					@update:modelValue="
						($event) => (busTour.thePriceIncludes[index] = $event)
					"
				/>
			</div>
			<div class="flex flex-row gap-x-3">
				<button
					type="button"
					class="base-btn mt-3"
					@click="() => busTour.thePriceIncludes.push('')"
				>
					Добавить опцию
				</button>
				<button
					type="button"
					class="secondary-btn mt-3"
					@click="() => busTour.thePriceIncludes.pop()"
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

		<button class="base-btn w-[300px]" type="submit">
			{{ type === 'create' ? 'Создать экскурсию' : 'Редактировать экскурсию' }}
		</button>
	</form>
</template>
