<!-- widgets/busTourForm/ui/BusTourForm.vue -->
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { computed, h, onMounted } from 'vue';
import {
	BaseInput,
	BaseTextArea,
	TheFileInput,
	BaseSelect,
	BaseArrayFields,
	FormSection
} from '@/shared/ui/forms';
import { useBusTourForm } from '@/widgets/busTourForm/composables/useBusTourForm';
import HotelRooms from '@/entities/hotelRooms/ui/HotelRooms.vue';

const route = useRoute();
const router = useRouter();
const tourId = computed(() => (route?.params?.id as string) || '');

const {
	meta,
	citiesList,
	isSubmitting,
	buttonTitle,
	isPublished,
	publishTitle,
	loadTour,
	getCitiesList,
	handleSubmit,
	changeStatus
} = useBusTourForm(tourId.value);

const renderServiceField = ({
	index,
	fieldName
}: {
	index: number;
	fieldName: string;
}) =>
	h(BaseInput, {
		name: `${fieldName}.serviceName`,
		label: index === 0 ? 'В стоимость включено' : '',
		placeholder: 'Название услуги',
		column: true
	});

const onSubmit = async () => {
	const success = await handleSubmit();
	if (success) {
		router.push('/hotels');
	}
};

onMounted(async () => {
	await getCitiesList();
	await loadTour();
});
</script>
<template>
	<form class="form-container" @submit.prevent="onSubmit">
		<div class="form-container-content">
			<FormSection title="Основная информация">
				<BaseInput
					name="name"
					label="Название гостиницы"
					column
					required
					width="w-full"
				/>
				<div class="grid gap-4 sm:grid-cols-2">
					<BaseInput
						name="type"
						label="Тип (отель, гостиница и т.д)"
						column
						required
						width="w-full"
					/>
					<BaseInput
						name="registryNumber"
						label="Регистрационный номер"
						column
						required
						width="w-full"
					/>
				</div>
				<BaseTextArea
					name="description"
					label="Описание гостиницы"
					column
					width="w-full"
				/>
			</FormSection>

			<FormSection title="Номера">
				<HotelRooms name="rooms" required />
			</FormSection>

			<FormSection title="Расположение">
				<BaseInput
					name="address.fullAddress"
					label="Адрес гостиницы"
					column
					width="w-full"
				/>
				<div class="grid gap-4 sm:grid-cols-2">
					<BaseInput
						name="address.region"
						label="Регион"
						column
						width="w-full"
					/>
					<BaseSelect
						name="address.city"
						label="Город"
						column
						width="w-full"
						:list="citiesList"
					/>
				</div>
				<BaseInput name="seaType" label="Море" column />
			</FormSection>

			<FormSection title="Условия проживания">
				<BaseInput name="additionalInfo.food.type" label="Питание" column />
				<div class="grid gap-4 sm:grid-cols-2">
					<BaseInput
						name="additionalInfo.beach.type"
						label="Тип пляжа"
						column
						width="w-full"
					/>
					<BaseInput
						name="additionalInfo.beach.distanceMinutes"
						label="Расстояние до пляжа в минутах"
						type="number"
						column
						width="w-full"
					/>
				</div>
				<div class="grid gap-4 sm:grid-cols-2">
					<BaseInput
						name="additionalInfo.checkInOut.checkIn"
						label="Время заселения"
						column
						width="w-full"
					/>
					<BaseInput
						name="additionalInfo.checkInOut.checkOut"
						label="Время выселения"
						column
						width="w-full"
					/>
				</div>
			</FormSection>

			<FormSection title="Цена и услуги">
				<BaseInput
					name="minPrice"
					label="Минимальная цена заезда"
					column
					required
				/>
				<BaseArrayFields
					name="includedInThePrice"
					label="В стоимость включено"
					addButtonLabel="Добавить опцию"
					:initial-value="() => ({ serviceName: '' })"
					:render-field="renderServiceField"
				/>
			</FormSection>

			<FormSection title="Файлы">
				<TheFileInput
					label="Изображения гостиницы"
					column
					name="images"
					accept="image/*"
					multiple
					place="busTour"
				/>
				<TheFileInput
					label="Файл прайса"
					column
					name="documentName"
					accept="application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
					place="busTour"
				/>
			</FormSection>
		</div>
		<div
			class="sticky bottom-0 flex w-full items-center gap-x-2 rounded-2xl bg-white px-6 py-4 shadow-card"
		>
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

			<button
				v-if="tourId"
				class="secondary-btn max-w-[300px]"
				:class="{
					'pointer-events-none !bg-deep-teal/70': meta.dirty || isSubmitting
				}"
				@click="changeStatus(!isPublished)"
				:disabled="meta.dirty || isSubmitting"
			>
				{{ publishTitle }}
			</button>
		</div>
	</form>
</template>
