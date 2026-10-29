<script setup lang="ts">
import {
	BaseInput,
	BaseTextArea,
	TheFileInput,
	BaseSelect,
	TheDatePicker,
	BaseArrayFields,
	FormSection
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
	typesList,
	isSubmitting,
	buttonTitle,
	values,
	loadExcursion,
	getCitiesList,
	getTypesList,
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
	await getTypesList();
	await loadExcursion();
});
</script>
<template>
	<form class="form-container" @submit.prevent>
		<div class="form-container-content">
			<FormSection title="Основная информация">
				<BaseInput
					name="name"
					type="text"
					label="Название экскурсии"
					column
					required
					width="w-full"
				/>
				<div class="grid gap-4 sm:grid-cols-2">
					<BaseSelect
						name="type"
						label="Тип экскурсии"
						column
						required
						width="w-full"
						:list="typesList"
					/>
					<BaseSelect
						name="cities"
						label="Города"
						column
						multiple
						required
						width="w-full"
						:list="citiesList"
					/>
				</div>
				<div class="grid gap-4 sm:grid-cols-2">
					<BaseInput
						name="duration"
						type="number"
						label="Длительность экскурсии (в днях)"
						column
						width="w-full"
					/>
					<BaseInput
						name="price"
						type="number"
						label="Стоимость экскурсии (от)"
						column
						required
						width="w-full"
					/>
				</div>
				<BaseInput
					name="hotelName"
					type="text"
					label="Название отеля (если есть)"
					column
				/>
				<TheDatePicker
					name="excursionStartDates"
					label="Даты отправления"
					multi-dates
					column
					width="w-full"
				/>
			</FormSection>

			<FormSection title="Программа и услуги">
				<BaseArrayFields
					name="description"
					label="Программа экскурсии"
					:max="values.duration"
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

				<BaseArrayFields
					name="additionallyPaid"
					label="Дополнительно оплачивается"
					addButtonLabel="Добавить опцию"
					:render-field="
						({index, fieldName}) =>
							h(BaseInput, {
								label: index === 0 ? 'Дополнительно оплачивается' : '',
								column: true,
								name: fieldName,
								placeholder: `Платная опция  ${index + 1}`,
							})
					"
				/>
			</FormSection>

			<FormSection title="Файлы">
				<TheFileInput
					label="Изображения экскурсии"
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
			</FormSection>
		</div>
		<div class="sticky bottom-0 flex w-full items-center rounded-2xl bg-white px-6 py-4 shadow-card">
			<button
				class="base-btn max-w-75 cursor-pointer"
				:class="{
					'pointer-events-none bg-deep-orange/70!': !meta.dirty || isSubmitting
				}"
				type="button"
				:disabled="!meta.dirty || isSubmitting"
				@click.stop.prevent="onSubmit"
			>
				{{ buttonTitle }}
			</button>
		</div>
	</form>
</template>
