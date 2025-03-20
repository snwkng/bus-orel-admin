<script setup lang="ts">
import {
	TheInput,
	TheTextArea,
	TheFileInput,
	TheSelect
} from '@/shared/ui/forms';
import type { IExcursion } from '@/entities/excursions/model/types';
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref, type Ref } from 'vue';
import { useExcursionStore } from '@/entities/excursions/model';
import { useExcursionCityStore } from '@/entities/excursionCities/model';
import { storeToRefs } from 'pinia';

export interface Props {
	type: string;
}

const props = defineProps<Props>();

const { createExcursion, editExcursion, getExcursion } = useExcursionStore();
const { getCities, addCity } = useExcursionCityStore();

const { cities } = storeToRefs(useExcursionCityStore());

const router = useRouter();
const route = useRoute();

const excursion: Ref<IExcursion> = ref({
	_id: '',
	name: '',
	description: Array.from(' '),
	images: [],
	duration: 0,
	price: 0,
	documentName: '',
	excursionStart: '',
	cities: [] as SelectItem[] | string[],
	hotelName: '',
	thePriceIncludes: Array.from(' ')
});

const create = async (excursion: IExcursion) => {
	delete excursion._id;
	excursion.cities = excursion.cities.map((x: SelectItem) => x._id) as string[];
	try {
		await createExcursion(excursion);
		router.push('/excursions');
	} catch (err) {
		console.error(err);
	}
};

const edit = async (excursion: IExcursion) => {
	try {
		excursion.cities = excursion.cities.map(
			(x: SelectItem) => x._id
		) as string[];
		await editExcursion(excursion);
		router.push('/excursions');
	} catch (err) {
		console.error(err);
	}
};

const changeCity = async (newCity: string) => {
	const city = await addCity(newCity);
	(excursion.value.cities as SelectItem[]).push(city);
};

onMounted(async () => {
	await getCities();
	if (props.type === 'edit' && route.params.id) {
		excursion.value = await getExcursion(route.params.id as string);
	}
});
</script>
<template>
	<form
		class="form-container"
		@submit.prevent="type === 'create' ? create(excursion) : edit(excursion)"
	>
	<div class="px-6 py-6 md:px-12 md:py-12">
		<TheInput label="Название экскурсии" v-model="excursion.name" />
		<TheInput
			label="Длительность экскурсии (в днях)"
			type="number"
			:modelValue="excursion.duration.toString()"
			@update:modelValue="($event) => (excursion.duration = Number($event))"
		/>
		<TheSelect
			label="Город"
			:modelValue="excursion.cities"
			:list="cities"
			@update:modelValue="($event) => (excursion.cities = $event)"
			@add="changeCity($event)"
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
			:modelValue="excursion.excursionStart"
			@update:modelValue="($event) => (excursion.excursionStart = $event)"
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
					class="secondary-btn mt-3"
					@click="() => excursion.description.push('')"
				>
					Добавить день
				</button>
				<button
					type="button"
					class="delete-btn mt-3"
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
					class="secondary-btn mt-3"
					@click="() => excursion.thePriceIncludes.push('')"
				>
					Добавить опцию
				</button>
				<button
					type="button"
					class="delete-btn mt-3"
					@click="() => excursion.thePriceIncludes.pop()"
				>
					Удалить опцию
				</button>
			</div>
		</div>

		<TheFileInput
			title="Изображения эксркусии"
			name="images"
			accept="image/*"
			multiple
			place="excursion"
			@change="(images: string[]) => (excursion.images = images)"
			:value="excursion.images"
		/>
		<TheFileInput
			title="Прайс"
			name="document"
			accept="application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
			place="excursion"
			@change="(doc: string[]) => (excursion.documentName = doc[0])"
			:value="excursion.documentName ? [excursion.documentName] : []"
		/>
	</div>
		<div class="sticky bottom-0 w-full bg-white flex items-center px-6 py-4">
			<button class="base-btn max-w-[300px]" type="submit">
				{{ type === 'create' ? 'Создать экскурсию' : 'Сохранить' }}
			</button>
		</div>
	</form>
</template>
