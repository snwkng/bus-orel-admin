<!-- widgets/busTourForm/ui/BusTourForm.vue -->
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { computed, h, onMounted, ref } from 'vue';
import {
	BaseInput,
	BaseTextArea,
	TheFileInput,
	BaseSelect,
	BaseArrayFields
} from '@/shared/ui/forms';
import HotelRoom from '@/widgets/hotelRoom';
import { useBusTourForm } from '@/widgets/busTourForm/composables/useBusTourForm';
import { FieldArray } from 'vee-validate';

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
			<BaseInput name="name" label="Название Гостиницы" column />
			<BaseInput name="type" label="Тип (отель, гостиница и т.д)" column />
			<BaseTextArea name="description" label="Описание гостиницы" column />
			<BaseInput name="additionalInfo.food.type" label="Питание" column />
			<BaseInput name="additionalInfo.beach.type" label="Тип пляжа" column />
			<BaseInput
				name="additionalInfo.beach.distanceMinutes"
				label="Расстояние до пляжа в минутах"
				type="number"
				column
			/>
			<BaseInput
				name="additionalInfo.checkInOut.checkIn"
				label="Время заселения"
				column
			/>
			<BaseInput
				name="additionalInfo.checkInOut.checkOut"
				label="Время выселения"
				column
			/>
			<BaseInput name="address.fullAddress" label="Адрес гостиницы" column />
			<BaseInput name="minPrice" label="Минимальная цена заезда" column />
			<BaseInput name="address.region" label="Регион" column />
			<BaseSelect name="address.city" label="Город" column :list="citiesList" />
			<BaseInput name="seaType" label="Море" column />

			<BaseArrayFields
				name="includedInThePrice"
				label="В стоимость включено"
				addButtonLabel="Добавить опцию"
				:initial-value="() => ({ serviceName: '' })"
				:render-field="renderServiceField"
			/>

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
			<!-- <div>
				<HotelRoom name="tours"  />
			</div> -->
		</div>
		<div
			class="sticky bottom-0 flex w-full items-center gap-x-2 bg-white px-6 py-4"
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
					'pointer-events-none !bg-deep-blue/70': meta.dirty || isSubmitting
				}"
				@click="changeStatus(!isPublished)"
				:disabled="meta.dirty || isSubmitting"
			>
				{{ publishTitle }}
			</button>
		</div>
	</form>
</template>
