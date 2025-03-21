<script setup lang="ts">
import { computed, ref } from 'vue';

import { ArrowDown } from '@/shared/ui/icons';
import { TheInput } from '@/shared/ui/forms';

export interface Props {
	label?: string;
	placeholder?: string;
	modelValue: SelectItem[] | string[] | SelectItem;
	list?: SelectItem[];
	type?: string;
	limit?: number;
}

const props = withDefaults(defineProps<Props>(), {
	label: '',
	placeholder: '',
	modelValue: () => [] as SelectItem[],
	list: () => [],
	type: 'text'
});

const emit = defineEmits<{
	(event: 'update:modelValue', payload: SelectItem[] | SelectItem): void;
	(event: 'add', value: string): void;
}>();

const showSelect = ref(false);
const inputValue = ref('');

const value = computed({
	get() {
		return props.modelValue as SelectItem[];
	},

	set(newValue: SelectItem[]) {
		emit('update:modelValue', newValue);
	}
});

const selectedItem = computed(() =>
	props.list.filter((x: SelectItem) => {
		if (props.limit === 1) {
			return x._id === (value.value as SelectItem)?._id || null;
		} else {
			return value.value.findIndex((y: SelectItem) => y._id === x._id) !== -1;
		}
	})
);

const searchableList = computed(() => {
	if (inputValue.value) {
		return props.list.filter(
			(x: SelectItem) =>
				x.name?.toLowerCase().includes(inputValue.value.toLowerCase()) &&
				selectedItem.value.findIndex((y: SelectItem) => y._id === x._id) === -1
		);
	} else {
		return props.list.filter(
			(x: SelectItem) =>
				selectedItem.value.findIndex((y: SelectItem) => y._id === x._id) === -1
		);
	}
});

const toggle = () => {
	showSelect.value = !showSelect.value;
};

const close = () => {
	showSelect.value = false;
};

const addItem = (item: SelectItem) => {
	if (props.limit !== 1 && value.value.findIndex((x: SelectItem) => x._id === item._id) === -1) {
		value.value.push(item);
	} else {
		(value.value as SelectItem) = item
	}
};

const removeItem = (item: SelectItem) => {
	if (props.limit === 1) {
		(value.value as SelectItem) = {} as SelectItem
	} else {
		const index = value.value.findIndex((x: SelectItem) => x._id === item._id);
		value.value.splice(index, 1);
	}
};

const add = () => {
	if (inputValue.value) {
		emit('add', inputValue.value);
		inputValue.value = '';
	}
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
					:key="item._id"
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
					<div class="relative">
						<TheInput
							class="px-2"
							label=""
							type="text"
							:modelValue="inputValue"
							@update:modelValue="($event) => (inputValue = $event)"
							@keydown.enter.prevent="add"
						/>
						<button
							v-if="!searchableList.length"
							type="button"
							class="base-btn absolute right-0 top-0 z-10 mx-2 h-[42px] shadow-lg"
							@click.stop="add"
						>
							Добавить
						</button>
					</div>
					<div
						class="mt-2 max-h-52 overflow-y-auto"
						v-if="searchableList.length"
					>
						<div
							v-for="item in searchableList"
							:key="item._id"
							class="p-2 hover:bg-gray-50"
							@click.stop="addItem(item)"
						>
							<span>{{ item.name }}</span>
						</div>
					</div>
				</div>
			</div>
			<ArrowDown
				class="transition-all"
				:class="{ 'rotate-180': showSelect }"
				@click="toggle"
			/>
		</div>
	</div>
</template>
