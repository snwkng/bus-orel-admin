<!-- widgets/busTourForm/ui/BusTourForm.vue -->
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import type { IHotelRoomInfo, ITour } from '@/entities/busTours/model/types';
import {
	BaseInput,
	BaseTextArea,
	TheFileInput,
	TheSelect
} from '@/shared/ui/forms';
import HotelRoom from '@/widgets/hotelRoom';
import { useBusTourForm } from '@/features/busTourForm/composables/useBusTourForm';
import { onInvalidSubmit } from '@/shared/config/composables/useHelpers';
import { string } from 'yup';
import {
	FieldArray,
	Form,
	type FormContext,
	type GenericObject
} from 'vee-validate';
import { CloseIcon } from '@/shared/ui/icons';

import { togglePublishTour } from '@/entities/busTours/api';

export interface Props {
	type: string;
}

const props = defineProps<Props>();

const router = useRouter();
const route = useRoute();

const busTourForm = ref<FormContext | null>(null);

const { busTour, citiesList, loadTour, saveTour, getCitiesList } =
	useBusTourForm(props.type as string, route.params.id as string);

const handleSubmit = async (values: GenericObject) => {
	await saveTour(values as ITour);
	// router.push('/bus-tours');
};

// const updateTour = (tours: IHotelRoomInfo[]) => {
// 	busTour.value.tours = tours;
// };

const togglePublished = async (published: boolean) => {
	busTour.value = await togglePublishTour(route.params.id as string, published);
};

onMounted(async () => {
	await getCitiesList();
	await loadTour().then(() => {
		// принудительно устанавливаем значения формы после их получения
		busTourForm.value?.resetForm({ values: { ...busTour.value } });
	});
});
</script>
<template>
	<Form
		ref="busTourForm"
		class="form-container"
		:initial-values="busTour"
		@submit="handleSubmit"
		@invalid-submit="onInvalidSubmit"
		v-slot="{ values }"
	>
		<!-- {{ values }} -->
		<div class="form-container-content">
			<BaseInput
				name="name"
				label="Название Гостиницы"
				column
				:validator="string().required('Обязательное поле')"
			/>
			<BaseInput
				name="type"
				label="Тип (отель, гостиница и т.д)"
				column
				:validator="string().required('Обязательное поле')"
				:value="busTour.type"
			/>
			<BaseTextArea
				name="description"
				label="Описание гостиницы"
				column
				:value="busTour.description"
			/>
			<BaseInput
				name="additionalInfo.food.type"
				label="Питание"
				column
				:value="busTour.additionalInfo.food.type"
			/>
			<BaseInput
				name="additionalInfo.beach.type"
				label="Тип пляжа"
				column
				:value="busTour.additionalInfo.beach.type"
			/>
			<BaseInput
				name="additionalInfo.beach.distanceMinutes"
				label="Расстояние до пляжа в минутах"
				type="number"
				column
				:value="busTour.additionalInfo.beach.distanceMinutes"
			/>
			<BaseInput
				name="additionalInfo.checkInOut.checkIn"
				label="Время заселения"
				column
				:value="busTour.additionalInfo.checkInOut.checkIn"
			/>
			<BaseInput
				name="additionalInfo.checkInOut.checkOut"
				label="Время выселения"
				column
				:value="busTour.additionalInfo.checkInOut.checkOut"
			/>
			<BaseInput
				name="address.fullAddress"
				label="Адрес гостиницы"
				column
				:value="busTour.address.fullAddress"
			/>
			<BaseInput
				name="minPrice"
				label="Минимальная цена заезда"
				type="number"
				column
				:value="busTour.minPrice"
			/>
			<BaseInput
				name="address.region"
				label="Регион"
				column
				:value="busTour.address.region"
			/>
			<TheSelect name="address.city" label="Города" column :list="citiesList" />
			<BaseInput name="seaType" label="Море" column :value="busTour.seaType" />

			<FieldArray name="includedInThePrice" v-slot="{ fields, push, remove }">
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
			</FieldArray>

			<TheFileInput
				label="Изображения гостиницы"
				column
				name="images"
				accept="image/*"
				multiple
				place="busTour"
				:value="busTour.images"
			/>
			<TheFileInput
				label="Файл прайса"
				column
				name="documentName"
				accept="application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
				place="busTour"
				:value="busTour.documentName"
			/>
			<div>
				{{ busTour.tours }}
				<HotelRoom name="tours" :values="busTour.tours" />
			</div>
		</div>
		<div
			class="sticky bottom-0 flex w-full items-center gap-x-2 bg-white px-6 py-4"
		>
			<button class="base-btn max-w-[300px]" type="submit">
				{{ type === 'create' ? 'Создать гостиницу' : 'Сохранить' }}
			</button>

			<button
				class="secondary-btn max-w-[300px]"
				type="button"
				v-if="type === 'edit'"
				@click="togglePublished(!busTour.published)"
			>
				{{ busTour.published ? 'Снять с публикации' : 'Опубликовать' }}
			</button>
		</div>
	</Form>
</template>
