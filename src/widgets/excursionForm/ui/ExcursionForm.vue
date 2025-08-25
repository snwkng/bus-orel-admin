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
	Form,
	type FormContext,
	type GenericObject
} from 'vee-validate';
import FormField from '@/entities/formField/ui/FormField.vue';
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { useExcursionForm } from '@/features/excursionForm/composables/useExcursionForm';
import { string } from 'yup';
import type { IExcursion } from '@/entities/excursions/model/types';
import { CloseIcon } from '@/shared/ui/icons';

export interface Props {
	type: string;
}

const props = defineProps<Props>();

const router = useRouter();
const route = useRoute();

const excursionForm = ref<FormContext | null>(null);

const { excursion, citiesList, loadExcursion, saveExcursion, getCitiesList } =
	useExcursionForm(props.type as string, route.params.id as string);
const handleSubmit = async (values: GenericObject) => {
	if (values.documentName) {
		values.documentName =  values.documentName?.length ? values.documentName[0] : ''
	}
	await saveExcursion(values as IExcursion);
	router.push('/excursions');
};

const onInvalidSubmit = async ({ errors }: GenericObject) => {
	const keys = Object.keys(errors);
	if (keys?.length) {
		document.getElementById(keys[0])?.scrollIntoView({ behavior: 'smooth' });
	}
};

onMounted(async () => {
	await getCitiesList();
	await loadExcursion().then(() => {
		// принудительно устанавливаем значения формы после их получения
		excursionForm.value?.resetForm({ values: { ...excursion.value } });
	});
});
</script>
<template>
	<Form
		ref="excursionForm"
		class="form-container"
		:initial-values="excursion"
		@submit="handleSubmit"
		@invalid-submit="onInvalidSubmit"
		v-slot="{ values }"
	>
		<!-- {{ values }} -->
		<div class="form-container-content">
			<BaseInput
				name="name"
				type="text"
				label="Название экскурсии"
				column
				:validator="string().required('Обязательное поле')"
				:value="excursion.name"
			/>
			<BaseInput
				name="duration"
				type="number"
				label="Длительность экскурсии (в днях)"
				column
				:value="excursion.duration"
			/>
			<TheSelect
				name="cities"
				label="Города"
				column
				multiple
				:selected="excursion.cities"
				:list="citiesList"
			/>
			<BaseInput
				name="price"
				type="number"
				label="Стоимость экскрусии (от)"
				column
				:value="excursion.price"
			/>
			<TheDatePicker
				:value="excursion.excursionStartDates"
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
				:value="excursion.hotelName"
			/>

			<FieldArray name="description" v-slot="{ fields, push, remove }">
				<div class="the-label" v-if="!fields.length">Программа экскурсии</div>
				<div class="relative" v-for="(field, idx) in fields" :key="field.key">
					<BaseTextArea
						:label="idx === 0 ? 'Программа экскурсии' : ''"
						column
						:name="`description[${idx}]`"
						:placeholder="`День ${idx + 1}`"
						:value="excursion.description[idx]"
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
					<BaseTextArea
						:label="idx === 0 ? 'В стоимость включено' : ''"
						column
						:name="`thePriceIncludes[${idx}]`"
						placeholder="Что включено в стоимость"
						:value="excursion.thePriceIncludes[idx]"
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
			<FormField name="images" label="Изображения эксркусии" column>
				<TheFileInput
					name="images"
					accept="image/*"
					multiple
					place="excursion"
					:value="excursion.images"
				/>
			</FormField>
			<FormField name="documentName" label="Файл прайса" column>
				<TheFileInput
					name="documentName"
					accept="application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
					place="excursion"
					:value="excursion.documentName"
				/>
			</FormField>
		</div>
		<div class="sticky bottom-0 flex w-full items-center bg-white px-6 py-4">
			<button
				class="base-btn max-w-[300px]"
				:class="{
					'pointer-events-none !bg-deep-orange/70':
						JSON.stringify(values) === JSON.stringify(excursion)
				}"
				type="submit"
				:disabled="JSON.stringify(values) === JSON.stringify(excursion)"
			>
				{{ type === 'create' ? 'Создать экскурсию' : 'Сохранить' }}
			</button>
		</div>
	</Form>
</template>
