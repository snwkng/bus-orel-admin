<script setup lang="ts">
import {
	BaseInput,
	BaseTextArea,
	TheFileInput,
	BaseSelect,
	TheDatePicker,
	BaseArrayFields
} from '@/shared/ui/forms';
import { computed, h, onMounted } from 'vue';
import { useExcursionForm } from '@/widgets/excursionForm/composables/useExcursionForm';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const exId = computed(() => (route?.params?.id as string) || '');

const {
	meta,
	citiesList,
	isSubmitting,
	buttonTitle,
	loadExcursion,
	getCitiesList,
	handleSubmit
} = useExcursionForm(exId.value);

const onSubmit = async () => {
	const success = await handleSubmit();
	if (success) {
		router.push('/excursions');
	}
};

onMounted(async () => {
	await getCitiesList();
	await loadExcursion();
});
</script>
<template>
	<form class="form-container" @submit.prevent="onSubmit">
		<div class="form-container-content">
			<BaseInput
				name="name"
				type="text"
				label="Название экскурсии"
				column
				required
			/>
			<BaseInput
				name="duration"
				type="number"
				label="Длительность экскурсии (в днях)"
				column
			/>
			<BaseSelect
				name="cities"
				label="Города"
				column
				multiple
				:list="citiesList"
			/>
			<BaseInput
				name="price"
				type="number"
				label="Стоимость экскрусии (от)"
				column
			/>
			<TheDatePicker
				name="excursionStartDates"
				label="Даты отправления"
				multi-dates
				column
			/>
			<BaseInput
				name="hotelName"
				type="text"
				label="Название отеля (если есть)"
				column
			/>

			<BaseArrayFields
				name="description"
				label="Программа экскурсии"
				addButtonLabel="Добавить день"
				:render-field="
					({index, fieldName}) =>
						h(BaseTextArea, {
							label: index === 0 ? 'Программа экскурсии' : '',
							column: true,
							name: fieldName,
							placeholder: `День ${index + 1}`,
						})
				"
			/>

			<BaseArrayFields
				name="thePriceIncludes"
				label="В стоимость включено"
				addButtonLabel="Добавить опцию"
				:render-field="
					({index, fieldName}) =>
						h(BaseInput, {
							label: index === 0 ? 'В стоимость включено' : '',
							column: true,
							name: fieldName,
							placeholder: `Дополнительная опция ${index + 1}`,
						})
				"
			/>

			<TheFileInput
				label="Изображения эксркусии"
				column
				name="images"
				accept="image/*"
				multiple
				place="excursion"
			/>
			<TheFileInput
				label="Файл прайса"
				column
				name="documentName"
				accept="application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
				place="excursion"
			/>
		</div>
		<div class="sticky bottom-0 flex w-full items-center bg-white px-6 py-4">
			<button
				class="base-btn max-w-[300px]"
				:class="{
					'pointer-events-none !bg-deep-orange/70': !meta.dirty || isSubmitting
				}"
				type="submit"
				:disabled="!meta.dirty || isSubmitting"
			>
				{{ buttonTitle }}
			</button>
		</div>
	</form>
</template>
