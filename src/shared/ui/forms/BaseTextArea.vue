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
	column?: boolean;
	required?: boolean;
	width?: 'sm' | 'md' | 'lg' | '2xl' | '3xl' | '4xl' | 'full'
}

const props = withDefaults(defineProps<IProps>(), {
	width: '4xl'
});

const name = toRef(props, 'name');

const { value, errorMessage, meta } =
	useField<string>(name);
</script>
<template>
	<div :class="['flex gap-x-5 gap-y-1', { 'flex-col': column }, `w-${width}`]">
		<label class="the-label" v-if="label" :for="name">
			{{ label }}
			<span
				class="text-red-600"
				v-if="required"
				>*</span
			>
		</label>
		<textarea
			:class="[
				{ 'border-red-600!':  ((meta.touched && !meta.valid) || errorMessage) },
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
			v-show=" ((meta.touched && !meta.valid) || errorMessage)"
			>
				{{ errorMessage }}
			</span>
	</div>
</template>
