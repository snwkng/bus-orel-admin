<script setup lang="ts">
import { useField } from 'vee-validate';
import { toRef } from 'vue';
import type { StringSchema } from 'yup';
defineOptions({
	inheritAttrs: false // Отключаем автоматическую передачу атрибутов
});

export interface IProps {
	name: string;
	label?: string;
	placeholder?: string;
	validator?: StringSchema<string>;
	value?: string;
	column?: boolean;
}

const props = defineProps<IProps>();

const name = toRef(props, 'name');

const { value, errorMessage, meta } = useField(name, props.validator, {
	initialValue: props?.value || ''
});
</script>
<template>
	<div :class="['flex w-full gap-x-5 gap-y-2', { 'flex-col': column }]">
		<label class="the-label" v-if="label" :for="name">
			{{ label }}
			<span
				class="text-red-600"
				v-if="validator?.describe().tests?.some((x) => x.name === 'required')"
				>*</span
			>
		</label>
		<textarea
			:class="[
				{ '!border-red-500': !meta.valid },
				'the-input whitespace-pre-line'
			]"
			rows="4"
			:name="name"
			:placeholder="placeholder"
			v-model.trim="value"
		/>
		<span
			:name="name"
			class="text-red-600"
			v-show="errorMessage || !meta.valid"
			>{{ errorMessage }}</span
		>
	</div>
</template>
