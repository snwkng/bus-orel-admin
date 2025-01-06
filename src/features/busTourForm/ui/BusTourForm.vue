<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref, type Ref } from 'vue';
import type { ITour } from '@/entities/busTours/model/types';
import { useBusTourStore } from '@/entities/busTours/model';
import { TheInput, TheTextArea, TheFileInput } from '@/shared/ui/forms';

export interface Props {
	type: string;
}

const props = defineProps<Props>();

const store = useBusTourStore();

const router = useRouter();
const route = useRoute();

const { createTour, editTour, uploadFile, getTour, getFile } = store;

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

const create = async (busTour: ITour) => {
	try {
		delete busTour._id;
		await createTour(busTour);
		router.push('/bus-tours');
	} catch (err) {
		console.error(err);
	}
};

const edit = async (busTour: ITour) => {
	try {
		await editTour(busTour);
		router.push('/bus-tours');
	} catch (err) {
		console.error(err);
	}
};

onMounted(async () => {
	if (props.type === 'edit' && route.params.id) {
		busTour.value = await getTour(route.params.id as string);
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
					class="secondary-btn mt-3"
					@click="() => busTour.thePriceIncludes.push('')"
				>
					Добавить опцию
				</button>
				<button
					type="button"
					class="delete-btn mt-3"
					@click="() => busTour.thePriceIncludes.pop()"
				>
					Удалить опцию
				</button>
			</div>
		</div>

		<TheFileInput
			title="Изображения гостиницы"
			name="images"
			accept="image/*"
			multiple
			place="busTour"
			@change="(images: string[]) => busTour.images = images"
			:value="busTour.images"
		/>
		<TheFileInput
			title="Прайс"
			name="document"
			accept="application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
			place="busTour"
			@change="(doc: string[]) => busTour.documentName = doc[0]"
			:value="busTour.documentName ? [busTour.documentName] : []"
		/>

		<button class="base-btn max-w-[300px]" type="submit">
			{{ type === 'create' ? 'Создать гостиницу' : 'Сохранить' }}
		</button>
	</form>
</template>
