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
	width?: 'sm' | 'md' | 'lg' | 'full'
}

const props = withDefaults(defineProps<IProps>(), {
	width: 'md'
});

const name = toRef(props, 'name');

const { value, errorMessage, meta, handleChange, handleBlur } =
	useField<string>(name);
</script>
<template>
	<div :class="['flex w-full gap-x-5 gap-y-2', { 'flex-col': column }, `w-${width}`]">
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
			:class="[{ 'border-red-500!': ((meta.touched && !meta.valid) || errorMessage) }, 'the-input']"
			@input="handleChange"
			@blur="handleBlur($event, true)" 
		/>
		<span
			:name="name"
			class="text-red-600"
			v-show="((meta.touched && !meta.valid) || errorMessage)"
		>
			{{ errorMessage }}
		</span>
	</div>
</template>
