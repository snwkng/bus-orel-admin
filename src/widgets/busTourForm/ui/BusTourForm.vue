<!-- widgets/busTourForm/ui/BusTourForm.vue -->
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { onMounted } from 'vue';
import type { IHotelRoomInfo } from '@/entities/busTours/model/types';
import { useBusTourCityStore } from '@/entities/busTourCities/model';
import { storeToRefs } from 'pinia';
import {
	TheInput,
	TheTextArea,
	TheFileInput,
	TheSelect
} from '@/shared/ui/forms';
import FormField from '@/entities/formField/ui/FormField.vue';
import HotelRoom from '@/widgets/hotelRoom';
import { useBusTourForm } from '@/features/busTourForm/composables/useBusTourForm';

export interface Props {
	type: string;
}

const props = defineProps<Props>();

const router = useRouter();
const route = useRoute();

const { busTour, citiesList, loadTour, saveTour, getCitiesList } =
	useBusTourForm(props.type as string, route.params.id as string);

const handleSubmit = async () => {
	await saveTour();
	router.push('/bus-tours');
};

const updateTour = (tours: IHotelRoomInfo[]) => {
	busTour.value.tours = tours;
};

onMounted(async () => {
	await getCitiesList();
	await loadTour();
});
</script>
<template>
	<form class="form-container" @submit.prevent="handleSubmit">
		<div class="form-container-content">
			<FormField name="name" label="Название Гостиницы" column>
				<TheInput name="name" type="text" v-model="busTour.name" />
			</FormField>
			<FormField name="type" label="Тип (отель, гостиница и т.д)" column>
				<TheInput name="type" type="text" v-model="busTour.type" />
			</FormField>
			<FormField name="locationDescription" label="Описание гостиницы" column>
				<TheTextArea
					name="locationDescription"
					type="text"
					v-model="busTour.description"
				/>
			</FormField>
			<FormField name="food" label="Питание" column>
				<TheInput
					name="food"
					type="text"
					v-model="busTour.additionalInfo.food.type"
				/>
			</FormField>
			<FormField name="beach" label="Тип пляжа" column>
				<TheInput
					name="beach"
					type="text"
					v-model="busTour.additionalInfo.beach.type"
				/>
			</FormField>
			<FormField
				name="distanceToBeach"
				label="Расстояние до пляжа в минутах"
				column
			>
				<TheInput
					name="distanceToBeach"
					type="number"
					placeholder="Время в минутах"
					v-model="busTour.additionalInfo.beach.distanceMinutes"
				/>
			</FormField>
			<FormField
				name="checkInConditions"
				label="Условия заселения / выселения"
				column
			>
				<TheInput
					name="checkInConditions"
					placeholder="Время заселения"
					v-model="busTour.additionalInfo.checkInOut.checkIn"
				/>
				<TheInput
					name="checkInConditions"
					placeholder="Время выселения"
					v-model="busTour.additionalInfo.checkInOut.checkOut"
				/>
			</FormField>
			<FormField name="address" label="Адрес гостиницы" column>
				<TheInput
					name="address"
					type="text"
					v-model="busTour.address.fullAddress"
				/>
			</FormField>
			<FormField name="price" label="Минимальная цена заезда" column>
				<TheInput name="price" type="number" v-model="busTour.minPrice" />
			</FormField>
			<FormField name="region" label="Регион" column>
				<TheInput name="region" type="text" v-model="busTour.address.region" />
			</FormField>
			<FormField name="city" label="Город" column>
				<TheSelect
					name="city"
					label="Город"
					:limit="1"
					:selected="busTour.address.city"
					:list="citiesList"
					@update="($event) => (busTour.address.city = $event as string)"
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
						placeholder="Что включено в стоимость"
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
			<div>
				<HotelRoom :hotels-info="busTour.tours" @update="updateTour" />
			</div>
		</div>
		<div class="sticky bottom-0 flex w-full items-center bg-white px-6 py-4">
			<button class="base-btn max-w-[300px]" type="submit">
				{{ type === 'create' ? 'Создать гостиницу' : 'Сохранить' }}
			</button>
		</div>
	</form>
</template>
