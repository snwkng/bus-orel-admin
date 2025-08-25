<!-- widgets/busTourForm/ui/BusTourForm.vue -->
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { onMounted } from 'vue';
import type { IHotelRoomInfo } from '@/entities/busTours/model/types';
import {
	BaseInput,
	BaseTextArea,
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
				<BaseInput name="name" type="text" v-model="busTour.name" />
			</FormField>
			<FormField name="type" label="Тип (отель, гостиница и т.д)" column>
				<BaseInput name="type" type="text" v-model="busTour.type" />
			</FormField>
			<FormField name="locationDescription" label="Описание гостиницы" column>
				<BaseTextArea
					name="locationDescription"
					type="text"
					v-model="busTour.description"
				/>
			</FormField>
			<FormField name="food" label="Питание" column>
				<BaseInput
					name="food"
					type="text"
					v-model="busTour.additionalInfo.food.type"
				/>
			</FormField>
			<FormField name="beach" label="Тип пляжа" column>
				<BaseInput
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
				<BaseInput
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
				<BaseInput
					name="checkInConditions"
					placeholder="Время заселения"
					v-model="busTour.additionalInfo.checkInOut.checkIn"
				/>
				<BaseInput
					name="checkInConditions"
					placeholder="Время выселения"
					v-model="busTour.additionalInfo.checkInOut.checkOut"
				/>
			</FormField>
			<FormField name="address" label="Адрес гостиницы" column>
				<BaseInput
					name="address"
					type="text"
					v-model="busTour.address.fullAddress"
				/>
			</FormField>
			<FormField name="price" label="Минимальная цена заезда" column>
				<BaseInput name="price" type="number" v-model="busTour.minPrice" />
			</FormField>
			<FormField name="region" label="Регион" column>
				<BaseInput name="region" type="text" v-model="busTour.address.region" />
			</FormField>
			<FormField name="city" label="Город" column>
				<TheSelect
					:selected="busTour.address.city"
					:list="citiesList"
					@addItem="($event: (string | SelectItem)) => (busTour.address.city = $event as string)"
				/>
			</FormField>
			<FormField name="seaType" label="Море" column>
				<BaseInput name="seaType" type="text" v-model="busTour.seaType" />
			</FormField>

			<div>
				<FormField name="includedInThePrice" label="В стоимость включено" column>
					<BaseTextArea
						v-for="(inc, index) in busTour.includedInThePrice"
						:key="index"
						name="includedInThePrice"
						placeholder="Что включено в стоимость"
						v-model="busTour.includedInThePrice[index].serviceName"
					/>
				</FormField>
				<div class="flex flex-row gap-x-3">
					<button
						type="button"
						class="secondary-btn mt-3"
						@click="() => busTour.includedInThePrice.push({serviceName: '', icon: ''})"
					>
						Добавить день
					</button>
					<button
						type="button"
						class="delete-btn mt-3"
						@click="() => busTour.includedInThePrice.pop()"
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
