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
	width?: 'sm' | 'md' | 'lg' | 'full'
}

const props = withDefaults(defineProps<IProps>(), {
	multiDates: false,
	width: 'lg'
});

const name = toRef(props, 'name');

const { value, errorMessage, meta, handleChange, handleBlur } =
	useField<string>(name);
</script>

<template>
	<div :class="['flex gap-x-5 gap-y-1', { 'flex-col': column }, `w-${width}`]">
		<label class="the-label" v-if="label" :for="name">
			{{ label }}
			<span class="text-red-600" v-if="required">*</span>
		</label>
		<VueDatePicker
			:id="name"
			v-model="value"
			:format-locale="ru"
			:multi-dates="multiDates"
			:enable-time-picker="false"
			:min-date="new Date()"
			format="dd MMMM yyyy"
			:ui="{ input: (!meta.valid || errorMessage) ? 'date-picker-error' : '' }"
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
			v-show="(!meta.valid || errorMessage)"
		>
			{{ errorMessage }}
		</span>
	</div>
</template>

<style>
.date-picker-error {
  border-color: red;

	&:hover {
		border-color: red;
	}
}
</style>
