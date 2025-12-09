<script setup lang="ts">
import {
	BaseInput,
	BaseTextArea,
	TheFileInput,
	TheSelect,
	TheDatePicker
} from '@/shared/ui/forms';
import {
	FieldArray,
} from 'vee-validate';
import { computed, onMounted } from 'vue';
import { useExcursionForm } from '@/widgets/excursionForm/composables/useExcursionForm';
import { CloseIcon } from '@/shared/ui/icons';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const exId = computed(() => route?.params?.id as string || '');

const {
	values,
	meta,
	citiesList,
	isSubmitting,
	buttonTitle,
	loadExcursion,
	getCitiesList,
	handleSubmit,
} = useExcursionForm(exId.value);

const onSubmit = async () => {
	const success = await handleSubmit()
	if (success) {
		 router.push('/excursions');
	}
}

onMounted(async () => {
	await getCitiesList();
	await loadExcursion();
});
</script>
<template>
	<form
		ref="excursionForm"
		class="form-container"
		@submit.prevent="onSubmit"
	>
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
			<TheSelect
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
				:value="values.excursionStartDates"
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

			<FieldArray name="description" v-slot="{ fields, push, remove }">
				<div class="the-label" v-if="!fields.length">Программа экскурсии</div>
				<div class="relative" v-for="(field, idx) in fields" :key="field.key">
					<BaseTextArea
						:label="idx === 0 ? 'Программа экскурсии' : ''"
						column
						:name="`description[${idx}]`"
						:placeholder="`День ${idx + 1}`"
						:value="values.description[idx]"
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
						Добавить день
					</button>
				</div>
			</FieldArray>

			<FieldArray name="thePriceIncludes" v-slot="{ fields, push, remove }">
				<div class="the-label" v-if="!fields.length">В стоимость включено</div>
				<div class="relative" v-for="(field, idx) in fields" :key="field.key">
					<BaseInput
						:label="idx === 0 ? 'В стоимость включено' : ''"
						column
						:name="`thePriceIncludes[${idx}]`"
						placeholder="Что включено в стоимость"
						:value="values.thePriceIncludes[idx]"
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
						Добавить опцию
					</button>
				</div>
			</FieldArray>
			<TheFileInput
				label="Изображения эксркусии"
				column
				name="images"
				accept="image/*"
				multiple
				place="excursion"
				:value="values.images"
			/>
			<TheFileInput
				label="Файл прайса"
				column
				name="documentName"
				accept="application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
				place="excursion"
				:value="values.documentName"
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
