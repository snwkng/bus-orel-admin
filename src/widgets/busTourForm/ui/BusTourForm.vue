<!-- widgets/busTourForm/ui/BusTourForm.vue -->
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
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

const onSubmit = async () => {
	const success = await handleSubmit();
	if (success) {
		router.push('/bus-tours');
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
			<BaseInput
				name="name"
				label="Название Гостиницы"
				column
			/>
			<BaseInput
				name="type"
				label="Тип (отель, гостиница и т.д)"
				column
			/>
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
			<BaseSelect
				name="address.city"
				label="Города"
				column
				:list="citiesList"
			/>
			<BaseInput name="seaType" label="Море" column />

			<BaseArrayFields
				name="includedInThePrice"
				label="В стоимость включено"
				addButtonLabel="Добавить опцию"
				:render-field="
					(idx: number, name: string) =>
						h(BaseInput, {
							label: idx === 0 ? 'В стоимость включено' : '',
							column: true,
							name: name[idx].serviceName,
							placeholder: `День ${idx + 1}`,
						})
				"
			/>

			<!-- <FieldArray name="includedInThePrice" v-slot="{ fields, push, remove }">
				<div class="the-label" v-if="!fields.length">В стоимость включено</div>
				<div class="relative" v-for="(field, idx) in fields" :key="field.key">
					<BaseTextArea
						:label="idx === 0 ? 'В стоимость включено' : ''"
						column
						:name="`includedInThePrice[${idx}]`"
						:placeholder="`Опция ${idx + 1}`"
						:value="busTour.includedInThePrice[idx].serviceName"
					/>
					<button
						type="button"
						title="удалить"
						class="absolute right-[-10px] top-[-10px] rounded-full bg-red-500 p-2 text-white shadow-md transition-all hover:bg-red-500/85"
						:class="{ 'my-8': idx === 0 }"
						@click="remove(idx)"
					>
						<CloseIcon :width="16" :height="16" fill="white" />
					</button>
				</div>
				<div class="flex flex-row gap-x-3">
					<button type="button" class="secondary-btn mt-1" @click="push('')">
						Добавить
					</button>
				</div>
			</FieldArray> -->

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
					'pointer-events-none !bg-deep-blue/70': !meta.dirty || isSubmitting
				}"
				@click="changeStatus(!isPublished)"
				:disabled="!meta.dirty || isSubmitting"
			>
				{{ publishTitle }}
			</button>
		</div>
	</form>
</template>
