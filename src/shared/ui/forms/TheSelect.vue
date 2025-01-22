<script setup lang="ts">
import { computed, ref } from 'vue';

import { ArrowDown } from '@/shared/ui/icons';

export interface Props {
	label?: string;
	placeholder?: string;
	modelValue: string[];
	type?: string;
}

const props = withDefaults(defineProps<Props>(), {
	label: '',
	placeholder: '',
	modelValue: () => [],
	type: 'text'
});

const emit =
	defineEmits<(event: 'update:modelValue', payload: string[]) => void>();

const showSelect = ref(false);

const value = computed({
	get() {
		return props.modelValue;
	},

	set(newValue: string[]) {
		emit('update:modelValue', newValue);
	}
});

const toggle = () => {
	showSelect.value = !showSelect.value;
};

const close = () => {
	showSelect.value = false;
};
</script>
<template>
	<div class="block" @click="toggle" @keydown.enter="toggle">
		<span class="text-slate-700">{{ label }}</span>
		<div
			class="relative mt-1 flex w-full cursor-pointer items-center justify-between rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
			:class="[
				{ 'border-indigo-300 ring ring-indigo-200 ring-opacity-50': showSelect }
			]"
			v-click-away="close"
		>
			<div>
				<div v-for="item in value" :key="item">
					{{ item }}
				</div>
        <div v-if="showSelect">adsassda</div>
			</div>
			<ArrowDown class="transition-all" :class="{ 'rotate-180': showSelect }" />
		</div>
	</div>
</template>
