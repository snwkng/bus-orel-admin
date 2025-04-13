<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref, type Ref } from 'vue';
import type { IHotelRoomInfo, ITour } from '@/entities/busTours/model/types';
import { useBusTourStore } from '@/entities/busTours/model';
import { useBusTourCityStore } from '@/entities/busTourCities/model';
import { storeToRefs } from 'pinia';
import {
	TheInput,
	TheTextArea,
	TheFileInput,
	TheSelect,
} from '@/shared/ui/forms';
import FormField from '@/entities/formField/ui/FormField.vue';
import HotelRoom from '@/widgets/hotelRoom';

export interface Props {
	type: string;
}

const props = defineProps<Props>();

const store = useBusTourStore();

const router = useRouter();
const route = useRoute();

const { createTour, editTour, uploadFile, getTour, getFile } = store;
const { getCities, addCity } = useBusTourCityStore();

const { cities } = storeToRefs(useBusTourCityStore());

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
	city: {},
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

const changeCity = async (newCity: string) => {
	const city = await addCity(newCity);
	busTour.value.city = city;
};

const updateTour = (tour: IHotelRoomInfo) => {
	console.log(tour)
}

onMounted(async () => {
	await getCities();
	if (props.type === 'edit' && route.params.id) {
		busTour.value = await getTour(route.params.id as string);
	}
});
</script>
<template>
	<form
		class="form-container"
		@submit.prevent="type === 'create' ? create(busTour) : edit(busTour)"
	>
		<div class="form-container-content">
			<FormField name="name" label="Название Гостиницы" column>
				<TheInput name="name" type="text" v-model="busTour.name" />
			</FormField>
			<FormField name="type" label="Тип (отель, гостиница и т.д)" column>
				<TheInput name="type" type="text" v-model="busTour.type" />
			</FormField>
			<FormField name="locationDescription" label="Описание гостиницы" column>
				<TheInput
					name="locationDescription"
					type="text"
					v-model="busTour.locationDescription"
				/>
			</FormField>
			<FormField name="food" label="Питание" column>
				<TheInput name="food" type="text" v-model="busTour.food" />
			</FormField>
			<FormField name="beach" label="Тип пляжа" column>
				<TheInput name="beach" type="text" v-model="busTour.beach" />
			</FormField>
			<FormField
				name="distanceToBeach"
				label="Расстояние до пляжа в метрах или минутах"
				column
			>
				<TheInput
					name="distanceToBeach"
					type="text"
					v-model="busTour.distanceToBeach"
				/>
			</FormField>
			<FormField
				name="checkInConditions"
				label="Условия заселения / выселения"
				column
			>
				<TheTextArea
					name="checkInConditions"
					v-model="busTour.checkInConditions"
				/>
			</FormField>
			<FormField name="address" label="Адрес гостиницы" column>
				<TheInput name="address" type="text" v-model="busTour.address" />
			</FormField>
			<FormField name="price" label="Минимальная цена заезда" column>
				<TheInput name="price" type="number" v-model="busTour.price" />
			</FormField>
			<FormField name="region" label="Регион" column>
				<TheInput name="region" type="text" v-model="busTour.region" />
			</FormField>
			<FormField name="city" label="Город" column>
				<TheSelect
					name="city"
					label="Город"
					:limit="1"
					:selected="busTour.city as SelectItem"
					:list="cities"
					@update="($event) => (busTour.city = $event as SelectItem)"
					@add="changeCity($event)"
				/>
			</FormField>
			<FormField name="seaType" label="Море" column>
				<TheInput name="seaType" type="text" v-model="busTour.seaType" />
			</FormField>

			<div>
				<FormField name="thePriceIncludes" label="В стоимость включено" column>
					<TheTextArea
						v-for="(inc, index) in busTour.thePriceIncludes"
						:key="index"
						name="thePriceIncludes"
						placeholder="textarea"
						v-model="busTour.thePriceIncludes[index]"
					/>
				</FormField>
				<div class="flex flex-row gap-x-3">
					<button
						type="button"
						class="secondary-btn mt-3"
						@click="() => busTour.thePriceIncludes.push('')"
					>
						Добавить день
					</button>
					<button
						type="button"
						class="delete-btn mt-3"
						@click="() => busTour.thePriceIncludes.pop()"
					>
						Удалить день
					</button>
				</div>
			</div>
			<FormField name="images" label="Изображения гостиницы" column>
				<TheFileInput
					name="images"
					accept="image/*"
					multiple
					place="busTour"
					@change="(images: string[]) => (busTour.images = images)"
					:value="busTour.images"
				/>
			</FormField>
			<FormField name="document" label="Файл прайса" column>
				<TheFileInput
					name="document"
					accept="application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
					place="busTour"
					@change="(doc: string[]) => (busTour.documentName = doc[0])"
					:value="busTour.documentName ? [busTour.documentName] : []"
				/>
			</FormField>
			<HotelRoom v-if="type === 'create'" @update="updateTour" />
			<HotelRoom
				v-else
				v-for="(item, index) in busTour.tours"
				:key="index"
				:type="item?.type"
				:room-name="item?.roomName"
				:capacity="item?.capacity"
				:in-room="item?.inRoom"
				:dates-and-prices="item?.datesAndPrices"
				@update="updateTour"
			/>
		</div>
		<div class="sticky bottom-0 flex w-full items-center bg-white px-6 py-4">
			<button class="base-btn max-w-[300px]" type="submit">
				{{ type === 'create' ? 'Создать гостиницу' : 'Сохранить' }}
			</button>
		</div>
	</form>
</template>
