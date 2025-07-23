<script setup lang="ts">
import { useField } from 'vee-validate';
import { toRef } from 'vue';
import type { StringSchema } from 'yup';
defineOptions({
	inheritAttrs: false // Отключаем автоматическую передачу атрибутов
});

export interface IProps {
	type?: string;
	name: string;
	label?: string;
	placeholder?: string;
	validator?: StringSchema<string>;
	initialValue: string;
	column?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
	type: 'text',
});

const name = toRef(props, 'name');

const {
  value,
  errorMessage,
  meta,
} = useField(name, props.validator, {initialValue: props.initialValue})

</script>
<template>
	<div :class="['flex w-full gap-x-5 gap-y-2', { 'flex-col': column }]">
		<label class="the-label" v-if="label" :for="name">
			{{ label }} <span class="text-red-600" v-if="validator?.describe().tests?.some((x) => x.name === 'required')">*</span>
		</label>
		<input
			:id="name"
			:name="name"
			:type="type"
			v-model="value"
			:placeholder="placeholder"
			class="the-input"
		/>
		<span :name="name" class="text-red-600" v-show="errorMessage || meta.valid">{{ errorMessage }}</span>
	</div>
</template>
