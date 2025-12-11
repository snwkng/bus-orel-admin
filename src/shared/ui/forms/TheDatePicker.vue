<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { ru } from 'date-fns/locale';
import { useField } from 'vee-validate';
import { toRef } from 'vue';
import type { StringSchema } from 'yup';

export interface IProps {
	name: string;
	label?: string;
	value?: string[] | string;
	column?: boolean;
	multiDates?: boolean;
	required?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
	multiDates: false
});

const name = toRef(props, 'name');

const { value, errorMessage, meta, handleChange, handleBlur } =
	useField<string>(name);
</script>

<template>
	<div :class="['flex w-full gap-x-5 gap-y-2', { 'flex-col': column }]">
		<label class="the-label" v-if="label" :for="name">
			{{ label }}
			<span class="text-red-600" v-if="required">*</span>
		</label>
		<VueDatePicker
			v-model="value"
			:format-locale="ru"
			:multi-dates="multiDates"
			:enable-time-picker="false"
			format="dd MMMM yyyy"
			:class="{ '!border-red-500': !meta.valid }"
		>
			<template #action-row="{ selectDate }">
				<button class="secondary-btn w-full" @click.stop.prevent="selectDate">
					Выбрать даты
				</button>
			</template>
		</VueDatePicker>
		<span
			:name="name"
			class="text-red-600"
			v-show="meta.touched && (errorMessage || !meta.valid)"
		>
			{{ errorMessage }}
		</span>
	</div>
</template>
