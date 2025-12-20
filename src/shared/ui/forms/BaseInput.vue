<script setup lang="ts">
import { useField } from 'vee-validate';
import { toRef } from 'vue';
defineOptions({
	inheritAttrs: false // Отключаем автоматическую передачу атрибутов
});

export interface IProps {
	name: string;
	label?: string;
	placeholder?: string;
	column?: boolean;
	required?: boolean;
}

const props = defineProps<IProps>();

const name = toRef(props, 'name');

const { value, errorMessage, meta, handleChange, handleBlur } =
	useField<string>(name);
</script>
<template>
	<div :class="['flex w-full gap-x-5 gap-y-2', { 'flex-col': column }]">
		<label class="the-label" v-if="label" :for="name">
			{{ label }}
			<span class="text-red-600" v-if="required"> * </span>
		</label>
		<input
			:id="name"
			:name="name"
			type="text"
			:value="value"
			:placeholder="placeholder"
			:class="[{ '!border-red-500': (meta.touched && !meta.valid) || !meta.valid }, 'the-input']"
			@input="handleChange"
			@blur="handleBlur"
		/>
		<span
			:name="name"
			class="text-red-600"
			v-show="(meta.touched && !meta.valid) || !meta.valid"
		>
			{{ errorMessage }}
		</span>
	</div>
</template>
