<script setup lang="ts">
import {
	TheInput,
	TheTextArea,
	TheFileInput,
	TheSelect,
	TheDatePicker
} from '@/shared/ui/forms';
import FormField from '@/entities/formField/ui/FormField.vue';
import { useRoute, useRouter } from 'vue-router';
import { onMounted } from 'vue';
import { useExcursionCityStore } from '@/entities/excursionCities/model';
import { storeToRefs } from 'pinia';
import { useExcursionForm } from '@/features/excursionForm/composables/useExcursionForm';

export interface Props {
	type: string;
}

const props = defineProps<Props>();

const { getCities, addCity } = useExcursionCityStore();

const { cities } = storeToRefs(useExcursionCityStore());

const router = useRouter();
const route = useRoute();

const { excursion, loadExcursion, saveExcursion } = useExcursionForm(
  props.type as string,
  route.params.id as string
);

const changeCity = async (newCity: string) => {
	const city = await addCity(newCity);
	(excursion.value.cities as SelectItem[]).push(city);
};

const handleSubmit = async () => {
  await saveExcursion();
  router.push('/excursions');
};

onMounted(async () => {
	await getCities();
	await loadExcursion();
});
</script>
<template>
	<form
		class="form-container"
		@submit.prevent="handleSubmit"
	>
		<div class="form-container-content">
			<FormField name="name" label="Название экскурсии" column>
				<TheInput name="name" type="text" v-model="excursion.name" />
			</FormField>
			<FormField name="duration" label="Длительность экскурсии (в днях)" column>
				<TheInput name="duration" type="number" v-model="excursion.duration" />
			</FormField>
			<FormField name="city" label="Город" column>
				<TheSelect
					name="city"
					:selected="excursion.cities"
					:list="cities"
					@update="($event) => (excursion.cities = $event as SelectItem[])"
					@add="changeCity($event)"
				/>
			</FormField>
			<FormField name="price" label="Стоимость экскрусии" column>
				<TheInput name="price" type="number" v-model="excursion.price" />
			</FormField>
			<FormField name="excursionStart" label="Дата отправления" column>
				<TheDatePicker
					v-model="excursion.excursionStart"
				/>
			</FormField>
			<FormField name="hotelName" label="Название отеля (если есть)" column>
				<TheInput
					name="hotelName"
					type="text"
					v-model="excursion.hotelName"
				/>
			</FormField>
			<div>
				<FormField name="description" label="Программа экскурсии" column>
					<TheTextArea
						v-for="(inc, index) in excursion.description"
						:key="index"
						name="description"
						placeholder="Введите программу экскурсии"
						v-model="excursion.description[index]"
					/>
				</FormField>
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

			<div>
				<FormField name="thePriceIncludes" label="В стоимость включено" column>
					<TheTextArea
						v-for="(inc, index) in excursion.thePriceIncludes"
						:key="index"
						name="thePriceIncludes"
						placeholder="Что включено в стоимость"
						v-model="excursion.thePriceIncludes[index]"
					/>
				</FormField>
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
			<FormField name="images" label="Изображения эксркусии" column>
				<TheFileInput
					name="images"
					accept="image/*"
					multiple
					place="excursion"
					@change="(images: string[]) => (excursion.images = images)"
					:value="excursion.images"
				/>
			</FormField>
			<FormField name="document" label="Файл прайса" column>
				<TheFileInput
					name="document"
					accept="application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
					place="excursion"
					@change="(doc: string[]) => (excursion.documentName = doc[0])"
					:value="excursion.documentName ? [excursion.documentName] : []"
				/>
			</FormField>
		</div>
		<div class="sticky bottom-0 flex w-full items-center bg-white px-6 py-4">
			<button class="base-btn max-w-[300px]" type="submit">
				{{ type === 'create' ? 'Создать экскурсию' : 'Сохранить' }}
			</button>
		</div>
	</form>
</template>
