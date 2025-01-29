<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { ArrowDown } from '@/shared/ui/icons';
import { TheInput } from '@/shared/ui/forms';

export interface Props {
	label?: string;
	placeholder?: string;
	modelValue: SelectItem[];
	list: SelectItem[];
	type?: string;
}

const props = withDefaults(defineProps<Props>(), {
	label: '',
	placeholder: '',
	modelValue: () => [] as SelectItem[],
	list: () => [
		{ id: 1, name: 'Москва' },
		{ id: 2, name: 'Санкт-Петербург' },
		{ id: 3, name: 'Новосибирск' },
		{ id: 4, name: 'Дагестан' },
		{ id: 5, name: 'Орел' },
		{ id: 6, name: 'Мценск' },
		{ id: 7, name: 'Несвиж' },
		{ id: 8, name: 'Минск' },
		{ id: 9, name: 'Могилев' }
	],
	type: 'text'
});

const emit =
	defineEmits<(event: 'update:modelValue', payload: SelectItem[]) => void>();

const showSelect = ref(false);
const inputValue = ref('');

const value = computed({
	get() {
		return props.modelValue;
	},

	set(newValue: SelectItem[]) {
		emit('update:modelValue', newValue);
	}
});

const selectedItem = computed(() =>
	props.list.filter(
		(x: SelectItem) =>
			value.value.findIndex((y: SelectItem) => y.id === x.id) !== -1
	)
);

const searchableList = computed(() => {
	if (inputValue.value) {
		return props.list.filter((x: SelectItem) => x.name?.toLowerCase().includes(inputValue.value.toLowerCase()))
	} else {
		return props.list
	}
})

const toggle = () => {
	showSelect.value = !showSelect.value;
};

const close = () => {
	showSelect.value = false;
};

const addItem = (item: SelectItem) => {
	if (value.value.findIndex((x: SelectItem) => x.id === item.id) === -1)
		value.value.push(item);
};

const removeItem = (item: SelectItem) => {
	const index = value.value.findIndex((x: SelectItem) => x.id === item.id)
	value.value.splice(index, 1);
};
</script>
<template>
	<div class="block" v-click-away="close">
		<span class="text-slate-700">{{ label }}</span>
		<div
			class="relative mt-1 flex w-full cursor-pointer items-center justify-between rounded-md border-gray-300 bg-white shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
			:class="[
				{ 'border-indigo-300 ring ring-indigo-200 ring-opacity-50': showSelect }
			]"
		>
			<div
				class="flex min-h-[42px] w-full flex-wrap gap-2 px-3 py-2"
				@click="toggle"
				@keydown.enter="toggle"
			>
				<div
					v-for="item in selectedItem"
					:key="item.id"
					@click.stop="removeItem(item)"
					class="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1"
				>
					{{ item.name }}
				</div>
			</div>
			<div
				class="absolute left-0 top-[calc(100%+10px)] z-10 w-full rounded-lg bg-white shadow-md"
				v-if="showSelect"
			>
				<div class="py-2">
					<TheInput
						class="px-2"
						label=""
						type="text"
						:modelValue="inputValue"
						@update:modelValue="($event) => (inputValue = $event)"
					/>
					<div
						v-for="item in searchableList"
						:key="item.id"
						class="p-2 hover:bg-gray-50"
						@click="addItem(item)"
					>
						<span>{{ item.name }}</span>
					</div>
				</div>
			</div>
			<ArrowDown class="transition-all" :class="{ 'rotate-180': showSelect }" />
		</div>
	</div>
</template>
